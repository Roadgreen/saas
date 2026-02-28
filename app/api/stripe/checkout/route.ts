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

    const { tier, locale } = await req.json();

    const priceMap: Record<string, string | undefined> = {
      PRO: process.env.STRIPE_PRO_PRICE_ID,
      ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };
    const priceId = priceMap[tier];
    if (!priceId) {
      return NextResponse.json({ error: `Prix non configuré pour le plan ${tier}. Ajoutez STRIPE_PRO_PRICE_ID dans votre .env` }, { status: 400 });
    }

    // Validate price exists and is recurring
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(priceId).catch(() => null);
    if (!price) {
      return NextResponse.json({ error: `Price ID introuvable dans Stripe: ${priceId}` }, { status: 400 });
    }
    if (price.type !== 'recurring') {
      return NextResponse.json({
        error: `Le prix ${priceId} est un paiement unique (one-time), pas un abonnement. Dans le dashboard Stripe, crée un nouveau prix avec "Recurring" coché, puis mets à jour STRIPE_PRO_PRICE_ID dans ton .env.`,
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { business: true },
    });

    if (!user?.business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const business = user.business;
    const appUrl = process.env.NEXTAUTH_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // Get or create Stripe customer
    let customerId = business.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: business.name,
        metadata: { businessId: business.id },
      });
      customerId = customer.id;
      await prisma.business.update({
        where: { id: business.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/${locale}/dashboard?payment=success`,
      cancel_url: `${appUrl}/${locale}/pricing`,
      metadata: { businessId: business.id, tier },
      subscription_data: {
        metadata: { businessId: business.id, tier },
        trial_period_days: 14,
      },
      // Show trial info on Stripe's hosted checkout page
      consent_collection: { terms_of_service: 'none' },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('[stripe/checkout] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
