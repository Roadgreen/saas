import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, latitude, longitude, address } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Get the user's business
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.businessId) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        const location = await prisma.location.create({
            data: {
                name,
                latitude,
                longitude,
                address,
                businessId: user.businessId,
            },
        });

        return NextResponse.json(location);
    } catch (error) {
        console.error('Failed to create location:', error);
        return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.businessId) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        const locations = await prisma.location.findMany({
            where: { businessId: user.businessId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}
export async function DELETE(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { business: true },
        });

        if (!user?.businessId) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Verify ownership
        const location = await prisma.location.findUnique({
            where: { id },
        });

        if (!location || location.businessId !== user.businessId) {
            return NextResponse.json({ error: 'Location not found or unauthorized' }, { status: 404 });
        }

        await prisma.location.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete location:', error);
        return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
    }
}
