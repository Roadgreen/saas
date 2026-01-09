import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { processDailySales } from '@/lib/consumption';
import { trackEvent } from '@/lib/tracking';

const prisma = new PrismaClient();

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
