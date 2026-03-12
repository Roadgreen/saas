'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { DailyProfitability } from '@/lib/analytics';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';

interface DailyBreakdownTableProps {
    data: DailyProfitability[];
    currency?: CurrencyCode;
}

export function DailyBreakdownTable({ data, currency = 'EUR' }: DailyBreakdownTableProps) {
    const t = useTranslations('Analytics');
    const locale = useLocale();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Show most recent first
    const reversed = [...data].reverse();

    return (
        <>
            {/* Mobile: card layout */}
            <div className="sm:hidden space-y-3 max-h-[500px] overflow-auto">
                {reversed.map((day) => {
                    const hasData = day.revenue > 0 || day.cost > 0;
                    return (
                        <div
                            key={day.date}
                            className={cn(
                                'rounded-xl border p-4 space-y-3',
                                !hasData && 'opacity-40'
                            )}
                        >
                            <div className="font-semibold text-base">
                                {formatDate(day.date)}
                            </div>
                            {hasData ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('detailRevenue')}</p>
                                        <p className="text-base font-medium text-blue-600">
                                            {formatCurrency(day.revenue, currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('detailCost')}</p>
                                        <p className="text-base font-medium text-red-600">
                                            {formatCurrency(day.cost, currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('detailMargin')}</p>
                                        <p className={cn(
                                            'text-base font-bold',
                                            day.margin > 0 ? 'text-green-600' : day.margin < 0 ? 'text-red-600' : ''
                                        )}>
                                            {formatCurrency(day.margin, currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('detailMarginPct')}</p>
                                        <p className={cn(
                                            'text-base font-medium',
                                            day.marginPercent >= 60 ? 'text-green-600' :
                                            day.marginPercent >= 30 ? 'text-amber-600' :
                                            day.marginPercent > 0 ? 'text-red-600' : ''
                                        )}>
                                            {day.marginPercent.toFixed(1)}%
                                        </p>
                                    </div>
                                    {day.wastesCost > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground">{t('detailWaste')}</p>
                                            <p className="text-base font-medium text-orange-600">
                                                {formatCurrency(day.wastesCost, currency)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">-</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden sm:block max-h-[400px] overflow-auto rounded-md border">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            <TableHead>{t('detailDate')}</TableHead>
                            <TableHead className="text-right">{t('detailRevenue')}</TableHead>
                            <TableHead className="text-right">{t('detailCost')}</TableHead>
                            <TableHead className="text-right">{t('detailMargin')}</TableHead>
                            <TableHead className="text-right">{t('detailMarginPct')}</TableHead>
                            <TableHead className="text-right">{t('detailWaste')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reversed.map((day) => {
                            const hasData = day.revenue > 0 || day.cost > 0;
                            return (
                                <TableRow key={day.date} className={cn(!hasData && 'opacity-40')}>
                                    <TableCell className="font-medium text-sm">
                                        {formatDate(day.date)}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {hasData ? formatCurrency(day.revenue, currency) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {hasData ? formatCurrency(day.cost, currency) : '-'}
                                    </TableCell>
                                    <TableCell className={cn(
                                        'text-right text-sm font-medium',
                                        day.margin > 0 ? 'text-green-600' : day.margin < 0 ? 'text-red-600' : ''
                                    )}>
                                        {hasData ? formatCurrency(day.margin, currency) : '-'}
                                    </TableCell>
                                    <TableCell className={cn(
                                        'text-right text-sm',
                                        day.marginPercent >= 60 ? 'text-green-600' :
                                        day.marginPercent >= 30 ? 'text-amber-600' :
                                        day.marginPercent > 0 ? 'text-red-600' : ''
                                    )}>
                                        {hasData ? `${day.marginPercent.toFixed(1)}%` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {day.wastesCost > 0 ? (
                                            <span className="text-orange-600">{formatCurrency(day.wastesCost, currency)}</span>
                                        ) : '-'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
