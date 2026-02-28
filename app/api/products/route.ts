import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateStatus } from '@/lib/utils';

const ProductSchema = z.object({
    name: z.string().min(1),
    quantity: z.coerce.number().min(0),
    unit: z.string().min(1),
    expiryDate: z.string().transform((str) => new Date(str)),
    locationId: z.string().optional(),
    imageUrl: z.string().optional(),
    costPerUnit: z.coerce.number().min(0).optional(),
    category: z.string().optional(),
});

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: { include: { locations: true } } },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // For MVP, just get products from the first location or all locations
    // Let's get all products for the business
    const products = await prisma.product.findMany({
        where: {
            location: {
                businessId: user.business.id,
            },
        },
        orderBy: { expiryDate: 'asc' },
        include: { location: true },
    });

    // Recalculate status dynamically based on current date
    const enriched = products.map(p => ({
        ...p,
        status: calculateStatus(p.expiryDate),
    }));

    return NextResponse.json(enriched);
}

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

    try {
        const body = await req.json();
        const data = ProductSchema.parse(body);

        // Use provided locationId or default to the first location
        const locationId = data.locationId || user.business.locations[0].id;

        // If a locationId was explicitly provided, verify it belongs to the user's business
        if (data.locationId) {
            const location = await prisma.location.findUnique({
                where: { id: data.locationId },
                select: { businessId: true },
            });

            if (!location || location.businessId !== user.business.id) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                quantity: data.quantity,
                unit: data.unit,
                expiryDate: data.expiryDate,
                locationId: locationId,
                status: calculateStatus(data.expiryDate),
                imageUrl: data.imageUrl,
                costPerUnit: data.costPerUnit,
                category: data.category,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Create product error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
