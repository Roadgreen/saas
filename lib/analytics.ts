import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAnalytics(businessId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Waste Metrics (Dry Losses)
    const getWasteStats = async (fromDate: Date) => {
        const wasteEvents = await prisma.wasteEvent.findMany({
            where: {
                product: { location: { businessId } },
                date: { gte: fromDate },
            },
            include: { product: true },
        });

        const totalCost = wasteEvents.reduce((acc, event) => {
            return acc + (event.quantity * (event.product.costPerUnit || 0));
        }, 0);

        return totalCost;
    };

    const wasteDay = await getWasteStats(startOfDay);
    const wasteWeek = await getWasteStats(startOfWeek);
    const wasteMonth = await getWasteStats(startOfMonth);

    // 2. Sales vs Stock Used (Theoretical Consumption)
    const sales = await prisma.dailySales.findMany({
        where: {
            recipe: { businessId },
            date: { gte: startOfWeek },
        },
        include: { recipe: { include: { ingredients: { include: { product: true } } } } },
    });

    const totalRevenue = sales.reduce((acc: number, sale: any) => acc + (sale.totalRevenue || 0), 0);

    const totalStockUsedCost = sales.reduce((acc: number, sale: any) => {
        const recipeCost = sale.recipe.ingredients.reduce((rAcc: number, ing: any) => {
            return rAcc + (ing.quantity * (ing.product.costPerUnit || 0));
        }, 0);
        return acc + (sale.quantity * recipeCost);
    }, 0);

    // 3. Waste Rate per Ingredient
    // Get all waste events for the week
    const weeklyWasteEvents = await prisma.wasteEvent.findMany({
        where: {
            product: { location: { businessId } },
            date: { gte: startOfWeek },
        },
        include: { product: true },
    });

    // Group by product
    const wasteByProduct: Record<string, { name: string, wasteQty: number, wasteCost: number }> = {};
    weeklyWasteEvents.forEach(event => {
        if (!wasteByProduct[event.productId]) {
            wasteByProduct[event.productId] = {
                name: event.product.name,
                wasteQty: 0,
                wasteCost: 0
            };
        }
        wasteByProduct[event.productId].wasteQty += event.quantity;
        wasteByProduct[event.productId].wasteCost += (event.quantity * (event.product.costPerUnit || 0));
    });

    // Calculate consumption (from sales) per product
    const consumptionByProduct: Record<string, number> = {};
    sales.forEach((sale: any) => {
        sale.recipe.ingredients.forEach((ing: any) => {
            if (!consumptionByProduct[ing.productId]) {
                consumptionByProduct[ing.productId] = 0;
            }
            consumptionByProduct[ing.productId] += (sale.quantity * ing.quantity);
        });
    });

    // Calculate Rate
    const ingredientStats = Object.keys(wasteByProduct).map(productId => {
        const waste = wasteByProduct[productId].wasteQty;
        const consumption = consumptionByProduct[productId] || 0;
        const total = waste + consumption;
        const rate = total > 0 ? (waste / total) * 100 : 0;

        return {
            name: wasteByProduct[productId].name,
            wasteCost: wasteByProduct[productId].wasteCost,
            rate: rate,
        };
    }).sort((a, b) => b.wasteCost - a.wasteCost);

    // 4. Alerts (>10% waste OR expiring soon)
    const alerts = ingredientStats
        .filter(stat => stat.rate > 10)
        .map(stat => ({ type: 'HIGH_WASTE', name: stat.name, rate: stat.rate.toFixed(1) }));

    // Check for expiring products (<= 24h)
    const expiringProducts = await prisma.product.findMany({
        where: {
            location: { businessId },
            expiryDate: {
                lte: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Now + 24h
                gte: now, // Not already expired (optional, maybe we want to show expired too)
            },
            quantity: { gt: 0 }, // Only if in stock
        },
    });

    expiringProducts.forEach(product => {
        alerts.push({ type: 'EXPIRING_SOON', name: product.name, rate: '0' } as any);
    });

    // 5. Simple Dashboard Metrics
    const currentStockCount = await prisma.product.count({
        where: {
            location: { businessId },
            quantity: { gt: 0 },
        },
    });

    const expiringSoonCount = expiringProducts.length;

    const todaySalesData = await prisma.dailySales.aggregate({
        where: {
            recipe: { businessId },
            date: { gte: startOfDay },
        },
        _sum: {
            totalRevenue: true,
        },
    });

    interface WasteEventWithProduct {
        quantity: number;
        product: {
            costPerUnit: number | null;
            name: string;
        };
        productId: string;
    }

    interface SaleWithRecipe {
        quantity: number;
        totalRevenue: number | null;
        recipe: {
            ingredients: {
                quantity: number;
                product: {
                    costPerUnit: number | null;
                };
                productId: string;
            }[];
        };
    }

    interface SmartAnalysisItem {
        type: string;
        productName: string;
        detail: string;
        recommendation: string;
    }

    // ...

    // 6. Smart Analysis (AI-Lite)
    const smartAnalysis: SmartAnalysisItem[] = [];

    // Risk: High Waste Rate (> 15%)
    ingredientStats.filter(stat => stat.rate > 15).forEach(stat => {
        smartAnalysis.push({
            type: 'HIGH_WASTE',
            productName: stat.name,
            detail: stat.rate.toFixed(1), // Just the number
            recommendation: 'rec_check',
        });
    });

    // Risk: Expiring Soon (< 48h) - using expiringProducts from before (which was < 24h, let's expand or reuse)
    // Re-fetching or filtering for 48h if needed, but for now let's use the existing expiringProducts (<= 24h) for high urgency
    // and maybe add another check for 48h if we want "upcoming" risk.
    // Let's stick to the existing expiringProducts for simplicity but add a recommendation.
    expiringProducts.forEach(product => {
        smartAnalysis.push({
            type: 'EXPIRING_SOON',
            productName: product.name,
            detail: '24', // Just the number or a key
            recommendation: 'rec_promo',
        });
    });

    return {
        waste: { day: wasteDay, week: wasteWeek, month: wasteMonth },
        salesVsStock: { revenue: totalRevenue, stockCost: totalStockUsedCost },
        topWaste: ingredientStats.slice(0, 5),
        alerts,
        simpleStats: {
            currentStock: currentStockCount,
            expiringSoon: expiringSoonCount,
            todaySales: todaySalesData._sum.totalRevenue || 0,
            todayLosses: wasteDay,
        },
        smartAnalysis,
    };
}
