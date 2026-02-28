import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { LandingHeader } from '@/components/landing/Header';
import { CheckoutButton } from '@/components/pricing/CheckoutButton';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Tarifs' : 'Pricing';
  const description = isFr
    ? 'Découvrez les plans FoodTracks : gratuit, Pro à 29€/mois et Entreprise. Gestion des stocks restaurant sans engagement.'
    : 'Explore FoodTracks plans: Free, Pro at €29/mo, and Enterprise. Restaurant inventory management with no commitment.';
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${locale}/pricing` },
    openGraph: {
      title: `${title} | FoodTracks`,
      description,
      url: `${BASE_URL}/${locale}/pricing`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: `${title} | FoodTracks`, description },
  };
}

export default async function PricingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Pricing');
  const session = await auth();

  let currentTier = 'FREE';

  if (session?.user?.email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
      });
      if (user?.business) {
        currentTier = user.business.subscriptionTier;
      }
    } catch {
      // DB unavailable, default to FREE
    }
  }

  const plans = [
    { key: 'free',       tier: 'FREE',       variant: 'outline'  as const },
    { key: 'pro',        tier: 'PRO',        variant: 'default'  as const },
    { key: 'enterprise', tier: 'ENTERPRISE', variant: 'outline'  as const },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <Card key={plan.key} className={`flex flex-col h-full ${plan.tier === currentTier ? 'border-primary border-2' : ''}`}>
              <CardHeader>
                {plan.key === 'pro' && (
                  <Badge variant="default" className="w-fit mb-2">{t('popular')}</Badge>
                )}
                <CardTitle>{t(`${plan.key}.title`)}</CardTitle>
                <CardDescription>{t(`${plan.key}.description`)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-4xl font-bold mb-4">{t(`${plan.key}.price`)}</div>
                <ul className="space-y-2">
                  {(t.raw(`${plan.key}.features`) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.tier === 'FREE' ? (
                  <CheckoutButton
                    tier="FREE"
                    label={plan.tier === currentTier ? t('currentPlan') : t('subscribe')}
                    variant="outline"
                    isCurrentPlan={plan.tier === currentTier}
                    currentPlanLabel={t('currentPlan')}
                    disabled
                  />
                ) : plan.tier === 'ENTERPRISE' ? (
                  <CheckoutButton
                    tier="ENTERPRISE"
                    label={plan.tier === currentTier ? t('currentPlan') : t('contact')}
                    variant="outline"
                    isCurrentPlan={plan.tier === currentTier}
                    currentPlanLabel={t('currentPlan')}
                  />
                ) : (
                  <CheckoutButton
                    tier="PRO"
                    label={plan.tier === currentTier ? t('currentPlan') : t('subscribe')}
                    variant="default"
                    isCurrentPlan={plan.tier === currentTier}
                    currentPlanLabel={t('currentPlan')}
                  />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
