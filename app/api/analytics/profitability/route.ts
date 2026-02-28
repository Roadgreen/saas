import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getProfitabilityData } from '@/lib/analytics';

export async function GET(request: Request) {
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

    const isPremium = user.business.subscriptionTier === 'PRO' || user.business.subscriptionTier === 'ENTERPRISE';
    if (!isPremium) {
        return NextResponse.json({ error: 'Premium required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get('days') ?? '30', 10) || 30, 90);

    const data = await getProfitabilityData(user.business.id, days);
    return NextResponse.json(data);
}
