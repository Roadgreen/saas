'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PackageX, Trash2, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { ExpirationSummary } from '@/lib/analytics';

interface ExpirationAnalysisCardProps {
    data: ExpirationSummary;
    currency?: CurrencyCode;
    days: number;
}

export function ExpirationAnalysisCard({
    data,
    currency = 'EUR',
    days,
}: ExpirationAnalysisCardProps) {
    const t = useTranslations('Analytics');
    const locale = useLocale();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Summary mini-cards */}
            <div className="grid gap-2 md:gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="bg-rose-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm sm:text-base font-medium">
                            {t('expirationTotalExpired')}
                        </CardTitle>
                        <div className="rounded-md bg-rose-100 p-2">
                            <PackageX className="h-5 w-5 sm:h-4 sm:w-4 text-rose-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-rose-600">
                            {data.totalExpiredProducts}
                        </div>
                        <p className="text-sm sm:text-xs text-muted-foreground mt-1">
                            {t('expirationTotalExpiredDesc')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm sm:text-base font-medium">
                            {t('expirationTotalQtyLost')}
                        </CardTitle>
                        <div className="rounded-md bg-orange-100 p-2">
                            <Trash2 className="h-5 w-5 sm:h-4 sm:w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">
                            {data.totalQtyLost}
                        </div>
                        <p className="text-sm sm:text-xs text-muted-foreground mt-1">
                            {t('expirationTotalQtyLostDesc')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-red-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm sm:text-base font-medium">
                            {t('expirationTotalCostLost')}
                        </CardTitle>
                        <div className="rounded-md bg-red-100 p-2">
                            <DollarSign className="h-5 w-5 sm:h-4 sm:w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">
                            {formatCurrency(data.totalCostLost, currency)}
                        </div>
                        <p className="text-sm sm:text-xs text-muted-foreground mt-1">
                            {t('expirationTotalCostLostDesc')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detail */}
            {data.rows.length === 0 ? (
                <p className="text-base sm:text-sm text-muted-foreground italic py-8 text-center">
                    {t('expirationNoData')}
                </p>
            ) : (
                <>
                    {/* Mobile: card layout */}
                    <div className="sm:hidden space-y-2 max-h-[500px] overflow-auto">
                        {data.rows.map((row) => (
                            <div
                                key={row.productId}
                                className={cn(
                                    'rounded-lg border p-3 space-y-2',
                                    row.remainingQty > 0 && 'border-red-300 bg-red-50/30'
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {row.remainingQty > 0 && (
                                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                    )}
                                    <div>
                                        <span className="font-semibold text-base">{row.name}</span>
                                        {row.category && (
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                ({row.category})
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('expirationLocation')}</p>
                                        <p className="text-base">{row.locationName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('expirationExpiredOn')}</p>
                                        <p className="text-base text-red-600">{formatDate(row.expiryDate)}</p>
                                    </div>
                                    {row.remainingQty > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('expirationRemainingQty')}</p>
                                            <p className="text-base font-medium text-red-600">
                                                {row.remainingQty} {row.unit}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('expirationTotalQty')}</p>
                                        <p className="text-base font-medium">
                                            {row.totalQtyLost} {row.unit}
                                        </p>
                                    </div>
                                    {row.totalCostLost > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground">{t('expirationTotalLoss')}</p>
                                            <p className="text-lg font-bold text-red-700">
                                                {formatCurrency(row.totalCostLost, currency)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: table layout */}
                    <div className="hidden sm:block max-h-[400px] overflow-auto rounded-md border">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                    <TableHead>{t('expirationProduct')}</TableHead>
                                    <TableHead>{t('expirationLocation')}</TableHead>
                                    <TableHead className="text-right">{t('expirationExpiredOn')}</TableHead>
                                    <TableHead className="text-right">{t('expirationRemainingQty')}</TableHead>
                                    <TableHead className="text-right">{t('expirationHistoricalQty')}</TableHead>
                                    <TableHead className="text-right">{t('expirationTotalQty')}</TableHead>
                                    <TableHead className="text-right">{t('expirationTotalLoss')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.rows.map((row) => (
                                    <TableRow
                                        key={row.productId}
                                        className={cn(row.remainingQty > 0 && 'bg-red-50/40')}
                                    >
                                        <TableCell className="font-medium text-sm">
                                            <div className="flex items-center gap-1.5">
                                                {row.remainingQty > 0 && (
                                                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                                )}
                                                <div>
                                                    {row.name}
                                                    {row.category && (
                                                        <span className="ml-1 text-xs text-muted-foreground">
                                                            ({row.category})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {row.locationName}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-red-600">
                                            {formatDate(row.expiryDate)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            {row.remainingQty > 0 ? (
                                                <span className="text-red-600 font-medium">
                                                    {row.remainingQty} {row.unit}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">
                                            {row.historicalQtyLost > 0
                                                ? `${row.historicalQtyLost} ${row.unit}`
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-medium">
                                            {row.totalQtyLost} {row.unit}
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-bold text-red-700">
                                            {row.totalCostLost > 0
                                                ? formatCurrency(row.totalCostLost, currency)
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    );
}
