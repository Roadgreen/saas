import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json(user.business);
}

const ALLOWED_FIELDS = [
    'name', 'address', 'phone', 'email',
    'brandColor', 'logoUrl', 'socials',
    'openingHours', 'settings',
] as const;

export async function PATCH(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const body = await request.json();

    // Only allow updating known fields
    const data: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
        if (field in body) {
            data[field] = body[field];
        }
    }

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updated = await prisma.business.update({
        where: { id: user.business.id },
        data,
    });

    return NextResponse.json(updated);
}
