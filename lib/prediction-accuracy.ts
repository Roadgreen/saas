import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getWeather } from './weather';
import type { WeatherData } from './weather';
import { getClosedDayIndices, getScheduleForDate, type WeekSchedule } from './schedule';

// Re-declare the PredictionItem interface (from predictions.ts) to avoid circular deps
interface PredictionItem {
  recipeId: string;
  recipeName: string;
  predictedQuantity: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface PredictionMetrics {
  overallAccuracy: number;
  predictabilityScore: number;
  totalDaysTracked: number;
  recipeMetrics: {
    recipeId: string;
    recipeName: string;
    avgAccuracy: number;
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    totalPredictions: number;
    avgDeviation: number;
    commonErrors: string[];
  }[];
  dailyBreakdown: {
    date: string;
    avgAccuracy: number;
    totalPredicted: number;
    totalActual: number;
  }[];
}

interface ErrorTagContext {
  deviation: number;
  deviationPercent: number;
  weatherPredicted: WeatherData | null;
  weatherActual: WeatherData | null;
  weatherDeltaTemp: number | null;
  locationId: string | null;
  recipeId: string;
  businessId: string;
  date: Date;
}

const BAD_WEATHER_CONDITIONS = ['Rain', 'Snow', 'Thunderstorm', 'Drizzle'];

// ---------------------------------------------------------------------------
// 1. normalizeDate
// ---------------------------------------------------------------------------

export function normalizeDate(d: Date): Date {
  const normalized = new Date(d);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

// ---------------------------------------------------------------------------
// 2. snapshotAndReconcile
// ---------------------------------------------------------------------------

export async function snapshotAndReconcile(
  businessId: string,
  predictions: PredictionItem[],
  openingHours?: WeekSchedule | null,
): Promise<void> {
  const today = normalizeDate(new Date());

  // Skip snapshot on closed days
  const todaySchedule = getScheduleForDate(openingHours ?? null, today);
  if (todaySchedule?.closed) {
    return;
  }

  // Check if snapshots already exist for today + this business
  const existingCount = await prisma.predictionSnapshot.count({
    where: {
      businessId,
      date: today,
    },
  });

  if (existingCount === 0 && predictions.length > 0) {
    await prisma.predictionSnapshot.createMany({
      data: predictions.map((p) => ({
        date: today,
        recipeId: p.recipeId,
        businessId,
        predictedQuantity: p.predictedQuantity,
        trend: p.trend,
        dayOfWeek: today.getDay(),
        algorithmVersion: 'v1',
      })),
      skipDuplicates: true,
    });
  }

  // Fetch current weather from the business's first location (non-blocking)
  let currentWeather: WeatherData | null = null;
  try {
    const firstLocation = await prisma.location.findFirst({
      where: { businessId },
      select: { latitude: true, longitude: true },
    });

    if (firstLocation?.latitude != null && firstLocation?.longitude != null) {
      currentWeather = await getWeather(
        firstLocation.latitude,
        firstLocation.longitude,
      );

      // Attach weather to today's snapshots if we got it
      if (currentWeather && existingCount === 0 && predictions.length > 0) {
        await prisma.predictionSnapshot.updateMany({
          where: {
            businessId,
            date: today,
          },
          data: {
            weatherForecast: currentWeather as unknown as Prisma.InputJsonValue,
          },
        });
      }
    }
  } catch (err) {
    // Weather fetch is non-blocking; log and continue
    console.error('Failed to fetch weather for snapshot:', err);
  }

  // Check if yesterday's accuracy was already computed
  const yesterday = normalizeDate(new Date());
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayAccuracyCount = await prisma.predictionAccuracy.count({
    where: {
      businessId,
      date: yesterday,
    },
  });

  if (yesterdayAccuracyCount === 0) {
    // Only attempt reconciliation if there were snapshots for yesterday
    const yesterdaySnapshotCount = await prisma.predictionSnapshot.count({
      where: {
        businessId,
        date: yesterday,
      },
    });

    if (yesterdaySnapshotCount > 0) {
      await computeAccuracy(businessId, yesterday);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. computeAccuracy
// ---------------------------------------------------------------------------

export async function computeAccuracy(
  businessId: string,
  date: Date,
): Promise<void> {
  const normalizedDate = normalizeDate(date);
  const nextDay = new Date(normalizedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Fetch prediction snapshots for this date + business
  const snapshots = await prisma.predictionSnapshot.findMany({
    where: {
      businessId,
      date: normalizedDate,
    },
  });

  if (snapshots.length === 0) {
    return;
  }

  // Fetch actual sales from DailySales
  const dailySales = await prisma.dailySales.findMany({
    where: {
      recipe: { businessId },
      date: {
        gte: normalizedDate,
        lt: nextDay,
      },
    },
    select: {
      recipeId: true,
      quantity: true,
    },
  });

  // Fetch actual sales from Order -> OrderItems
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      date: {
        gte: normalizedDate,
        lt: nextDay,
      },
    },
    include: {
      items: {
        select: {
          recipeId: true,
          quantity: true,
        },
      },
    },
  });

  // Group actual sales by recipeId (sum quantities from both sources)
  const actualByRecipe: Record<string, number> = {};

  for (const sale of dailySales) {
    actualByRecipe[sale.recipeId] =
      (actualByRecipe[sale.recipeId] || 0) + sale.quantity;
  }

  for (const order of orders) {
    for (const item of order.items) {
      actualByRecipe[item.recipeId] =
        (actualByRecipe[item.recipeId] || 0) + item.quantity;
    }
  }

  // Fetch current weather for comparison
  let weatherActual: WeatherData | null = null;
  try {
    const firstLocation = await prisma.location.findFirst({
      where: { businessId },
      select: { latitude: true, longitude: true },
    });

    if (firstLocation?.latitude != null && firstLocation?.longitude != null) {
      weatherActual = await getWeather(
        firstLocation.latitude,
        firstLocation.longitude,
      );
    }
  } catch {
    // Non-blocking
  }

  // Build accuracy records
  const accuracyRecords: {
    date: Date;
    recipeId: string;
    locationId: string | null;
    businessId: string;
    predictedQuantity: number;
    actualQuantity: number;
    deviation: number;
    deviationPercent: number;
    accuracyPercent: number;
    errorTags: string[];
    weatherPredicted: Prisma.InputJsonValue | null;
    weatherActual: Prisma.InputJsonValue | null;
    weatherDeltaTemp: number | null;
    snapshotId: string;
  }[] = [];

  for (const snapshot of snapshots) {
    const predicted = snapshot.predictedQuantity;
    const actual = actualByRecipe[snapshot.recipeId] || 0;

    const deviation = actual - predicted;
    const deviationPercent =
      predicted > 0
        ? ((actual - predicted) / predicted) * 100
        : actual > 0
          ? 100
          : 0;
    const accuracyPercent = Math.max(
      0,
      Math.min(100, 100 - Math.abs(deviationPercent)),
    );

    const weatherPredicted =
      (snapshot.weatherForecast as Record<string, unknown>) || null;

    let weatherDeltaTemp: number | null = null;
    if (weatherPredicted && weatherActual) {
      const predictedTemp =
        typeof weatherPredicted.temp === 'number' ? weatherPredicted.temp : null;
      if (predictedTemp != null) {
        weatherDeltaTemp = weatherActual.temp - predictedTemp;
      }
    }

    const errorTags = await identifyErrorTags({
      deviation,
      deviationPercent,
      weatherPredicted: weatherPredicted as unknown as WeatherData | null,
      weatherActual,
      weatherDeltaTemp,
      locationId: snapshot.locationId,
      recipeId: snapshot.recipeId,
      businessId,
      date: normalizedDate,
    });

    accuracyRecords.push({
      date: normalizedDate,
      recipeId: snapshot.recipeId,
      locationId: snapshot.locationId,
      businessId,
      predictedQuantity: predicted,
      actualQuantity: actual,
      deviation,
      deviationPercent: Math.round(deviationPercent * 100) / 100,
      accuracyPercent: Math.round(accuracyPercent * 100) / 100,
      errorTags,
      weatherPredicted: weatherPredicted
        ? (weatherPredicted as Prisma.InputJsonValue)
        : null,
      weatherActual: weatherActual
        ? (weatherActual as unknown as Prisma.InputJsonValue)
        : null,
      weatherDeltaTemp,
      snapshotId: snapshot.id,
    });
  }

  if (accuracyRecords.length > 0) {
    await prisma.predictionAccuracy.createMany({
      data: accuracyRecords.map((r) => ({
        date: r.date,
        recipeId: r.recipeId,
        locationId: r.locationId,
        businessId: r.businessId,
        predictedQuantity: r.predictedQuantity,
        actualQuantity: r.actualQuantity,
        deviation: r.deviation,
        deviationPercent: r.deviationPercent,
        accuracyPercent: r.accuracyPercent,
        errorTags: r.errorTags,
        weatherPredicted: r.weatherPredicted ?? Prisma.JsonNull,
        weatherActual: r.weatherActual ?? Prisma.JsonNull,
        weatherDeltaTemp: r.weatherDeltaTemp,
        snapshotId: r.snapshotId,
      })),
      skipDuplicates: true,
    });
  }
}

// ---------------------------------------------------------------------------
// 4. identifyErrorTags
// ---------------------------------------------------------------------------

export async function identifyErrorTags(
  context: ErrorTagContext,
): Promise<string[]> {
  const {
    deviation,
    deviationPercent,
    weatherPredicted,
    weatherActual,
    weatherDeltaTemp,
    locationId,
    recipeId,
    businessId,
    date,
  } = context;

  const tags: string[] = [];

  // WEATHER_SHIFT: temp delta > 5C OR condition category changed
  if (weatherDeltaTemp != null && Math.abs(weatherDeltaTemp) > 5) {
    tags.push('WEATHER_SHIFT');
  } else if (weatherPredicted && weatherActual) {
    const predictedCondition =
      typeof weatherPredicted.condition === 'string'
        ? weatherPredicted.condition
        : '';
    const actualCondition = weatherActual.condition;

    const predictedIsBad = BAD_WEATHER_CONDITIONS.includes(predictedCondition);
    const actualIsBad = BAD_WEATHER_CONDITIONS.includes(actualCondition);

    if (predictedIsBad !== actualIsBad) {
      tags.push('WEATHER_SHIFT');
    }
  }

  // NEW_LOCATION: fewer than 3 historical sales at this location for this recipe
  if (locationId) {
    const historicalSalesCount = await prisma.dailySales.count({
      where: {
        recipeId,
        locationId,
        date: { lt: date },
      },
    });

    if (historicalSalesCount < 3) {
      tags.push('NEW_LOCATION');
    }
  }

  // NO_SALES_DAY: actual was 0 and NO sales at all were recorded for the business that day
  const normalizedDate = normalizeDate(date);
  const nextDay = new Date(normalizedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const totalDailySales = await prisma.dailySales.count({
    where: {
      recipe: { businessId },
      date: {
        gte: normalizedDate,
        lt: nextDay,
      },
    },
  });

  const totalOrderItems = await prisma.orderItem.count({
    where: {
      order: {
        businessId,
        date: {
          gte: normalizedDate,
          lt: nextDay,
        },
      },
    },
  });

  const noSalesRecorded = totalDailySales === 0 && totalOrderItems === 0;

  if (noSalesRecorded) {
    tags.push('NO_SALES_DAY');
  }

  // UNUSUAL_VOLUME: |deviationPercent| > 50
  if (Math.abs(deviationPercent) > 50) {
    tags.push('UNUSUAL_VOLUME');
  }

  // CONSISTENT_OVER_PREDICT / CONSISTENT_UNDER_PREDICT
  // Fetch last 3 PredictionAccuracy records for this recipe + business (before this date)
  const recentAccuracyRecords = await prisma.predictionAccuracy.findMany({
    where: {
      recipeId,
      businessId,
      date: { lt: normalizedDate },
    },
    orderBy: { date: 'desc' },
    take: 3,
    select: { deviation: true },
  });

  if (recentAccuracyRecords.length === 3) {
    const allOverPredict = recentAccuracyRecords.every((r) => r.deviation < 0);
    const allUnderPredict = recentAccuracyRecords.every((r) => r.deviation > 0);

    if (allOverPredict) {
      tags.push('CONSISTENT_OVER_PREDICT');
    }
    if (allUnderPredict) {
      tags.push('CONSISTENT_UNDER_PREDICT');
    }
  }

  return tags;
}

// ---------------------------------------------------------------------------
// 5. getPredictionMetrics
// ---------------------------------------------------------------------------

export async function getPredictionMetrics(
  businessId: string,
  days: number = 30,
  openingHours?: WeekSchedule | null,
): Promise<PredictionMetrics> {
  const since = normalizeDate(new Date());
  since.setDate(since.getDate() - days);

  const allRecords = await prisma.predictionAccuracy.findMany({
    where: {
      businessId,
      date: { gte: since },
    },
    include: {
      recipe: { select: { name: true } },
    },
    orderBy: { date: 'asc' },
  });

  // Filter out records that fall on days now marked as closed
  const closedDays = getClosedDayIndices(openingHours ?? null);
  const records = closedDays.size > 0
    ? allRecords.filter((r) => !closedDays.has(new Date(r.date).getDay()))
    : allRecords;

  // Overall accuracy
  const overallAccuracy =
    records.length > 0
      ? Math.round(
          (records.reduce((sum, r) => sum + r.accuracyPercent, 0) /
            records.length) *
            100,
        ) / 100
      : 0;

  // Predictability score
  const predictabilityScore = calculatePredictabilityScore(records);

  // Total days tracked (unique dates)
  const uniqueDates = new Set(
    records.map((r) => normalizeDate(r.date).toISOString()),
  );
  const totalDaysTracked = uniqueDates.size;

  // Recipe metrics: group by recipeId
  const recipeGroups: Record<
    string,
    {
      recipeName: string;
      records: typeof records;
    }
  > = {};

  for (const record of records) {
    if (!recipeGroups[record.recipeId]) {
      recipeGroups[record.recipeId] = {
        recipeName: record.recipe.name,
        records: [],
      };
    }
    recipeGroups[record.recipeId].records.push(record);
  }

  const recipeMetrics = Object.entries(recipeGroups).map(
    ([recipeId, group]) => {
      const { recipeName, records: recipeRecords } = group;

      const avgAccuracy =
        Math.round(
          (recipeRecords.reduce((sum, r) => sum + r.accuracyPercent, 0) /
            recipeRecords.length) *
            100,
        ) / 100;

      const avgDeviation =
        Math.round(
          (recipeRecords.reduce((sum, r) => sum + r.deviation, 0) /
            recipeRecords.length) *
            100,
        ) / 100;

      // Trend: compare last 7 days vs previous 7 days
      const now = normalizeDate(new Date());
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date(now);
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const recentRecords = recipeRecords.filter(
        (r) => normalizeDate(r.date) >= sevenDaysAgo,
      );
      const previousRecords = recipeRecords.filter(
        (r) =>
          normalizeDate(r.date) >= fourteenDaysAgo &&
          normalizeDate(r.date) < sevenDaysAgo,
      );

      let trend: 'IMPROVING' | 'DECLINING' | 'STABLE' = 'STABLE';
      if (recentRecords.length > 0 && previousRecords.length > 0) {
        const recentAvg =
          recentRecords.reduce((sum, r) => sum + r.accuracyPercent, 0) /
          recentRecords.length;
        const previousAvg =
          previousRecords.reduce((sum, r) => sum + r.accuracyPercent, 0) /
          previousRecords.length;

        if (recentAvg > previousAvg + 5) {
          trend = 'IMPROVING';
        } else if (recentAvg < previousAvg - 5) {
          trend = 'DECLINING';
        }
      }

      // Most common error tags
      const errorTagCounts: Record<string, number> = {};
      for (const r of recipeRecords) {
        const tags = r.errorTags as string[];
        for (const tag of tags) {
          errorTagCounts[tag] = (errorTagCounts[tag] || 0) + 1;
        }
      }

      const commonErrors = Object.entries(errorTagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);

      return {
        recipeId,
        recipeName,
        avgAccuracy,
        trend,
        totalPredictions: recipeRecords.length,
        avgDeviation,
        commonErrors,
      };
    },
  );

  // Daily breakdown: last 7 days
  const sevenDaysAgo = normalizeDate(new Date());
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentRecords = records.filter(
    (r) => normalizeDate(r.date) >= sevenDaysAgo,
  );

  const dailyGroups: Record<
    string,
    { accuracies: number[]; totalPredicted: number; totalActual: number }
  > = {};

  for (const r of recentRecords) {
    const dateStr = normalizeDate(r.date).toISOString().split('T')[0];
    if (!dailyGroups[dateStr]) {
      dailyGroups[dateStr] = {
        accuracies: [],
        totalPredicted: 0,
        totalActual: 0,
      };
    }
    dailyGroups[dateStr].accuracies.push(r.accuracyPercent);
    dailyGroups[dateStr].totalPredicted += r.predictedQuantity;
    dailyGroups[dateStr].totalActual += r.actualQuantity;
  }

  const dailyBreakdown = Object.entries(dailyGroups)
    .map(([date, group]) => ({
      date,
      avgAccuracy:
        Math.round(
          (group.accuracies.reduce((sum, a) => sum + a, 0) /
            group.accuracies.length) *
            100,
        ) / 100,
      totalPredicted: group.totalPredicted,
      totalActual: group.totalActual,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    overallAccuracy,
    predictabilityScore,
    totalDaysTracked,
    recipeMetrics,
    dailyBreakdown,
  };
}

// ---------------------------------------------------------------------------
// 6. calculatePredictabilityScore
// ---------------------------------------------------------------------------

export function calculatePredictabilityScore(
  records: { accuracyPercent: number }[],
): number {
  if (records.length < 3) {
    return 0;
  }

  const mean =
    records.reduce((sum, r) => sum + r.accuracyPercent, 0) / records.length;

  const variance =
    records.reduce(
      (sum, r) => sum + Math.pow(r.accuracyPercent - mean, 2),
      0,
    ) / records.length;

  const stdDev = Math.sqrt(variance);

  const consistencyMultiplier = Math.max(0.5, 1 - stdDev / 50);

  return Math.round(Math.min(100, mean * consistencyMultiplier));
}
