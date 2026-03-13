import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        business: {
          select: {
            subscriptionTier: true,
            subscriptionStatus: true,
            subscriptionEndDate: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            trialEndsAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user?.business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const b = user.business;
    const now = new Date();
    let trialDaysRemaining: number | null = null;

    if (b.subscriptionStatus === 'TRIALING' && b.trialEndsAt) {
      const msLeft = new Date(b.trialEndsAt).getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
    }

    return NextResponse.json({
      tier: b.subscriptionTier,
      status: b.subscriptionStatus,
      subscriptionEndDate: b.subscriptionEndDate,
      trialEndsAt: b.trialEndsAt,
      trialDaysRemaining,
      stripeCustomerId: b.stripeCustomerId,
      stripeSubscriptionId: b.stripeSubscriptionId,
      createdAt: b.createdAt,
    });
  } catch (err) {
    console.error('[billing/status] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
