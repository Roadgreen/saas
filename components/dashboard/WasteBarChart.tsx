'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import type { DailyProfitability } from '@/lib/analytics';
import { formatCurrency, formatCurrencyShort, type CurrencyCode } from '@/lib/currency';

interface WasteBarChartProps {
    data: DailyProfitability[];
    currency?: CurrencyCode;
}

export function WasteBarChart({ data, currency = 'EUR' }: WasteBarChartProps) {
    const t = useTranslations('Analytics');
    const locale = useLocale();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    };

    const filtered = data.filter(d => d.wastesCost > 0);
    if (filtered.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <defs>
                    <linearGradient id="wasteBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.4} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => formatCurrencyShort(v, currency)}
                    width={55}
                />
                <Tooltip
                    formatter={(val) => [formatCurrency(Number(val), currency), t('detailWaste')]}
                    labelFormatter={(label) => formatDate(String(label))}
                />
                <Bar
                    dataKey="wastesCost"
                    name={t('detailWaste')}
                    fill="url(#wasteBarGrad)"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
