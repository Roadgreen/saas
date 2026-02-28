'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IngredientReadiness {
    productName: string;
    needed: number;
    available: number;
    unit: string;
    status: 'OK' | 'TIGHT' | 'SHORT';
    deficit: number;
}

interface RecipeReadiness {
    recipeId: string;
    recipeName: string;
    predictedQuantity: number;
    ingredients: IngredientReadiness[];
    status: 'OK' | 'TIGHT' | 'SHORT';
}

interface StockReadinessCardProps {
    readiness: RecipeReadiness[];
    forecastDayName?: string;
}

const STATUS_CONFIG = {
    OK: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        dot: 'bg-green-500',
    },
    TIGHT: {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500',
    },
    SHORT: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
} as const;

export function StockReadinessCard({ readiness, forecastDayName }: StockReadinessCardProps) {
    const t = useTranslations('Dashboard');
    const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

    if (readiness.length === 0) return null;

    const shortCount = readiness.filter((r) => r.status === 'SHORT').length;
    const tightCount = readiness.filter((r) => r.status === 'TIGHT').length;
    const okCount = readiness.filter((r) => r.status === 'OK').length;

    // Sort: SHORT first, then TIGHT, then OK
    const sorted = [...readiness].sort((a, b) => {
        const order = { SHORT: 0, TIGHT: 1, OK: 2 };
        return order[a.status] - order[b.status];
    });

    return (
        <Card className="dash-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="rounded-md bg-purple-100 p-1.5">
                        <Package className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <div>
                        {t('readinessTitle')}
                        {forecastDayName && (
                            <span className="block text-xs font-normal text-muted-foreground">
                                {t('readinessSubtitle', { day: forecastDayName })}
                            </span>
                        )}
                    </div>
                </CardTitle>

                {/* Summary badges */}
                <div className="flex items-center gap-2 pt-1">
                    {shortCount > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {shortCount} {t('readinessShort')}
                        </span>
                    )}
                    {tightCount > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {tightCount} {t('readinessTight')}
                        </span>
                    )}
                    {okCount > 0 && shortCount === 0 && tightCount === 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {t('readinessAllGood')}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {sorted.map((recipe) => {
                    const config = STATUS_CONFIG[recipe.status];
                    const StatusIcon = config.icon;
                    const isExpanded = expandedRecipe === recipe.recipeId;

                    return (
                        <div key={recipe.recipeId} className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden`}>
                            <button
                                onClick={() => setExpandedRecipe(isExpanded ? null : recipe.recipeId)}
                                className="w-full flex items-center justify-between p-3 text-left"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <StatusIcon className={`h-4 w-4 shrink-0 ${config.color}`} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{recipe.recipeName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t('readinessPredicted', { count: recipe.predictedQuantity })}
                                            {' · '}
                                            {recipe.ingredients.length} {t('readinessIngredients')}
                                        </p>
                                    </div>
                                </div>
                                {isExpanded
                                    ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                                    : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                                }
                            </button>

                            {isExpanded && (
                                <div className="px-3 pb-3 space-y-1.5">
                                    {recipe.ingredients.map((ing) => {
                                        const ingConfig = STATUS_CONFIG[ing.status];
                                        return (
                                            <div key={ing.productName} className="flex items-center justify-between text-xs bg-gray-50/50 rounded px-2.5 py-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${ingConfig.dot}`} />
                                                    <span className="truncate">{ing.productName}</span>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0 text-right">
                                                    <span className="text-muted-foreground">
                                                        {t('readinessNeed')} {ing.needed} {ing.unit}
                                                    </span>
                                                    <span className={ingConfig.color}>
                                                        {t('readinessHave')} {ing.available} {ing.unit}
                                                    </span>
                                                    {ing.status === 'SHORT' && (
                                                        <span className="font-medium text-red-600">
                                                            -{ing.deficit} {ing.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
