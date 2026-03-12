'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import type { DailyProfitability } from '@/lib/analytics';
import { formatCurrency, formatCurrencyShort, type CurrencyCode } from '@/lib/currency';

interface ProfitabilityChartProps {
    data: DailyProfitability[];
    currency?: CurrencyCode;
}

export function ProfitabilityChart({ data, currency = 'EUR' }: ProfitabilityChartProps) {
    const t = useTranslations('Analytics');
    const locale = useLocale();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const tickSize = isMobile ? 13 : 11;

    return (
        <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: isMobile ? 5 : 20, bottom: 0 }}>
                <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="marginGradFull" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: tickSize }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tick={{ fontSize: tickSize }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => formatCurrencyShort(v, currency)}
                    width={isMobile ? 45 : 55}
                />
                <Tooltip
                    formatter={(val, name) => [formatCurrency(Number(val), currency), name]}
                    labelFormatter={(label) => formatDate(String(label))}
                />
                <Legend wrapperStyle={{ fontSize: isMobile ? 13 : 12 }} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    name={t('revenue')}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={false}
                />
                <Area
                    type="monotone"
                    dataKey="cost"
                    name={t('cost')}
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#costGrad)"
                    dot={false}
                />
                <Area
                    type="monotone"
                    dataKey="margin"
                    name={t('margin')}
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#marginGradFull)"
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
