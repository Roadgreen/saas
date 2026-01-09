import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign, Scale } from "lucide-react";

interface AnalyticsData {
  waste: {
    day: number;
    week: number;
    month: number;
  };
  salesVsStock: {
    revenue: number;
    stockCost: number;
  };
  topWaste: {
    name: string;
    wasteCost: number;
    rate: number;
  }[];
  alerts: string[];
}

import { useTranslations } from 'next-intl';

// ... interfaces ...

export function WasteMetricsCard({ waste }: { waste: AnalyticsData['waste'] }) {
  const t = useTranslations('Dashboard');
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('wasteMetrics')}</CardTitle>
        <TrendingDown className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600">
          {waste.week.toFixed(2)} €
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {waste.day.toFixed(2)} € {t('today')}
        </p>
      </CardContent>
    </Card>
  );
}

export function SalesVsStockCard({ data }: { data: AnalyticsData['salesVsStock'] }) {
  const t = useTranslations('Dashboard');
  const margin = data.revenue - data.stockCost;
  const marginPercent = data.revenue > 0 ? (margin / data.revenue) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('theoreticalMargin')}</CardTitle>
        <DollarSign className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">
          {margin.toFixed(2)} €
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{t('sales')}: {data.revenue.toFixed(2)} €</span>
          <span>{t('cost')}: {data.stockCost.toFixed(2)} €</span>
        </div>
        <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500" 
            style={{ width: `${Math.min(marginPercent, 100)}%` }} 
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function TopWasteCard({ items }: { items: AnalyticsData['topWaste'] }) {
  const t = useTranslations('Dashboard');
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t('topWaste')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noWaste')}</p>
          ) : (
            items.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('wasteRate')}: {item.rate.toFixed(1)}%
                  </p>
                </div>
                <div className="font-medium text-red-600">
                  -{item.wasteCost.toFixed(2)} €
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertsWidget({ alerts }: { alerts: any[] }) {
  const t = useTranslations('Dashboard');
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <Alert key={i} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('alertTitle')}</AlertTitle>
          <AlertDescription>
            {alert.type === 'HIGH_WASTE' 
              ? t('alertHighWaste', { name: alert.name, rate: alert.rate })
              : t('alertExpiring', { name: alert.name })}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

export function SimpleStatsCards({ stats }: { stats: { currentStock: number; expiringSoon: number; todaySales: number; todayLosses: number } }) {
  const t = useTranslations('Dashboard');
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('currentStock')}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">📦</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStock}</div>
          <p className="text-xs text-muted-foreground">{t('items')}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('expiringSoon')}</CardTitle>
          <div className="h-4 w-4 text-orange-500">⏰</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
          <p className="text-xs text-muted-foreground">{t('items')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('todaySales')}</CardTitle>
          <div className="h-4 w-4 text-green-500">💰</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.todaySales.toFixed(2)} €</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('todayLosses')}</CardTitle>
          <div className="h-4 w-4 text-red-500">🗑️</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.todayLosses.toFixed(2)} €</div>
        </CardContent>
      </Card>
    </div>
  );
}
