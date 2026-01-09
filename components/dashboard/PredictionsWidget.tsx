'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PredictionItem {
    recipeId: string;
    recipeName: string;
    predictedQuantity: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

interface PredictionsWidgetProps {
    predictions: PredictionItem[];
}

export function PredictionsWidget({ predictions }: PredictionsWidgetProps) {
    const t = useTranslations('Dashboard'); // Assuming we'll add keys here or create a new section

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    🎯 {t('forecastTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {predictions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        {t('noDataPredictions')}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {predictions.slice(0, 5).map((item) => (
                            <div key={item.recipeId} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.recipeName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t('predictedLabel', { count: item.predictedQuantity })}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    {item.trend === 'UP' && <TrendingUp className="h-4 w-4 text-green-500" />}
                                    {item.trend === 'DOWN' && <TrendingDown className="h-4 w-4 text-red-500" />}
                                    {item.trend === 'STABLE' && <Minus className="h-4 w-4 text-gray-400" />}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
