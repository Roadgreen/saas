'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, TrendingDown, Minus, Lock, Star } from 'lucide-react';
import Link from 'next/link';
import type { LocationAnalytics } from '@/lib/location-analytics';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';

interface LocationPerformanceCardProps {
    analytics: LocationAnalytics[] | null;
    isPremium: boolean;
    currency?: CurrencyCode;
}

export function LocationPerformanceCard({ analytics, isPremium, currency = 'EUR' }: LocationPerformanceCardProps) {
    const t = useTranslations('Location');
    const locale = useLocale();

    if (!isPremium) {
        return (
            <Card className="relative overflow-hidden dash-card">
                <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-[#0D0905]/80 p-6 text-center">
                    <div className="rounded-full bg-orange-500/10 p-3 mb-3">
                        <Lock className="h-6 w-6 text-orange-400" />
                    </div>
                    <h3 className="font-bold text-base text-white">{t('upgradeTitle')}</h3>
                    <p className="text-sm text-white/60 mb-4 max-w-xs">{t('upgradeDesc')}</p>
                    <Button asChild className="bg-orange-500 hover:bg-orange-400 text-white">
                        <Link href={`/${locale}/pricing`}>{t('upgradeBtn')}</Link>
                    </Button>
                </div>

                {/* Fake content for background visual */}
                <CardHeader className="opacity-30">
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {t('performanceTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="opacity-30 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="h-3 w-full bg-white/10 rounded" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="h-3 w-3/4 bg-white/10 rounded" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analytics || analytics.length === 0) {
        return (
            <Card className="dash-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        {t('performanceTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">{t('noLocationData')}</p>
                </CardContent>
            </Card>
        );
    }

    const maxRevenue = Math.max(...analytics.map(a => a.totalRevenue));

    return (
        <Card className="dash-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    {t('performanceTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {analytics.map((loc, index) => {
                    const barWidth = maxRevenue > 0 ? (loc.totalRevenue / maxRevenue) * 100 : 0;

                    return (
                        <div
                            key={loc.locationId}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {loc.locationName}
                                    </span>
                                    {index === 0 && (
                                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">
                                            <Star className="h-3 w-3" />
                                            {t('bestSpot')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    {loc.trend === 'UP' && (
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                    )}
                                    {loc.trend === 'DOWN' && (
                                        <TrendingDown className="h-4 w-4 text-red-600" />
                                    )}
                                    {loc.trend === 'STABLE' && (
                                        <Minus className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                            </div>

                            {/* Revenue bar */}
                            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-emerald-600">
                                    {formatCurrency(loc.totalRevenue, currency)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {t('activeDays', { count: loc.salesCount })}
                                </span>
                            </div>

                            {/* Top recipes */}
                            {loc.topRecipes.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {loc.topRecipes.map((recipe) => (
                                        <span
                                            key={recipe.name}
                                            className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 border border-emerald-200"
                                        >
                                            {recipe.name} ({recipe.quantity})
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
