'use client';

import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
} from 'recharts';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';

interface SparklinePoint {
    date: string;
    margin: number;
}

interface MarginSparklineProps {
    currency?: CurrencyCode;
}

export function MarginSparkline({ currency = 'EUR' }: MarginSparklineProps) {
    const [data, setData] = useState<SparklinePoint[]>([]);

    useEffect(() => {
        fetch('/api/analytics/profitability?days=7')
            .then(r => r.ok ? r.json() : [])
            .then((d: SparklinePoint[]) => setData(d))
            .catch(() => {});
    }, []);

    if (data.length === 0 || data.every(d => d.margin === 0)) return null;

    return (
        <div className="mt-3 h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                        <linearGradient id="sparkMarginGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="margin"
                        stroke="#22c55e"
                        strokeWidth={1.5}
                        fill="url(#sparkMarginGrad)"
                        dot={false}
                        isAnimationActive={false}
                    />
                    <Tooltip
                        contentStyle={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            color: '#374151',
                        }}
                        formatter={(val) => [formatCurrency(Number(val), currency), 'Marge']}
                        labelFormatter={(label) => String(label)}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
