import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Comment ça marche — Gestion de commerce alimentaire en 4 étapes simples'
    : 'How It Works — Food Business Management in 4 Simple Steps';
  const description = isFr
    ? 'Découvrez comment FoodTracks simplifie la gestion de votre boulangerie, food truck, snack, glacier, café ou marché : scan de factures, suivi de stock en temps réel, prévisions IA et optimisation des marges. Démarrez gratuitement.'
    : 'Discover how FoodTracks simplifies management for bakeries, food trucks, snack bars, ice cream shops, cafés and market stalls: invoice scanning, real-time stock tracking, AI forecasts and margin optimisation. Start for free.';

  return {
    title,
    description,
    keywords: isFr
      ? ['comment gérer food truck', 'gestion boulangerie logiciel', 'logiciel commerce alimentaire fonctionnement', 'suivi stock snack glacier café', 'prévisions IA restauration', 'application gestion commerce gratuite', 'logiciel food truck', 'gestion marchand de marché']
      : ['how to manage food truck', 'bakery management software', 'food business management steps', 'stock tracking snack café ice cream shop', 'AI predictions restaurant', 'free food business app', 'food truck management software', 'market stall management'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/comment-ca-marche`,
      languages: { fr: `${BASE_URL}/fr/comment-ca-marche`, en: `${BASE_URL}/en/comment-ca-marche` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/comment-ca-marche`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CommentCaMarcheLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('HowItWorks');
  const isFr = locale === 'fr';

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('hero.title'),
    description: t('hero.subtitle'),
    totalTime: 'PT10M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: '0',
    },
    tool: [
      { '@type': 'HowToTool', name: 'FoodTracks App' },
      { '@type': 'HowToTool', name: isFr ? 'Smartphone ou ordinateur' : 'Smartphone or computer' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: t('step1.title'),
        text: t('step1.desc'),
        url: `${BASE_URL}/${locale}/comment-ca-marche#step-1`,
        image: `${BASE_URL}/dashboardfr.jpg`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: t('step2.title'),
        text: t('step2.desc'),
        url: `${BASE_URL}/${locale}/comment-ca-marche#step-2`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: t('step3.title'),
        text: t('step3.desc'),
        url: `${BASE_URL}/${locale}/comment-ca-marche#step-3`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: t('step4.title'),
        text: t('step4.desc'),
        url: `${BASE_URL}/${locale}/comment-ca-marche#step-4`,
      },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Comment ça marche' : 'How it works', item: `${BASE_URL}/${locale}/comment-ca-marche` },
    ],
  };

  const localBusinessServiceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isFr ? 'Gestion de commerce alimentaire FoodTracks' : 'FoodTracks Food Business Management',
    description: isFr
      ? 'Service de gestion de stock et de pilotage pour boulangers, food trucks, snacks, glaciers, cafés et marchés. Prévisions IA, suivi en temps réel, scan de factures.'
      : 'Inventory management and operations service for bakeries, food trucks, snack bars, ice cream shops, cafés and market stalls. AI forecasts, real-time tracking, invoice scanning.',
    provider: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
    },
    serviceType: isFr ? 'Logiciel de gestion commerce alimentaire' : 'Food business management software',
    areaServed: [
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Canada' },
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: isFr ? 'Plan gratuit disponible' : 'Free plan available',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessServiceJsonLd) }} />
      {children}
    </>
  );
}
