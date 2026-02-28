import { prisma } from '@/lib/prisma';

export interface LocationAnalytics {
    locationId: string;
    locationName: string;
    totalRevenue: number;
    salesCount: number;
    avgDailyRevenue: number;
    topRecipes: { name: string; quantity: number }[];
    trend: 'UP' | 'DOWN' | 'STABLE';
}

export async function getLocationAnalytics(businessId: string): Promise<LocationAnalytics[]> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fifteenDaysAgo = new Date(now);
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Get all locations for this business
    const locations = await prisma.location.findMany({
        where: { businessId },
        select: { id: true, name: true },
    });

    if (locations.length === 0) return [];

    const results: LocationAnalytics[] = [];

    for (const loc of locations) {
        // Get DailySales for this location (last 30 days)
        const dailySales = await prisma.dailySales.findMany({
            where: {
                locationId: loc.id,
                date: { gte: thirtyDaysAgo },
            },
            include: { recipe: { select: { name: true } } },
        });

        // Get Orders for this location (last 30 days)
        const orders = await prisma.order.findMany({
            where: {
                locationId: loc.id,
                date: { gte: thirtyDaysAgo },
            },
            include: {
                items: {
                    include: { recipe: { select: { name: true } } },
                },
            },
        });

        // Calculate total revenue from DailySales
        const dailyRevenue = dailySales.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
        // Calculate total revenue from Orders
        const orderRevenue = orders.reduce((sum, o) => sum + (o.totalRevenue || 0), 0);
        const totalRevenue = dailyRevenue + orderRevenue;

        // Count unique active days
        const activeDays = new Set<string>();
        dailySales.forEach(s => activeDays.add(new Date(s.date).toISOString().split('T')[0]));
        orders.forEach(o => activeDays.add(new Date(o.date).toISOString().split('T')[0]));
        const salesCount = activeDays.size;

        const avgDailyRevenue = salesCount > 0 ? Math.round(totalRevenue / salesCount * 100) / 100 : 0;

        // Top recipes by quantity
        const recipeQuantities: Record<string, { name: string; quantity: number }> = {};
        dailySales.forEach(s => {
            const name = s.recipe.name;
            if (!recipeQuantities[name]) recipeQuantities[name] = { name, quantity: 0 };
            recipeQuantities[name].quantity += s.quantity;
        });
        orders.forEach(o => {
            o.items.forEach(item => {
                const name = item.recipe.name;
                if (!recipeQuantities[name]) recipeQuantities[name] = { name, quantity: 0 };
                recipeQuantities[name].quantity += item.quantity;
            });
        });
        const topRecipes = Object.values(recipeQuantities)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 3);

        // Trend: compare last 15 days vs previous 15 days
        const recentRevenue = dailySales
            .filter(s => new Date(s.date) >= fifteenDaysAgo)
            .reduce((sum, s) => sum + (s.totalRevenue || 0), 0)
            + orders
            .filter(o => new Date(o.date) >= fifteenDaysAgo)
            .reduce((sum, o) => sum + (o.totalRevenue || 0), 0);

        const olderRevenue = totalRevenue - recentRevenue;

        let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
        if (olderRevenue > 0) {
            const ratio = recentRevenue / olderRevenue;
            if (ratio > 1.15) trend = 'UP';
            else if (ratio < 0.85) trend = 'DOWN';
        }

        if (salesCount > 0) {
            results.push({
                locationId: loc.id,
                locationName: loc.name,
                totalRevenue,
                salesCount,
                avgDailyRevenue,
                topRecipes,
                trend,
            });
        }
    }

    return results.sort((a, b) => b.totalRevenue - a.totalRevenue);
}
