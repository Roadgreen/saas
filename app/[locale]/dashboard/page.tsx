import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient();

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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business) {
    const t = await getTranslations('Dashboard');
    return <div>{t('profileIncomplete')}</div>;
  }

  const analytics = await getAnalytics(user.business.id);
  const predictions = await getSalesForecast(user.business.id);

  const t = await getTranslations('Dashboard');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      <SimpleStatsCards stats={analytics.simpleStats} />

      <AlertsWidget alerts={analytics.alerts} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <WasteMetricsCard waste={analytics.waste} />
        <SalesVsStockCard data={analytics.salesVsStock} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <UploadAndAnalyze />
          <SmartAlertsWidget 
            analysis={analytics.smartAnalysis} 
            isPremium={(user as any).business?.subscriptionTier === 'PRO' || (user as any).business?.subscriptionTier === 'ENTERPRISE'} 
          />
        </div>
        <div className="col-span-3 space-y-4">
          <PredictionsWidget predictions={predictions} />
          <TopWasteCard items={analytics.topWaste} />
        </div>
      </div>

      {/* Carte des emplacements foodtruck */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LocationsMapWrapper />
      </div>
    </div>
  );
}
