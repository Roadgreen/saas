import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.metadata?.businessId;
      const tier = session.metadata?.tier;

      if (businessId && tier && session.subscription) {
        // Retrieve the subscription to know if it's trialing or active
        const sub = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );
        const isTrialing = sub.status === 'trialing';
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

        await prisma.business.update({
          where: { id: businessId },
          data: {
            subscriptionTier: tier as 'PRO' | 'ENTERPRISE',
            subscriptionStatus: isTrialing ? 'TRIALING' : 'ACTIVE',
            stripeSubscriptionId: session.subscription as string,
            ...(trialEnd ? { trialEndsAt: trialEnd } : {}),
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const businessId = sub.metadata?.businessId;
      if (!businessId) break;

      const status =
        sub.status === 'active'   ? 'ACTIVE'   :
        sub.status === 'trialing' ? 'TRIALING' :
        sub.status === 'past_due' ? 'PAST_DUE' :
        'CANCELED';

      const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

      await prisma.business.update({
        where: { id: businessId },
        data: {
          subscriptionStatus: status as 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED',
          ...(trialEnd ? { trialEndsAt: trialEnd } : {}),
          // When trial ends and becomes active, clear the trialEndsAt
          ...(sub.status === 'active' && !sub.trial_end ? { trialEndsAt: null } : {}),
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const businessId = sub.metadata?.businessId;
      if (!businessId) break;

      await prisma.business.update({
        where: { id: businessId },
        data: {
          subscriptionTier: 'FREE',
          subscriptionStatus: 'CANCELED',
          stripeSubscriptionId: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
