import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getPredictionMetrics } from '@/lib/prediction-accuracy';

export async function GET(req: Request) {
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

    if (user.business.subscriptionTier === 'FREE') {
        return NextResponse.json({ error: 'Premium feature' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '30', 10);

        const metrics = await getPredictionMetrics(user.business.id, days);

        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Prediction accuracy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
