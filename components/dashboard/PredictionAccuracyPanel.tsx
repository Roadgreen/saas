'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const ERROR_TAG_I18N_MAP: Record<string, string> = {
    WEATHER_SHIFT: 'weatherShiftTag',
    NEW_LOCATION: 'newLocationTag',
    NO_SALES_DAY: 'noSalesDayTag',
    UNUSUAL_VOLUME: 'unusualVolumeTag',
    CONSISTENT_OVER_PREDICT: 'consistentOverTag',
    CONSISTENT_UNDER_PREDICT: 'consistentUnderTag',
};

interface RecipeMetric {
    recipeId: string;
    recipeName: string;
    avgAccuracy: number;
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    totalPredictions: number;
    avgDeviation: number;
    commonErrors: string[];
}

interface DailyBreakdown {
    date: string;
    avgAccuracy: number;
    totalPredicted: number;
    totalActual: number;
}

interface PredictionAccuracyPanelProps {
    metrics: {
        overallAccuracy: number;
        predictabilityScore: number;
        totalDaysTracked: number;
        recipeMetrics: RecipeMetric[];
        dailyBreakdown: DailyBreakdown[];
    } | null;
    isPremium: boolean;
}

function getScoreColor(score: number): string {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
}

function getAccuracyBgColor(accuracy: number): string {
    if (accuracy > 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
}

function formatShortDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function PredictionAccuracyPanel({ metrics, isPremium }: PredictionAccuracyPanelProps) {
    const t = useTranslations('Dashboard');
    const locale = useLocale();

    if (!isPremium) {
        return (
            <Card className="relative overflow-hidden dash-card">
                <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-white/80 p-6 text-center">
                    <Lock className="h-8 w-8 text-emerald-600 mb-2" />
                    <h3 className="font-bold text-lg text-gray-900">{t('upgradeAccuracy')}</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-xs">{t('upgradeAccuracyDesc')}</p>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href={`/${locale}/pricing`}>{t('upgradePremium')}</Link>
                    </Button>
                </div>

                {/* Fake blurred background content */}
                <CardHeader className="opacity-50">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {t('upgradeAccuracy')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="opacity-50 space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-3xl font-bold text-emerald-600">87</div>
                        <div>
                            <div className="text-sm font-medium">{t('predictabilityScore')}</div>
                            <div className="text-xs text-emerald-600">{t('highPredictability')}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-muted-foreground">Crepe Classique</div>
                        <div className="text-sm font-medium text-green-600">92%</div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-muted-foreground">Galette Jambon</div>
                        <div className="text-sm font-medium text-yellow-600">74%</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!metrics) {
        return (
            <Card className="dash-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-emerald-600" />
                        {t('upgradeAccuracy')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">{t('noAccuracyData')}</p>
                </CardContent>
            </Card>
        );
    }

    const predictabilityLabel =
        metrics.predictabilityScore >= 85
            ? t('highPredictability')
            : metrics.predictabilityScore >= 60
              ? t('mediumPredictability')
              : t('lowPredictability');

    const last7Days = metrics.dailyBreakdown.slice(-7);

    return (
        <Card className="dash-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    {t('upgradeAccuracy')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
                {/* Section A - Predictability Score */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className={`text-4xl font-bold ${getScoreColor(metrics.predictabilityScore)}`}>
                        {metrics.predictabilityScore}
                    </div>
                    <div>
                        <div className="text-sm font-medium">
                            {t('predictabilityScore')}
                            <span className="text-xs text-muted-foreground ml-1">/ 100</span>
                        </div>
                        <div className={`text-xs font-medium ${getScoreColor(metrics.predictabilityScore)}`}>
                            {predictabilityLabel}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {t('selfImproving')}
                        </div>
                    </div>
                </div>

                {/* Section B - Daily Breakdown (last 7 days) */}
                <div>
                    <h4 className="text-sm font-medium mb-2">{t('dailyBreakdown')}</h4>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t('date')}</th>
                                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">{t('predicted')}</th>
                                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">{t('actual')}</th>
                                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">{t('accuracy')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {last7Days.map((day) => (
                                    <tr key={day.date} className="border-t border-gray-100">
                                        <td className="px-3 py-2">{formatShortDate(day.date)}</td>
                                        <td className="px-3 py-2 text-right text-muted-foreground">{day.totalPredicted}</td>
                                        <td className="px-3 py-2 text-right text-muted-foreground">{day.totalActual}</td>
                                        <td className={`px-3 py-2 text-right font-medium ${getAccuracyBgColor(day.avgAccuracy)}`}>
                                            {day.avgAccuracy}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section C - Per-Recipe Accuracy */}
                <div>
                    <h4 className="text-sm font-medium mb-2">{t('perRecipeAccuracy')}</h4>
                    <div className="space-y-2">
                        {metrics.recipeMetrics.map((recipe) => (
                            <div
                                key={recipe.recipeId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-medium truncate">
                                        {recipe.recipeName}
                                    </span>
                                    <span className={`text-xs font-medium ${getAccuracyBgColor(recipe.avgAccuracy)}`}>
                                        {recipe.avgAccuracy}%
                                    </span>
                                    {recipe.trend === 'IMPROVING' && (
                                        <TrendingUp className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                    )}
                                    {recipe.trend === 'DECLINING' && (
                                        <TrendingDown className="h-3.5 w-3.5 text-red-600 shrink-0" />
                                    )}
                                    {recipe.trend === 'STABLE' && (
                                        <Minus className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                    {recipe.commonErrors.map((error) => {
                                        const i18nKey = ERROR_TAG_I18N_MAP[error];
                                        if (!i18nKey) return null;
                                        return (
                                            <span
                                                key={error}
                                                className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium whitespace-nowrap"
                                            >
                                                {t(i18nKey)}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
