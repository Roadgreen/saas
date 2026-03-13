import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { locale } = await req.json().catch(() => ({ locale: 'fr' }));

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { business: { select: { stripeCustomerId: true } } },
    });

    if (!user?.business?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe first.' },
        { status: 400 },
      );
    }

    const appUrl =
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.business.stripeCustomerId,
      return_url: `${appUrl}/${locale}/dashboard/settings/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error('[billing/portal] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
