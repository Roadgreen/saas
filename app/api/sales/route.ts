import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { processDailySales } from '@/lib/consumption';
import { trackEvent } from '@/lib/tracking';

const SalesSchema = z.object({
    recipeId: z.string(),
    quantitySold: z.number().int().positive(),
    date: z.string().optional(), // ISO string
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
        const { recipeId, quantitySold, date, locationId, weatherSnapshot } = SalesSchema.parse(body);

        // Get user's business for ownership verification
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Verify the recipe belongs to the user's business
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { businessId: true },
        });

        if (!recipe || recipe.businessId !== user.business.id) {
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

        // Create DailySales record
        const salesRecord = await prisma.dailySales.create({
            data: {
                recipeId,
                quantity: quantitySold,
                date: date ? new Date(date) : new Date(),
                locationId,
                weatherSnapshot,
            },
        });

        // Process stock consumption
        const consumptionResults = await processDailySales(recipeId, quantitySold);

        trackEvent('SALE_RECORDED', {
            recipeId,
            quantity: quantitySold,
            date: salesRecord.date,
        });

        return NextResponse.json({
            salesRecord,
            consumption: consumptionResults,
        });
    } catch (error) {
        console.error('Record sales error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

const UpdateSalesSchema = z.object({
    id: z.string(),
    recipeId: z.string(),
    quantitySold: z.number().int().positive(),
    date: z.string().optional(),
    locationId: z.string().optional().nullable(),
});

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, recipeId, quantitySold, date, locationId } = UpdateSalesSchema.parse(body);

        // Get user's business for ownership verification
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Check if sale exists and verify ownership via recipe -> business
        const existingSale = await prisma.dailySales.findUnique({
            where: { id },
            include: { recipe: { select: { businessId: true } } },
        });

        if (!existingSale) {
            return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
        }

        if (existingSale.recipe.businessId !== user.business.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Verify the new recipeId belongs to the user's business
        const newRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { businessId: true },
        });

        if (!newRecipe || newRecipe.businessId !== user.business.id) {
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

        // Update the sale record
        const updatedSale = await prisma.dailySales.update({
            where: { id },
            data: {
                recipeId,
                quantity: quantitySold,
                date: date ? new Date(date) : existingSale.date,
                locationId: locationId || null,
            },
            include: {
                recipe: { select: { name: true } },
                location: { select: { name: true } },
            },
        });

        trackEvent('SALE_UPDATED', {
            saleId: id,
            recipeId,
            quantity: quantitySold,
        });

        return NextResponse.json(updatedSale);
    } catch (error) {
        console.error('Update sales error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
