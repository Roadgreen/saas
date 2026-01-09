import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { calculateStatus } from '@/lib/utils';

const prisma = new PrismaClient();

const ProductSchema = z.object({
    name: z.string().min(1),
    quantity: z.coerce.number().min(0),
    unit: z.string().min(1),
    expiryDate: z.string().transform((str) => new Date(str)),
    locationId: z.string().optional(), // Optional if we infer from user's business
    imageUrl: z.string().optional(),
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

    return NextResponse.json(products);
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

        const product = await prisma.product.create({
            data: {
                name: data.name,
                quantity: data.quantity,
                unit: data.unit,
                expiryDate: data.expiryDate,
                locationId: locationId,
                status: calculateStatus(data.expiryDate),
                imageUrl: data.imageUrl,
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
