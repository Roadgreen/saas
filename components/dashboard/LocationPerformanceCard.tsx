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
                <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-white/80 p-6 text-center">
                    <Lock className="h-8 w-8 text-emerald-600 mb-2" />
                    <h3 className="font-bold text-lg text-gray-900">{t('upgradeTitle')}</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-xs">{t('upgradeDesc')}</p>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href={`/${locale}/pricing`}>{t('upgradeBtn')}</Link>
                    </Button>
                </div>

                {/* Fake content for background visual */}
                <CardHeader className="opacity-50">
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {t('performanceTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="opacity-50 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-3 w-full bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-3 w-1/2 bg-gray-200 rounded" />
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
