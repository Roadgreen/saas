import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getLocationAnalytics } from '@/lib/location-analytics';

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

    // Premium check
    const isPremium = user.business.subscriptionTier === 'PRO' || user.business.subscriptionTier === 'ENTERPRISE';
    if (!isPremium) {
        return NextResponse.json({ error: 'Premium required' }, { status: 403 });
    }

    const analytics = await getLocationAnalytics(user.business.id);
    return NextResponse.json(analytics);
}
