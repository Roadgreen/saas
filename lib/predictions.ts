import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getClosedDayIndices, type WeekSchedule } from './schedule';

export interface PredictionItem {
    recipeId: string;
    recipeName: string;
    predictedQuantity: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

async function applyBiasCorrection(recipeId: string, businessId: string, baseline: number): Promise<number> {
    const recentAccuracy = await prisma.predictionAccuracy.findMany({
        where: { recipeId, businessId },
        orderBy: { date: 'desc' },
        take: 4,
    });
    if (recentAccuracy.length < 2) return baseline;

    const avgDeviationPercent = recentAccuracy.reduce(
        (sum: number, r: any) => sum + r.deviationPercent, 0
    ) / recentAccuracy.length;

    // Dampening factor of 0.5 to avoid oscillation
    const correctionFactor = 1 + (avgDeviationPercent / 100) * 0.5;
    return Math.max(1, Math.round(baseline * correctionFactor));
}

async function applyWeatherAdjustment(
    recipeId: string, businessId: string, baseline: number,
    weather: { temp: number; condition: string } | undefined
): Promise<number> {
    if (!weather) return baseline;

    // Fetch historical sales with weather data
    const historicalSales = await prisma.dailySales.findMany({
        where: {
            recipeId,
            recipe: { businessId },
            weatherSnapshot: { not: Prisma.JsonNull },
        },
        orderBy: { date: 'desc' },
        take: 50,
    });

    if (historicalSales.length < 10) return baseline;

    const badConditions = ['Rain', 'Snow', 'Thunderstorm', 'Drizzle'];
    const goodWeatherSales: number[] = [];
    const badWeatherSales: number[] = [];

    historicalSales.forEach((sale: any) => {
        const w = sale.weatherSnapshot as any;
        if (!w?.condition) return;
        if (badConditions.includes(w.condition)) {
            badWeatherSales.push(sale.quantity);
        } else {
            goodWeatherSales.push(sale.quantity);
        }
    });

    if (goodWeatherSales.length < 3 || badWeatherSales.length < 3) return baseline;

    const avgGood = goodWeatherSales.reduce((a, b) => a + b, 0) / goodWeatherSales.length;
    const avgBad = badWeatherSales.reduce((a, b) => a + b, 0) / badWeatherSales.length;
    const weatherRatio = avgGood > 0 ? avgBad / avgGood : 1;

    const isBadWeather = badConditions.includes(weather.condition);
    if (isBadWeather && weatherRatio < 0.95) {
        return Math.max(1, Math.round(baseline * weatherRatio));
    }

    if (weather.temp < 5 || weather.temp > 35) {
        return Math.max(1, Math.round(baseline * 0.85));
    }

    return baseline;
}

export async function getSalesForecast(
    businessId: string,
    date: Date = new Date(),
    options?: {
        locationId?: string;
        weather?: { temp: number; condition: string };
        openingHours?: WeekSchedule | null;
    }
): Promise<PredictionItem[]> {
    // 1. Determine day of week (0-6)
    const dayOfWeek = date.getDay();

    // 2. Fetch last 8 weeks of sales for this day
    const weeksToAnalyze = 8;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - (weeksToAnalyze * 7));

    const salesHistory = await (prisma as any).dailySales.findMany({
        where: {
            recipe: { businessId },
            date: {
                gte: startDate,
                lt: date,
            },
            ...(options?.locationId ? { locationId: options.locationId } : {}),
        },
        include: { recipe: true },
    });

    // Filter for the same day of week, excluding sales from days now marked as closed
    const closedDays = getClosedDayIndices(options?.openingHours ?? null);
    const sameDaySales = salesHistory.filter((sale: any) => {
        const saleDate = new Date(sale.date);
        if (closedDays.has(saleDate.getDay())) return false;
        return saleDate.getDay() === dayOfWeek;
    });

    const predictions: PredictionItem[] = [];

    // 3. Group sales by recipe and date for weighted average calculation
    const recipeSalesByDate: Record<string, Record<string, number>> = {};

    sameDaySales.forEach((sale: any) => {
        const dateStr = new Date(sale.date).toISOString().split('T')[0];
        if (!recipeSalesByDate[sale.recipeId]) {
            recipeSalesByDate[sale.recipeId] = {};
        }
        if (!recipeSalesByDate[sale.recipeId][dateStr]) {
            recipeSalesByDate[sale.recipeId][dateStr] = 0;
        }
        recipeSalesByDate[sale.recipeId][dateStr] += sale.quantity;
    });

    Object.keys(recipeSalesByDate).forEach(recipeId => {
        const dateMap = recipeSalesByDate[recipeId];
        const dates = Object.keys(dateMap).sort();
        const quantities = dates.map(d => dateMap[d]);

        // Weighted Average: Recent weeks get more weight
        let totalWeight = 0;
        let weightedSum = 0;

        quantities.forEach((qty, index) => {
            const weight = index + 1;
            weightedSum += qty * weight;
            totalWeight += weight;
        });

        const predictedQty = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

        // Trend
        const avgLast2 = quantities.slice(-2).reduce((a, b) => a + b, 0) / 2;
        const avgFirst2 = quantities.slice(0, 2).reduce((a, b) => a + b, 0) / 2;

        let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
        if (quantities.length >= 4) {
            if (avgLast2 > avgFirst2 * 1.1) trend = 'UP';
            else if (avgLast2 < avgFirst2 * 0.9) trend = 'DOWN';
        }

        const recipeName = salesHistory.find((s: any) => s.recipeId === recipeId)?.recipe.name || 'Unknown';

        if (predictedQty > 0) {
            predictions.push({
                recipeId,
                recipeName,
                predictedQuantity: predictedQty,
                trend,
            });
        }
    });

    // 4. Apply self-improving corrections (bias + weather)
    const correctedPredictions: PredictionItem[] = [];
    for (const pred of predictions) {
        let adjusted = pred.predictedQuantity;
        adjusted = await applyBiasCorrection(pred.recipeId, businessId, adjusted);
        adjusted = await applyWeatherAdjustment(pred.recipeId, businessId, adjusted, options?.weather);
        correctedPredictions.push({ ...pred, predictedQuantity: adjusted });
    }

    // Fallback: if location-specific data is too sparse, use all-location data
    if (correctedPredictions.length < 3 && options?.locationId) {
        return getSalesForecast(businessId, date, { ...options, locationId: undefined });
    }

    return correctedPredictions.sort((a, b) => b.predictedQuantity - a.predictedQuantity);
}
