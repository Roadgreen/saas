'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CreditCard,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Link2,
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';

interface SumUpDailyRevenue {
  date: string;
  revenue: number;
  transactionCount: number;
  currency: string;
}

interface InternalDay {
  date: string;
  revenue: number;
}

interface SumUpDailyWidgetProps {
  isSumUpConnected: boolean;
  internalData: InternalDay[];
  currency: CurrencyCode;
  days: number;
}

interface ChartDay {
  date: string;
  label: string;
  sumup: number;
  internal: number;
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-xs min-w-[140px]">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-4 mb-1">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{formatCurrency(p.value, currency)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
          <span className="text-muted-foreground">Écart</span>
          <span className={`font-medium ${payload[0].value - payload[1].value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(payload[0].value - payload[1].value), currency)}
          </span>
        </div>
      )}
    </div>
  );
};

export function SumUpDailyWidget({
  isSumUpConnected,
  internalData,
  currency,
  days,
}: SumUpDailyWidgetProps) {
  const t = useTranslations('SumUp');
  const locale = useLocale();
  const [sumupData, setSumupData] = useState<SumUpDailyRevenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const fetchSumUpData = useCallback(async () => {
    if (!isSumUpConnected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sumup/transactions?days=${days}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSumupData(data.daily ?? []);
      setLastSync(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isSumUpConnected, days]);

  useEffect(() => {
    fetchSumUpData();
  }, [fetchSumUpData]);

  if (!isSumUpConnected) {
    return (
      <Card className="dash-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B6FF]/10">
              <CreditCard className="h-4 w-4 text-[#00B6FF]" />
            </div>
            {t('widgetTitle')}
          </CardTitle>
          <CardDescription>{t('widgetDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="rounded-full bg-blue-50 p-4">
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t('connectPrompt')}</p>
            <Button asChild size="sm" variant="outline">
              <Link href={`/${locale}/dashboard/settings?tab=integrations`}>
                <Link2 className="mr-2 h-4 w-4" />
                {t('connectBtn')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Merge sumup + internal data into chart-ready format
  const chartData: ChartDay[] = (() => {
    const internalMap = new Map(internalData.map((d) => [d.date, d.revenue]));
    const sumupMap = new Map(sumupData.map((d) => [d.date, d.revenue]));

    const allDates = new Set([...internalMap.keys(), ...sumupMap.keys()]);
    return Array.from(allDates)
      .sort()
      .slice(-days)
      .map((date) => {
        const d = new Date(date);
        return {
          date,
          label: d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
          sumup: sumupMap.get(date) ?? 0,
          internal: internalMap.get(date) ?? 0,
        };
      });
  })();

  const totalSumUp = sumupData.reduce((s, d) => s + d.revenue, 0);
  const totalInternal = internalData.reduce((s, d) => s + d.revenue, 0);
  const totalTransactions = sumupData.reduce((s, d) => s + d.transactionCount, 0);
  const gap = totalSumUp - totalInternal;
  const gapPct = totalSumUp > 0 ? (gap / totalSumUp) * 100 : 0;

  return (
    <Card className="dash-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B6FF]/10">
              <CreditCard className="h-4 w-4 text-[#00B6FF]" />
            </div>
            <div>
              <CardTitle className="text-base">{t('widgetTitle')}</CardTitle>
              <CardDescription className="text-xs">
                {lastSync
                  ? t('lastSync', { time: lastSync.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) })
                  : t('widgetDesc')}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchSumUpData}
            disabled={loading}
            className="h-8 w-8"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[#00B6FF]/5 border border-[#00B6FF]/15 p-3 text-center">
            <p className="text-xs text-muted-foreground">{t('kpiSumUp')}</p>
            <p className="text-lg font-bold text-[#00B6FF] mt-0.5">
              {formatCurrency(totalSumUp, currency)}
            </p>
            <p className="text-xs text-muted-foreground">{totalTransactions} {t('transactions')}</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-center">
            <p className="text-xs text-muted-foreground">{t('kpiInternal')}</p>
            <p className="text-lg font-bold text-blue-600 mt-0.5">
              {formatCurrency(totalInternal, currency)}
            </p>
            <p className="text-xs text-muted-foreground">{t('recorded')}</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${
            gap >= 0
              ? 'bg-green-50 border-green-100'
              : 'bg-red-50 border-red-100'
          }`}>
            <p className="text-xs text-muted-foreground">{t('kpiGap')}</p>
            <p className={`text-lg font-bold mt-0.5 flex items-center justify-center gap-1 ${gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {gap >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatCurrency(Math.abs(gap), currency)}
            </p>
            <p className="text-xs text-muted-foreground">{Math.abs(gapPct).toFixed(1)}%</p>
          </div>
        </div>

        {/* Gap explanation */}
        {Math.abs(gap) > 0.01 && (
          <div className={`flex items-start gap-2 p-3 rounded-lg text-xs border ${
            gap > 0
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {gap > 0 ? (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span>
              {gap > 0
                ? t('gapWarning', { amount: formatCurrency(gap, currency) })
                : t('gapOk', { amount: formatCurrency(Math.abs(gap), currency) })}
            </span>
          </div>
        )}

        {/* Comparison chart */}
        {chartData.length > 0 ? (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">{t('chartLabel', { days })}</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}€`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Legend
                  iconType="square"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="sumup" name="SumUp" fill="#00B6FF" radius={[3, 3, 0, 0]} />
                <Bar dataKey="internal" name={t('internalSales')} fill="#3b82f6" radius={[3, 3, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          !loading && (
            <p className="text-sm text-muted-foreground text-center py-8 italic">
              {t('noTransactions')}
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}
