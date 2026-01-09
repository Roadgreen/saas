import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { calculateStatus } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

const prisma = new PrismaClient();

const StockIngestSchema = z.object({
    items: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        unit: z.string(),
        expiryDate: z.string().optional(), // AI might not always get a date, default to +7 days if missing? Or require it?
    })),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: { include: { locations: true } } },
    });

    if (!user?.business || user.business.locations.length === 0) {
        return NextResponse.json({ error: 'Business or Location not found' }, { status: 404 });
    }

    const locationId = user.business.locations[0].id;

    try {
        const body = await req.json();
        const { items } = StockIngestSchema.parse(body);

        const results = [];

        for (const item of items) {
            // Default expiry to 1 week if not provided (for MVP)
            const expiryDate = item.expiryDate ? new Date(item.expiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            const product = await prisma.product.create({
                data: {
                    name: item.name,
                    quantity: item.quantity,
                    unit: item.unit,
                    expiryDate: expiryDate,
                    locationId: locationId,
                    status: calculateStatus(expiryDate),
                },
            });

            // Log history
            await prisma.stockHistory.create({
                data: {
                    quantity: item.quantity,
                    type: 'MANUAL', // Or 'DELIVERY' if we want to be specific
                    productId: product.id,
                    note: 'Bulk ingest',
                },
            });

            results.push(product);
        }

        trackEvent('STOCK_UPDATED', {
            businessId: user.business.id,
            itemsCount: results.length,
            source: 'bulk_ingest',
        });

        return NextResponse.json({ count: results.length, items: results });
    } catch (error) {
        console.error('Stock ingest error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
