import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { UploadAndAnalyze } from "@/components/UploadAndAnalyze";
import { getAnalytics } from "@/lib/analytics";
import {
  WasteMetricsCard,
  SalesVsStockCard,
  TopWasteCard,
  AlertsWidget,
  SimpleStatsCards
} from "@/components/dashboard/analytics-widgets";
import { SmartAlertsWidget } from "@/components/dashboard/SmartAlertsWidget";
import { PredictionsWidget } from "@/components/dashboard/PredictionsWidget";
import { getSalesForecast } from "@/lib/predictions";
import LocationsMapWrapper from "@/components/dashboard/LocationsMapWrapper";
import { snapshotAndReconcile, getPredictionMetrics } from "@/lib/prediction-accuracy";
import { PredictionAccuracyPanel } from "@/components/dashboard/PredictionAccuracyPanel";
import { getLocationAnalytics } from '@/lib/location-analytics';
import { LocationPerformanceCard } from '@/components/dashboard/LocationPerformanceCard';
import { isCurrencyCode, type CurrencyCode } from '@/lib/currency';
import { getNextOpenDay, type WeekSchedule } from '@/lib/schedule';
import { getRecipeReadiness } from '@/lib/stock-demand';
import { StockReadinessCard } from '@/components/dashboard/StockReadinessCard';
import { DashboardEmptyStates } from '@/components/dashboard/DashboardEmptyStates';

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null;
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { business: true },
    });
  } catch {
    const t = await getTranslations('Dashboard');
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <p className="text-lg font-semibold">{t('dbUnavailable')}</p>
        <p className="text-sm text-muted-foreground">{t('dbUnavailableDesc')}</p>
      </div>
    );
  }

  if (!user?.business) {
    const t = await getTranslations('Dashboard');
    return <div>{t('profileIncomplete')}</div>;
  }

  const business = user.business;
  const isPremium = business.subscriptionTier === 'PRO' || business.subscriptionTier === 'ENTERPRISE';

  const settings = (business.settings as Record<string, unknown>) ?? {};
  const rawCurrency = settings.currency;
  const currency: CurrencyCode = isCurrencyCode(rawCurrency) ? rawCurrency : 'EUR';

  const openingHours = business.openingHours as WeekSchedule | null;
  const { date: nextOpenDate, dayName: nextOpenDayName, locationId: scheduleLocationId } = getNextOpenDay(openingHours);

  // Resolve location name for display
  let forecastLocationName: string | null = null;
  if (scheduleLocationId) {
    try {
      const loc = await prisma.location.findUnique({
        where: { id: scheduleLocationId },
        select: { name: true },
      });
      forecastLocationName = loc?.name ?? null;
    } catch { /* ignore */ }
  }

  // Count entities for empty state detection
  const [productCount, recipeCount, orderCount, locationCount] = await Promise.all([
    prisma.product.count({ where: { location: { businessId: business.id } } }).catch(() => 0),
    prisma.recipe.count({ where: { businessId: business.id } }).catch(() => 0),
    prisma.order.count({ where: { businessId: business.id } }).catch(() => 0),
    prisma.location.count({ where: { businessId: business.id } }).catch(() => 0),
  ]);

  const [analytics, predictions] = await Promise.all([
    getAnalytics(business.id).catch(() => null),
    getSalesForecast(business.id, nextOpenDate, {
      locationId: scheduleLocationId ?? undefined,
      openingHours,
    }).catch(() => []),
  ]);

  // Compute stock readiness for each predicted recipe
  const readiness = await getRecipeReadiness(business.id, predictions as any[]).catch(() => []);

  // Snapshot today's predictions & reconcile yesterday (lazy, non-blocking)
  snapshotAndReconcile(business.id, predictions as any[], openingHours).catch(() => {});

  // Fetch accuracy metrics if premium (excludes closed days)
  const accuracyMetrics = isPremium
    ? await getPredictionMetrics(business.id, 30, openingHours).catch(() => null)
    : null;

  const locationAnalytics = isPremium
    ? await getLocationAnalytics(business.id).catch(() => null)
    : null;

  // Build per-recipe accuracy map for the widget
  const recipeAccuracies: Record<string, number> = {};
  if (accuracyMetrics) {
    accuracyMetrics.recipeMetrics.forEach((rm) => {
      recipeAccuracies[rm.recipeId] = rm.avgAccuracy;
    });
  }

  const t = await getTranslations('Dashboard');
  const tDays = await getTranslations('Settings.Operations.days');
  const forecastDayLabel = tDays(nextOpenDayName as any);

  return (
    <div className="flex-1 space-y-3 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
          {t('welcome')}, {business.name}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 font-light">
          {t('subtitle')}
        </p>
      </div>

      <DashboardEmptyStates
        productCount={productCount}
        recipeCount={recipeCount}
        orderCount={orderCount}
        locationCount={locationCount}
      />

      {analytics && <SimpleStatsCards stats={analytics.simpleStats} currency={currency} />}

      {analytics && <AlertsWidget alerts={analytics.alerts} />}

      {analytics && (
        <div className="grid gap-3 md:gap-4 md:grid-cols-2">
          <WasteMetricsCard waste={analytics.waste} currency={currency} />
          <SalesVsStockCard data={analytics.salesVsStock} currency={currency} />
        </div>
      )}

      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-3 md:space-y-4">
          <UploadAndAnalyze />
          {analytics && (
            <SmartAlertsWidget
              analysis={analytics.smartAnalysis}
              isPremium={isPremium}
            />
          )}
        </div>
        <div className="lg:col-span-3 space-y-3 md:space-y-4">
          <PredictionsWidget
            predictions={predictions}
            isPremium={isPremium}
            forecastDayName={forecastDayLabel}
            forecastLocationName={forecastLocationName}
            accuracyMetrics={accuracyMetrics ? {
              overallAccuracy: accuracyMetrics.overallAccuracy,
              predictabilityScore: accuracyMetrics.predictabilityScore,
              recipeAccuracies,
            } : null}
          />
          <StockReadinessCard
            readiness={readiness}
            forecastDayName={forecastDayLabel}
          />
          <PredictionAccuracyPanel metrics={accuracyMetrics} isPremium={isPremium} />
          <TopWasteCard items={analytics?.topWaste ?? []} currency={currency} />
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        <LocationsMapWrapper />
        <LocationPerformanceCard analytics={locationAnalytics} isPremium={isPremium} currency={currency} />
      </div>
    </div>
  );
}
