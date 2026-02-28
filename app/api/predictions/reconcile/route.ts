import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { computeAccuracy } from '@/lib/prediction-accuracy';

export async function POST() {
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
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        await computeAccuracy(user.business.id, yesterday);

        return NextResponse.json({
            success: true,
            date: yesterday.toISOString(),
        });
    } catch (error) {
        console.error('Prediction reconcile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
