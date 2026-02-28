import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { processDailySales } from '@/lib/consumption';
import { trackEvent } from '@/lib/tracking';

const BatchSalesSchema = z.object({
    items: z.array(z.object({
        recipeId: z.string(),
        quantity: z.number().int().positive(),
    })),
    date: z.string().optional(),
    locationId: z.string().optional(),
    weatherSnapshot: z.any().optional(),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, date, locationId, weatherSnapshot } = BatchSalesSchema.parse(body);

        // Get user's business
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Verify all recipeIds belong to the user's business
        const recipeIds = items.map(item => item.recipeId);
        const recipes = await prisma.recipe.findMany({
            where: { id: { in: recipeIds } },
            select: { id: true, name: true, sellingPrice: true, businessId: true },
        });

        const allRecipesOwned = recipes.length === recipeIds.length &&
            recipes.every(r => r.businessId === user.business!.id);

        if (!allRecipesOwned) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // If locationId is provided, verify it belongs to the user's business
        if (locationId) {
            const location = await prisma.location.findUnique({
                where: { id: locationId },
                select: { businessId: true },
            });

            if (!location || location.businessId !== user.business.id) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const recipeMap = new Map(recipes.map(r => [r.id, r]));

        // Prepare order items with calculated prices
        const orderItems = items.map(item => {
            const recipe = recipeMap.get(item.recipeId);
            const unitPrice = recipe?.sellingPrice || 0;
            const subtotal = unitPrice * item.quantity;
            return {
                recipeId: item.recipeId,
                quantity: item.quantity,
                unitPrice,
                subtotal,
            };
        });

        // Calculate total revenue
        const totalRevenue = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

        // Create Order with items
        const order = await prisma.order.create({
            data: {
                date: date ? new Date(date) : new Date(),
                totalRevenue,
                weatherSnapshot,
                locationId: locationId || null,
                businessId: user.business.id,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        recipe: { select: { name: true } },
                    },
                },
                location: { select: { name: true } },
            },
        });

        // Process stock consumption for each item
        for (const item of items) {
            await processDailySales(item.recipeId, item.quantity);
        }

        trackEvent('ORDER_CREATED', {
            orderId: order.id,
            itemCount: items.length,
            totalRevenue,
            date: order.date,
        });

        return NextResponse.json({
            order,
            totalRevenue,
            itemCount: items.length,
        });
    } catch (error) {
        console.error('Batch sales error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
