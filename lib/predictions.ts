import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PredictionItem {
    recipeId: string;
    recipeName: string;
    predictedQuantity: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

export async function getSalesForecast(businessId: string, date: Date = new Date()): Promise<PredictionItem[]> {
    // 1. Determine day of week (0-6)
    const dayOfWeek = date.getDay();

    // 2. Fetch last 8 weeks of sales for this day
    const weeksToAnalyze = 8;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - (weeksToAnalyze * 7));

    const salesHistory = await (prisma as any).dailySales.findMany({
        where: {
            recipe: { businessId },
            date: {
                gte: startDate,
                lt: date,
            },
        },
        include: { recipe: true },
    });

    // Filter for the same day of week
    const sameDaySales = salesHistory.filter((sale: any) => {
        return new Date(sale.date).getDay() === dayOfWeek;
    });

    // 3. Group by recipe
    const salesByRecipe: Record<string, { name: string, quantities: number[] }> = {};

    sameDaySales.forEach((sale: any) => {
        if (!salesByRecipe[sale.recipeId]) {
            salesByRecipe[sale.recipeId] = {
                name: sale.recipe.name,
                quantities: [],
            };
        }
        // We might have multiple entries for the same day (e.g. different locations), sum them up?
        // For simplicity, let's just push them all for now, assuming one entry per recipe per day per location.
        // Ideally we should group by date first, then by recipe.
        salesByRecipe[sale.recipeId].quantities.push(sale.quantity);
    });

    // 4. Calculate Weighted Average
    const predictions: PredictionItem[] = [];

    Object.keys(salesByRecipe).forEach(recipeId => {
        const { name, quantities } = salesByRecipe[recipeId];

        if (quantities.length === 0) return;

        // Simple average for now if not enough data, or weighted if we had date-sorted data.
        // Since we just pushed quantities, let's assume they are somewhat distributed.
        // To do proper weighted average, we need to know *which* week each quantity belongs to.
        // Let's refine step 3 to group by date.
    });

    // Refined Step 3 & 4:
    const recipeSalesByDate: Record<string, Record<string, number>> = {}; // recipeId -> dateString -> quantity

    sameDaySales.forEach((sale: any) => {
        const dateStr = new Date(sale.date).toISOString().split('T')[0];
        if (!recipeSalesByDate[sale.recipeId]) {
            recipeSalesByDate[sale.recipeId] = {};
        }
        if (!recipeSalesByDate[sale.recipeId][dateStr]) {
            recipeSalesByDate[sale.recipeId][dateStr] = 0;
        }
        recipeSalesByDate[sale.recipeId][dateStr] += sale.quantity;
    });

    Object.keys(recipeSalesByDate).forEach(recipeId => {
        const dateMap = recipeSalesByDate[recipeId];
        const dates = Object.keys(dateMap).sort(); // Oldest to newest
        const quantities = dates.map(d => dateMap[d]);

        // Weighted Average: Recent weeks get more weight
        // Weights: 1, 2, 3, 4...
        let totalWeight = 0;
        let weightedSum = 0;

        quantities.forEach((qty, index) => {
            const weight = index + 1;
            weightedSum += qty * weight;
            totalWeight += weight;
        });

        const predictedQty = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

        // Trend
        const avgLast2 = quantities.slice(-2).reduce((a, b) => a + b, 0) / 2;
        const avgFirst2 = quantities.slice(0, 2).reduce((a, b) => a + b, 0) / 2;

        let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
        if (quantities.length >= 4) {
            if (avgLast2 > avgFirst2 * 1.1) trend = 'UP';
            else if (avgLast2 < avgFirst2 * 0.9) trend = 'DOWN';
        }

        // Find name (a bit inefficient but works)
        const recipeName = salesHistory.find((s: any) => s.recipeId === recipeId)?.recipe.name || 'Unknown';

        if (predictedQty > 0) {
            predictions.push({
                recipeId,
                recipeName,
                predictedQuantity: predictedQty,
                trend,
            });
        }
    });

    return predictions.sort((a, b) => b.predictedQuantity - a.predictedQuantity);
}
