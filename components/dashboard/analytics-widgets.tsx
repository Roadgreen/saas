'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign, Scale, Package, Clock, Trash2 } from "lucide-react";
import { MarginSparkline } from "./MarginSparkline";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { motion } from "framer-motion";

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

export function WasteMetricsCard({ waste, currency = 'EUR' }: { waste: AnalyticsData['waste']; currency?: CurrencyCode }) {
  const t = useTranslations('Dashboard');
  return (
    <Card className="dash-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('wasteMetrics')}</CardTitle>
        <TrendingDown className="h-4 w-4 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(waste.week, currency)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(waste.day, currency)} {t('today')}
        </p>
      </CardContent>
    </Card>
  );
}

export function SalesVsStockCard({ data, currency = 'EUR' }: { data: AnalyticsData['salesVsStock']; currency?: CurrencyCode }) {
  const t = useTranslations('Dashboard');
  const margin = data.revenue - data.stockCost;
  const marginPercent = data.revenue > 0 ? (margin / data.revenue) * 100 : 0;

  return (
    <Card className="dash-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('theoreticalMargin')}</CardTitle>
        <DollarSign className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(margin, currency)}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{t('sales')}: {formatCurrency(data.revenue, currency)}</span>
          <span>{t('cost')}: {formatCurrency(data.stockCost, currency)}</span>
        </div>
        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            style={{ width: `${Math.min(marginPercent, 100)}%` }}
          />
        </div>
        <MarginSparkline currency={currency} />
      </CardContent>
    </Card>
  );
}

export function TopWasteCard({ items, currency = 'EUR' }: { items: AnalyticsData['topWaste']; currency?: CurrencyCode }) {
  const t = useTranslations('Dashboard');
  return (
    <Card className="dash-card">
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
                  -{formatCurrency(item.wasteCost, currency)}
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
        <Alert key={i} variant="destructive" className="border-red-200 bg-red-100">
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

const cardStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function SimpleStatsCards({ stats, currency = 'EUR' }: { stats: { currentStock: number; expiringSoon: number; todaySales: number; todayLosses: number }; currency?: CurrencyCode }) {
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4"
      variants={cardStagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={cardItem}>
        <Card className="dash-card h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t('currentStock')}</CardTitle>
            <div className="rounded-xl bg-blue-100 p-1.5 md:p-2">
              <Package className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-blue-600">{stats.currentStock}</div>
            <p className="text-xs text-muted-foreground font-light">{t('items')}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardItem}>
        <Card className="dash-card h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t('expiringSoon')}</CardTitle>
            <div className="rounded-xl bg-amber-100 p-1.5 md:p-2">
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-amber-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground font-light">{t('items')}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardItem}>
        <Card className="dash-card h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t('todaySales')}</CardTitle>
            <div className="rounded-xl bg-green-100 p-1.5 md:p-2">
              <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-green-600">{formatCurrency(stats.todaySales, currency)}</div>
            <p className="text-xs text-muted-foreground font-light">{t('today')}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardItem}>
        <Card className="dash-card h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t('todayLosses')}</CardTitle>
            <div className="rounded-xl bg-red-100 p-1.5 md:p-2">
              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-red-600">{formatCurrency(stats.todayLosses, currency)}</div>
            <p className="text-xs text-muted-foreground font-light">{t('today')}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
