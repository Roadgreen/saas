'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Lock, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ContextualInfoCard } from './ContextualInfoCard';

interface PredictionItem {
    recipeId: string;
    recipeName: string;
    predictedQuantity: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

interface PredictionsWidgetProps {
    predictions: PredictionItem[];
    isPremium: boolean;
    forecastDayName?: string;
    forecastLocationName?: string | null;
    accuracyMetrics?: {
        overallAccuracy: number;
        predictabilityScore: number;
        recipeAccuracies: Record<string, number>;
    } | null;
}

function getAccuracyBadgeClasses(accuracy: number): string {
    if (accuracy > 80) return 'bg-green-100 text-green-600';
    if (accuracy >= 60) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
}

function getRecipeDotClass(accuracy: number | undefined): string {
    if (accuracy === undefined) return 'bg-gray-200';
    if (accuracy > 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
}

export function PredictionsWidget({ predictions, isPremium, forecastDayName, forecastLocationName, accuracyMetrics }: PredictionsWidgetProps) {
    const t = useTranslations('Dashboard');
    const tHelp = useTranslations('ContextualHelp');

    const title = forecastDayName
        ? t('forecastFor', { day: forecastDayName })
        : t('forecastTitle');

    return (
        <Card className="dash-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="rounded-md bg-blue-100 p-1.5">
                        <Target className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                        {title}
                        {forecastLocationName && (
                            <span className="block text-xs font-normal text-muted-foreground">
                                {forecastLocationName}
                            </span>
                        )}
                    </div>
                </CardTitle>
                <div className="flex items-center">
                    {isPremium && accuracyMetrics ? (
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAccuracyBadgeClasses(accuracyMetrics.overallAccuracy)}`}
                        >
                            {t('accuracyBadge', { percent: accuracyMetrics.overallAccuracy })}
                        </span>
                    ) : !isPremium ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <ContextualInfoCard
                    message={tHelp('predictionsInfo')}
                    learnMore={tHelp('predictionsLearnMore')}
                    storageKey="predictions-info"
                    compact
                />
                {predictions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        {t('noDataPredictions')}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {predictions.slice(0, 5).map((item) => (
                            <div key={item.recipeId} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isPremium && accuracyMetrics && (
                                        <span
                                            className={`inline-block h-2 w-2 rounded-full shrink-0 ${getRecipeDotClass(accuracyMetrics.recipeAccuracies[item.recipeId])}`}
                                        />
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.recipeName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t('predictedLabel', { count: item.predictedQuantity })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {item.trend === 'UP' && <TrendingUp className="h-4 w-4 text-green-600" />}
                                    {item.trend === 'DOWN' && <TrendingDown className="h-4 w-4 text-red-600" />}
                                    {item.trend === 'STABLE' && <Minus className="h-4 w-4 text-muted-foreground" />}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
