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

    const { tier, locale, billing } = await req.json();

    // Yearly price IDs are optional env vars. If the tier is requested yearly
    // but no yearly price is configured, fall back to the monthly price so
    // checkout still works (rather than 400-ing the user).
    const isYearly = billing === 'yearly';
    const monthlyMap: Record<string, string | undefined> = {
      PRO: process.env.STRIPE_PRO_PRICE_ID,
      ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };
    const yearlyMap: Record<string, string | undefined> = {
      PRO: process.env.STRIPE_PRO_PRICE_ID_YEARLY,
      ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID_YEARLY,
    };
    const priceId = (isYearly && yearlyMap[tier]) || monthlyMap[tier];
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

    // Launch offer: apply 50% off the first invoice for PRO monthly subscribers,
    // bringing the first paid month from 19.99€ to 9.99€. The coupon ID is read
    // from STRIPE_LAUNCH_COUPON_ID. Create it in Stripe with: 50% off, duration
    // "once" so it only applies to the first invoice after the trial.
    const launchCouponId = process.env.STRIPE_LAUNCH_COUPON_ID;
    const applyLaunchOffer =
      tier === 'PRO' && !isYearly && Boolean(launchCouponId);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/${locale}/dashboard?payment=success`,
      cancel_url: `${appUrl}/${locale}/pricing`,
      metadata: {
        businessId: business.id,
        tier,
        billing: isYearly ? 'yearly' : 'monthly',
        launchOffer: applyLaunchOffer ? '1' : '0',
      },
      subscription_data: {
        metadata: {
          businessId: business.id,
          tier,
          billing: isYearly ? 'yearly' : 'monthly',
          launchOffer: applyLaunchOffer ? '1' : '0',
        },
        trial_period_days: 14,
      },
      ...(applyLaunchOffer && launchCouponId
        ? { discounts: [{ coupon: launchCouponId }] }
        : {}),
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
