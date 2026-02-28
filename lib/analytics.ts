import { prisma } from '@/lib/prisma';

export async function getAnalytics(businessId: string) {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

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

// ─── Profitability Analytics ──────────────────────────────────

export interface DailyProfitability {
    date: string;
    revenue: number;
    cost: number;
    margin: number;
    marginPercent: number;
    wastesCost: number;
}

export async function getProfitabilityData(
    businessId: string,
    days: number = 30,
    locationId?: string
): Promise<DailyProfitability[]> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Initialize all days to zero
    const dayMap: Record<string, { revenue: number; cost: number; wastesCost: number }> = {};
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().split('T')[0];
        dayMap[key] = { revenue: 0, cost: 0, wastesCost: 0 };
    }

    // Fetch orders with recipe ingredients for cost calculation
    const orders = await prisma.order.findMany({
        where: {
            businessId,
            date: { gte: startDate },
            ...(locationId ? { locationId } : {}),
        },
        include: {
            items: {
                include: {
                    recipe: {
                        include: {
                            ingredients: {
                                include: { product: true },
                            },
                        },
                    },
                },
            },
        },
    });

    // Fetch waste events
    const wasteEvents = await prisma.wasteEvent.findMany({
        where: {
            product: {
                location: {
                    businessId,
                    ...(locationId ? { id: locationId } : {}),
                },
            },
            date: { gte: startDate },
        },
        include: { product: true },
    });

    // Aggregate orders by day
    for (const order of orders) {
        const dateKey = order.date.toISOString().split('T')[0];
        if (!dayMap[dateKey]) continue;

        for (const item of order.items) {
            // Revenue: prefer subtotal, then unitPrice * qty, then sellingPrice * qty
            const unitRevenue = item.subtotal
                ?? ((item.unitPrice ?? item.recipe.sellingPrice ?? 0) * item.quantity);
            dayMap[dateKey].revenue += unitRevenue;

            // Cost: sum of ingredient costs per unit * quantity sold
            const recipeCostPerUnit = item.recipe.ingredients.reduce((acc, ing) => {
                return acc + (ing.quantity * (ing.product.costPerUnit ?? 0));
            }, 0);
            dayMap[dateKey].cost += recipeCostPerUnit * item.quantity;
        }
    }

    // Aggregate waste by day
    for (const event of wasteEvents) {
        const dateKey = event.date.toISOString().split('T')[0];
        if (!dayMap[dateKey]) continue;
        dayMap[dateKey].wastesCost += event.quantity * (event.product.costPerUnit ?? 0);
    }

    // Convert to sorted array
    return Object.entries(dayMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => {
            const margin = data.revenue - data.cost;
            return {
                date,
                revenue: Math.round(data.revenue * 100) / 100,
                cost: Math.round(data.cost * 100) / 100,
                margin: Math.round(margin * 100) / 100,
                marginPercent: data.revenue > 0
                    ? Math.round((margin / data.revenue) * 10000) / 100
                    : 0,
                wastesCost: Math.round(data.wastesCost * 100) / 100,
            };
        });
}

// ─── Expiration & Waste Analysis ──────────────────────────────

export interface ExpiredProductRow {
    productId: string;
    name: string;
    unit: string;
    category: string | null;
    expiryDate: string;
    remainingQty: number;
    historicalQtyLost: number;
    totalQtyLost: number;
    costPerUnit: number | null;
    totalCostLost: number;
    locationName: string;
}

export interface ExpirationSummary {
    totalExpiredProducts: number;
    totalQtyLost: number;
    totalCostLost: number;
    rows: ExpiredProductRow[];
}

export async function getExpirationAnalytics(
    businessId: string,
    days: number = 30,
    locationId?: string
): Promise<ExpirationSummary> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const locationFilter = locationId ? { id: locationId } : {};

    // Query 1: Currently expired products with remaining stock
    const expiredProducts = await prisma.product.findMany({
        where: {
            location: {
                businessId,
                ...locationFilter,
            },
            expiryDate: { lt: now },
            quantity: { gt: 0 },
        },
        include: {
            location: { select: { name: true } },
            wasteEvents: {
                where: {
                    reason: 'EXPIRED',
                    date: { gte: startDate },
                },
            },
        },
        orderBy: { expiryDate: 'asc' },
    });

    // Query 2: Historical EXPIRED waste events for products with qty <= 0
    const historicalEvents = await prisma.wasteEvent.findMany({
        where: {
            reason: 'EXPIRED',
            date: { gte: startDate },
            product: {
                location: {
                    businessId,
                    ...locationFilter,
                },
                OR: [
                    { quantity: { lte: 0 } },
                    { expiryDate: { gte: now } }, // product expiry was extended but old events exist
                ],
            },
        },
        include: {
            product: {
                include: { location: { select: { name: true } } },
            },
        },
    });

    // Build rows from Query 1 (expired products with stock)
    const rowMap = new Map<string, ExpiredProductRow>();

    for (const product of expiredProducts) {
        const historicalQty = product.wasteEvents.reduce((sum, e) => sum + e.quantity, 0);
        const remainingQty = Math.round(product.quantity * 100) / 100;
        const totalQty = remainingQty + historicalQty;
        const cost = product.costPerUnit ?? 0;

        rowMap.set(product.id, {
            productId: product.id,
            name: product.name,
            unit: product.unit,
            category: product.category,
            expiryDate: product.expiryDate.toISOString().split('T')[0],
            remainingQty,
            historicalQtyLost: Math.round(historicalQty * 100) / 100,
            totalQtyLost: Math.round(totalQty * 100) / 100,
            costPerUnit: product.costPerUnit,
            totalCostLost: Math.round(totalQty * cost * 100) / 100,
            locationName: product.location.name,
        });
    }

    // Add rows from Query 2 (historical only, product qty <= 0)
    const histByProduct = new Map<string, { product: typeof historicalEvents[0]['product']; totalQty: number }>();
    for (const event of historicalEvents) {
        if (rowMap.has(event.productId)) continue; // already counted in Query 1
        const existing = histByProduct.get(event.productId);
        if (existing) {
            existing.totalQty += event.quantity;
        } else {
            histByProduct.set(event.productId, {
                product: event.product,
                totalQty: event.quantity,
            });
        }
    }

    for (const [productId, { product, totalQty }] of histByProduct) {
        const cost = product.costPerUnit ?? 0;
        rowMap.set(productId, {
            productId,
            name: product.name,
            unit: product.unit,
            category: product.category,
            expiryDate: product.expiryDate.toISOString().split('T')[0],
            remainingQty: 0,
            historicalQtyLost: Math.round(totalQty * 100) / 100,
            totalQtyLost: Math.round(totalQty * 100) / 100,
            costPerUnit: product.costPerUnit,
            totalCostLost: Math.round(totalQty * cost * 100) / 100,
            locationName: product.location.name,
        });
    }

    // Sort by cost lost DESC
    const rows = Array.from(rowMap.values()).sort((a, b) => b.totalCostLost - a.totalCostLost);

    return {
        totalExpiredProducts: expiredProducts.length,
        totalQtyLost: Math.round(rows.reduce((s, r) => s + r.totalQtyLost, 0) * 100) / 100,
        totalCostLost: Math.round(rows.reduce((s, r) => s + r.totalCostLost, 0) * 100) / 100,
        rows,
    };
}
