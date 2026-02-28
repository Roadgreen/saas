import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { trackEvent } from '@/lib/tracking';

const UpdateOrderItemSchema = z.object({
    id: z.string(),
    recipeId: z.string(),
    quantitySold: z.number().int().positive(),
});

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, recipeId, quantitySold } = UpdateOrderItemSchema.parse(body);

        // Get user business to ensure ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Fetch OrderItem and check ownership via Order -> Business
        const orderItem = await prisma.orderItem.findUnique({
            where: { id },
            include: { order: true },
        });

        if (!orderItem || orderItem.order.businessId !== user.business.id) {
            return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
        }

        // Verify the new recipeId belongs to the user's business
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { sellingPrice: true, businessId: true },
        });

        if (!recipe || recipe.businessId !== user.business.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const unitPrice = recipe.sellingPrice || 0;
        const subtotal = unitPrice * quantitySold;

        // Update OrderItem
        const updatedItem = await prisma.orderItem.update({
            where: { id },
            data: {
                recipeId,
                quantity: quantitySold,
                unitPrice,
                subtotal,
            },
            include: {
                recipe: { select: { name: true } },
            },
        });

        // Recalculate Order total revenue
        const allItems = await prisma.orderItem.findMany({
            where: { orderId: orderItem.orderId },
        });

        const newTotalRevenue = allItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

        await prisma.order.update({
            where: { id: orderItem.orderId },
            data: { totalRevenue: newTotalRevenue },
        });

        trackEvent('ORDER_ITEM_UPDATED', {
            orderItemId: id,
            recipeId,
            quantity: quantitySold,
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Update order item error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
