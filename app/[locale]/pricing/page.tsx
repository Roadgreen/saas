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
    alternates: {
      canonical: `${BASE_URL}/${locale}/pricing`,
      languages: { fr: `${BASE_URL}/fr/pricing`, en: `${BASE_URL}/en/pricing` },
    },
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
  const isFr = locale === 'fr';

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Tarifs' : 'Pricing', item: `${BASE_URL}/${locale}/pricing` },
    ],
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'FoodTracks',
    description: isFr
      ? 'Logiciel de gestion de stock et de pilotage pour food trucks et restaurants.'
      : 'Inventory management and analytics software for food trucks and restaurants.',
    brand: { '@type': 'Brand', name: 'FoodTracks' },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${locale}/pricing`,
        description: isFr ? '1 emplacement, fonctionnalités de base' : '1 location, basic features',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '29',
        priceCurrency: 'EUR',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${locale}/pricing`,
        description: isFr ? 'Emplacements illimités, IA, analyses avancées' : 'Unlimited locations, AI, advanced analytics',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      {/* Breadcrumb */}
      <nav className="container mx-auto px-8 pt-6 pb-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><a href={`/${locale}`} className="hover:text-gray-700 transition-colors">FoodTracks</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{isFr ? 'Tarifs' : 'Pricing'}</li>
        </ol>
      </nav>
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
    </>
  );
}
