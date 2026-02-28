import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateStatus } from '@/lib/utils';

const ProductUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    quantity: z.coerce.number().min(0).optional(),
    unit: z.string().min(1).optional(),
    expiryDate: z.string().transform((str) => new Date(str)).optional(),
    imageUrl: z.string().optional(),
    costPerUnit: z.coerce.number().min(0).optional(),
    category: z.string().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
        where: { id },
        include: { location: { select: { businessId: true } } },
    });

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.location.businessId !== user.business.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Recalculate status dynamically
    return NextResponse.json({
        ...product,
        status: calculateStatus(product.expiryDate),
    });
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Verify the product belongs to the user's business
    const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { location: { select: { businessId: true } } },
    });

    if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existingProduct.location.businessId !== user.business.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const data = ProductUpdateSchema.parse(body);

        // Recalculate status if expiryDate changed
        const updateData: any = { ...data };
        if (data.expiryDate) {
            updateData.status = calculateStatus(data.expiryDate);
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            ...product,
            status: calculateStatus(product.expiryDate),
        });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Verify the product belongs to the user's business
    const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { location: { select: { businessId: true } } },
    });

    if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existingProduct.location.businessId !== user.business.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
