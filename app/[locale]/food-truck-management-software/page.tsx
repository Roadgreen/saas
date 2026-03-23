import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2, ArrowRight, ChevronDown, Star, Zap, ScanLine,
  Brain, BarChart3, Smartphone, Shield, Clock, Package,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Meilleur Logiciel de Gestion Food Truck 2026'
    : 'Best Food Truck Management Software 2026 — UK & US';
  const description = isFr
    ? 'FoodTracks : le logiciel de gestion food truck le plus complet. IA prédictive, scan d\'inventaire, intégration SumUp. Réduit le gaspillage de 32%. Gratuit pour commencer.'
    : 'FoodTracks: #1 food truck management software for UK & US operators. AI demand forecasting, invoice scanning, SumUp integration. Reduces food waste by 32%, saves 2h/week on admin. Free plan, no credit card.';

  return {
    title,
    description,
    keywords: isFr
      ? ['logiciel gestion food truck', 'application gestion food truck', 'logiciel inventaire food truck', 'gestion stock food truck', 'food truck france logiciel']
      : [
          'food truck management software',
          'food truck management software UK',
          'food truck inventory app',
          'food truck management app UK',
          'food truck stock management',
          'best food truck software UK',
          'food truck inventory management',
          'food truck business software',
          'food truck app UK',
          'food truck software UK',
          'mobile food business software',
          'street food management app',
          'food truck management system',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/food-truck-management-software`,
      languages: {
        fr: `${BASE_URL}/fr/food-truck-management-software`,
        en: `${BASE_URL}/en/food-truck-management-software`,
        'en-GB': `${BASE_URL}/en/food-truck-management-software`,
        'x-default': `${BASE_URL}/en/food-truck-management-software`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/food-truck-management-software`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks food truck management software' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group" style={{ borderBottom: '1px solid #EDEBE8' }}>
      <summary className="w-full flex items-center justify-between py-6 text-left gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-orange-600 transition-colors duration-200">
          {question}
        </span>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-open:bg-orange-50 bg-gray-50 transition-all">
          <ChevronDown className="h-4 w-4 text-gray-400 group-open:text-orange-500 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <p className="pb-7 text-sm md:text-base leading-relaxed max-w-2xl text-gray-600">{answer}</p>
    </details>
  );
}

export default async function FoodTruckManagementSoftwarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FoodTracks',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: isFr ? 'Logiciel de gestion food truck' : 'Food Truck Management Software',
    operatingSystem: 'Web, Android, iOS',
    url: BASE_URL,
    description: isFr
      ? 'Logiciel de gestion de food truck tout-en-un : inventaire en temps réel, prédictions IA des ventes, scan de factures, intégration SumUp et tableau de bord rentabilité.'
      : 'All-in-one food truck management software for UK and international operators. Real-time inventory tracking, AI sales predictions, invoice scanning, SumUp integration, and profitability dashboard. Reduces food waste by 32% and saves 2 hours of admin per week.',
    inLanguage: isFr ? 'fr' : 'en',
    availableOnDevice: 'Desktop, Mobile, Tablet',
    countriesSupported: isFr ? 'FR, BE, CH' : 'GB, US, AU, IE, FR, BE, NL, DE',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        name: isFr ? 'Gratuit' : 'Free',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${locale}/pricing`,
      },
      {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'EUR',
        name: 'Pro',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${locale}/pricing`,
      },
    ],
    featureList: isFr
      ? 'Prédictions IA, Suivi de stock temps réel, Scan de factures, Intégration SumUp, Analyse des marges, Multi-emplacements, Alertes péremption, Export comptable'
      : 'AI Predictions, Real-time stock tracking, Invoice scanning, SumUp integration, Margin analytics, Multi-location, Expiry alerts, Accounting export',
    screenshot: `${BASE_URL}/dashboard-desktop.png`,
    softwareVersion: '2.0',
    datePublished: '2025-01-01',
    creator: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Logiciel Gestion Food Truck' : 'Food Truck Management Software', item: `${BASE_URL}/${locale}/food-truck-management-software` },
    ],
  };

  const faqItems = isFr
    ? [
        {
          question: 'Qu\'est-ce qu\'un logiciel de gestion food truck ?',
          answer: 'Un logiciel de gestion food truck est un outil numérique qui centralise toutes les opérations de votre activité : suivi de stock en temps réel, calcul des marges, prévisions des ventes, scan de factures et gestion des péremptions. FoodTracks est le seul conçu exclusivement pour les food trucks avec une IA spécialisée.',
        },
        {
          question: 'Comment FoodTracks réduit-il le gaspillage alimentaire de 32% ?',
          answer: 'FoodTracks analyse votre historique de ventes, la météo et les événements locaux pour prédire exactement ce dont vous aurez besoin pour chaque service. Résultat : vous commandez juste ce qu\'il faut, réduisant en moyenne le gaspillage de 32% selon les données de nos utilisateurs.',
        },
        {
          question: 'FoodTracks fonctionne-t-il avec SumUp ?',
          answer: 'Oui, FoodTracks s\'intègre nativement avec SumUp. Une fois connecté, toutes vos transactions par carte sont automatiquement synchronisées, le stock est mis à jour en temps réel et vos marges sont calculées instantanément.',
        },
        {
          question: 'Puis-je scanner mes factures fournisseurs avec FoodTracks ?',
          answer: 'Oui. Prenez une photo de votre facture fournisseur avec votre smartphone et FoodTracks extrait automatiquement les produits, quantités et prix pour mettre à jour votre stock. Vous économisez en moyenne 2 heures de saisie manuelle par semaine.',
        },
        {
          question: 'FoodTracks est-il disponible sur mobile ?',
          answer: 'Oui, FoodTracks est disponible sur iOS et Android. Gérez votre stock, consultez vos prédictions et scannez vos factures directement depuis votre téléphone, pendant ou après le service.',
        },
        {
          question: 'Combien coûte FoodTracks ?',
          answer: 'FoodTracks propose un plan gratuit permanent (1 emplacement, 50 produits, fonctionnalités de base) et un plan Pro à 29€/mois incluant les prédictions IA, emplacements illimités et l\'intégration SumUp. Aucune carte bancaire requise pour commencer.',
        },
      ]
    : [
        {
          question: 'What is food truck management software?',
          answer: 'Food truck management software is a digital tool that centralizes all your business operations: real-time stock tracking, margin calculation, sales forecasting, invoice scanning, and expiry management. FoodTracks is the only one designed exclusively for food trucks with a specialized AI engine.',
        },
        {
          question: 'How does FoodTracks reduce food waste by 32%?',
          answer: 'FoodTracks analyzes your sales history, weather data, and local events to predict exactly what you\'ll need for each service. The result: you order precisely what\'s required, reducing waste by an average of 32% according to our users\' data.',
        },
        {
          question: 'Does FoodTracks work with SumUp?',
          answer: 'Yes, FoodTracks integrates natively with SumUp. Once connected, all card transactions are automatically synced, stock is updated in real time, and your margins are calculated instantly.',
        },
        {
          question: 'Can I scan supplier invoices with FoodTracks?',
          answer: 'Yes. Take a photo of your supplier invoice with your smartphone and FoodTracks automatically extracts products, quantities, and prices to update your stock. You save an average of 2 hours of manual data entry per week.',
        },
        {
          question: 'Is FoodTracks available on mobile?',
          answer: 'Yes, FoodTracks is available on iOS and Android. Manage your stock, check your predictions, and scan invoices directly from your phone, during or after service.',
        },
        {
          question: 'How much does FoodTracks cost?',
          answer: 'FoodTracks offers a permanent free plan (1 location, 50 products, basic features) and a Pro plan at €29/month including AI predictions, unlimited locations, and SumUp integration. No credit card required to get started.',
        },
        {
          question: 'Does FoodTracks work for food trucks in the UK and US?',
          answer: 'Yes, FoodTracks is available internationally and fully supports English. The software works with any currency and payment provider. Our SumUp integration is available in all countries where SumUp operates, including the UK and US.',
        },
        {
          question: 'What makes FoodTracks better than generic restaurant software?',
          answer: 'Generic restaurant software is designed for fixed-location establishments with large kitchens and teams. FoodTracks is built specifically for mobile food businesses: it accounts for variable locations, limited storage, single-operator workflows, and the unique demand patterns of street food. Features like location-based AI predictions and SumUp integration don\'t exist in generic tools.',
        },
        {
          question: 'Is FoodTracks suitable for food trucks operating in the UK?',
          answer: 'Yes, FoodTracks is fully available in English and works across the UK. The software supports multiple currencies and integrates with SumUp, which is widely used by UK street food operators and market traders. UK food truck operators benefit from the same AI forecasting, invoice scanning, and real-time inventory features — all GDPR compliant with data stored on European servers.',
        },
        {
          question: 'Can FoodTracks help with food truck admin and record-keeping?',
          answer: 'Yes. FoodTracks significantly reduces administrative overhead — users save an average of 2 hours per week. Invoice scanning eliminates manual data entry, SumUp sync removes the need to reconcile sales, and accounting export features make VAT and bookkeeping easier. The profitability dashboard gives you a clear view of margins and costs at any time.',
        },
      ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const features = isFr
    ? [
        {
          icon: <ScanLine className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Scan de factures & inventaire',
          desc: 'Photographiez vos factures fournisseurs. Notre IA extrait les produits, quantités et prix automatiquement. Votre stock se met à jour sans saisie manuelle.',
          stat: '-2h de saisie/semaine',
        },
        {
          icon: <Brain className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Prédictions de ventes par IA',
          desc: 'Météo, événements locaux, historique par emplacement. Notre IA prédit votre demande avec 92% de précision pour que vous commandiez exactement ce qu\'il faut.',
          stat: '92% de précision',
        },
        {
          icon: <Package className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Suivi de stock en temps réel',
          desc: 'Visualisez votre stock en direct, recevez des alertes de seuil bas et de péremption. Connecté à SumUp, le stock se décrémente automatiquement à chaque vente.',
          stat: '-32% de gaspillage',
        },
        {
          icon: <BarChart3 className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Tableau de bord rentabilité',
          desc: 'Marges par produit, CA par emplacement, coût matière, évolution mensuelle. Toutes vos métriques clés en un seul écran pour prendre les bonnes décisions.',
          stat: 'KPIs en temps réel',
        },
        {
          icon: <Zap className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Intégration SumUp native',
          desc: 'Connectez votre terminal SumUp en 2 clics. Les ventes sont synchronisées automatiquement. Plus de double saisie, plus d\'erreurs, vision complète de vos recettes.',
          stat: 'Sync automatique',
        },
        {
          icon: <Smartphone className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Application mobile iOS & Android',
          desc: 'Gérez votre food truck depuis votre smartphone. Scan, stock, analytics et prédictions disponibles n\'importe où, pendant le service ou en dehors.',
          stat: 'iOS & Android',
        },
      ]
    : [
        {
          icon: <ScanLine className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Invoice & inventory scanning',
          desc: 'Photograph your supplier invoices. Our AI automatically extracts products, quantities and prices. Your stock updates without manual data entry.',
          stat: '-2h data entry/week',
        },
        {
          icon: <Brain className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'AI-powered demand forecasting',
          desc: 'Weather, local events, location history. Our AI predicts your demand with 92% accuracy so you order exactly what you need — no more waste, no more stockouts.',
          stat: '92% accuracy',
        },
        {
          icon: <Package className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Real-time stock tracking',
          desc: 'Monitor your inventory live, receive low-stock and expiry alerts. Connected to SumUp, stock decrements automatically with each sale.',
          stat: '-32% food waste',
        },
        {
          icon: <BarChart3 className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Profitability dashboard',
          desc: 'Margins per product, revenue per location, food cost, monthly trends. All your key metrics on one screen to make better decisions.',
          stat: 'Real-time KPIs',
        },
        {
          icon: <Zap className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'Native SumUp integration',
          desc: 'Connect your SumUp terminal in 2 clicks. Sales sync automatically. No more double entry, no errors, complete revenue visibility.',
          stat: 'Auto sync',
        },
        {
          icon: <Smartphone className="h-7 w-7" style={{ color: ORANGE }} />,
          title: 'iOS & Android app',
          desc: 'Manage your food truck from your smartphone. Scan, stock, analytics and predictions available anywhere, during or after service.',
          stat: 'iOS & Android',
        },
      ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        <LandingHeader />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 pt-6 pb-0" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">FoodTracks</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {isFr ? 'Logiciel de Gestion Food Truck' : 'Food Truck Management Software'}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: '#FFF3E8', color: ORANGE }}
              >
                <Star className="h-4 w-4" />
                {isFr ? 'N°1 des logiciels food truck · 2026' : '#1 food truck management software · 2026'}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
                {isFr
                  ? 'Le logiciel de gestion food truck qui prédit vos ventes et réduit votre gaspillage'
                  : 'The food truck management software that predicts your sales and cuts your waste'}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {isFr
                  ? 'FoodTracks combine gestion de stock en temps réel, scan d\'inventaire, prédictions IA et intégration SumUp dans un seul outil conçu pour les food trucks.'
                  : 'FoodTracks is the only food truck management software built exclusively for mobile food operators — UK, Europe & beyond. Real-time inventory, AI demand forecasting, invoice scanning, and native SumUp integration. Reduces food waste by 32% and saves 2 hours of admin per week.'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '-32%', label: isFr ? 'gaspillage alimentaire' : 'food waste reduction' },
                  { value: '92%', label: isFr ? 'précision prédictions' : 'prediction accuracy' },
                  { value: '-2h', label: isFr ? 'admin/semaine' : 'admin/week' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-xl" style={{ backgroundColor: '#FFF3E8' }}>
                    <div className="text-2xl font-bold" style={{ color: ORANGE }}>{stat.value}</div>
                    <div className="text-xs text-gray-600 mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/${locale}/register`}>
                  <button
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: ORANGE }}
                  >
                    {isFr ? 'Démarrer gratuitement' : 'Start for free'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link href={`/${locale}/pricing`}>
                  <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all">
                    {isFr ? 'Voir les tarifs' : 'View pricing'}
                  </button>
                </Link>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {isFr ? 'Sans carte bancaire · Sans engagement · Plan gratuit disponible' : 'No credit card · No commitment · Free plan available'}
              </p>
            </div>

            <div className="relative hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <Image
                  src="/dashboard-desktop.png"
                  alt={isFr ? 'FoodTracks tableau de bord gestion food truck' : 'FoodTracks food truck management dashboard'}
                  width={600}
                  height={420}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div
                className="absolute -bottom-4 -left-4 rounded-xl p-4 shadow-lg border border-orange-100"
                style={{ backgroundColor: '#FFFBF7' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm font-semibold text-gray-900">
                    {isFr ? 'Stock mis à jour en direct' : 'Stock updated live'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-8 border-y border-gray-100" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              {[
                { value: '100%', label: isFr ? 'conçu pour les food trucks' : 'built for food trucks' },
                { value: '€0', label: isFr ? 'pour commencer' : 'to get started' },
                { value: '32%', label: isFr ? 'réduction gaspillage' : 'waste reduction' },
                { value: '30min', label: isFr ? 'pour démarrer' : 'to get started' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isFr
                ? 'Tout ce dont votre food truck a besoin, dans une seule app'
                : 'Everything your food truck needs, in one app'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isFr
                ? 'Conçu avec des food truckers, pour des food truckers. Chaque fonctionnalité répond à vos contraintes réelles.'
                : 'Built with food truckers, for food truckers. Every feature addresses your real-world constraints.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{feature.desc}</p>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#FFF3E8', color: ORANGE }}
                >
                  {feature.stat}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {isFr ? 'Opérationnel en 30 minutes' : 'Up and running in 30 minutes'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {(isFr
                ? [
                    { step: '01', title: 'Créez votre compte', desc: 'Inscription gratuite en 2 minutes. Aucune carte bancaire.' },
                    { step: '02', title: 'Importez votre stock', desc: 'Scannez vos factures ou importez via CSV. Le stock se configure automatiquement.' },
                    { step: '03', title: 'Connectez SumUp', desc: 'Liez votre terminal SumUp. Vos ventes se synchronisent en temps réel dès le premier service.' },
                  ]
                : [
                    { step: '01', title: 'Create your account', desc: 'Free sign-up in 2 minutes. No credit card.' },
                    { step: '02', title: 'Import your inventory', desc: 'Scan your invoices or import via CSV. Stock configures automatically.' },
                    { step: '03', title: 'Connect SumUp', desc: 'Link your SumUp terminal. Sales sync in real time from your very first service.' },
                  ]
              ).map((step, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                    style={{ backgroundColor: ORANGE }}
                  >
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {isFr ? 'Tarifs simples et transparents' : 'Simple, transparent pricing'}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {isFr ? 'Commencez gratuitement, passez Pro quand vous êtes prêt.' : 'Start free, upgrade when you\'re ready.'}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{isFr ? 'Gratuit' : 'Free'}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">0€<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="space-y-3 mb-8">
                {(isFr
                  ? ['1 emplacement', '50 produits', 'Gestion de stock basique', 'Scan de factures (10/mois)', 'Application mobile']
                  : ['1 location', '50 products', 'Basic stock management', 'Invoice scanning (10/mo)', 'Mobile app']
                ).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: '#22C55E' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/register`}>
                <button className="w-full py-3 rounded-xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-gray-300 transition-all">
                  {isFr ? 'Commencer gratuitement' : 'Start for free'}
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 p-8" style={{ borderColor: ORANGE, backgroundColor: '#FFFBF7' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                <span
                  className="text-xs px-3 py-1 rounded-full font-semibold text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isFr ? 'Populaire' : 'Popular'}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-6">29€<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="space-y-3 mb-8">
                {(isFr
                  ? [
                      'Tout du plan Gratuit',
                      'Emplacements illimités',
                      'Prédictions IA des ventes',
                      'Intégration SumUp native',
                      'Scan illimité de factures',
                      'Dashboard rentabilité avancé',
                      'Export comptable',
                      'Support prioritaire',
                    ]
                  : [
                      'Everything in Free',
                      'Unlimited locations',
                      'AI sales predictions',
                      'Native SumUp integration',
                      'Unlimited invoice scanning',
                      'Advanced profitability dashboard',
                      'Accounting export',
                      'Priority support',
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: ORANGE }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/register`}>
                <button
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isFr ? 'Essayer Pro gratuitement' : 'Try Pro for free'}
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Competitive note */}
        <section className="py-8" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <p className="text-sm text-gray-600">
              {isFr
                ? 'Vous cherchez un comparatif avec d\'autres solutions ?'
                : 'Looking for a comparison with other solutions?'}
              {' '}
              <Link
                href={`/${locale}/comparatif/inpulse-vs-foodtracks`}
                className="font-semibold hover:underline"
                style={{ color: ORANGE }}
              >
                {isFr ? 'Voir FoodTracks vs Inpulse →' : 'See FoodTracks vs Inpulse →'}
              </Link>
            </p>
          </div>
        </section>

        {/* UK / International trust section — EN only */}
        {!isFr && (
          <section className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="rounded-2xl border border-orange-100 p-8" style={{ backgroundColor: '#FFFBF7' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Food truck management software for UK operators
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you run a street food stall at a London market, a burger van at a UK festival, or a mobile catering business across multiple locations, FoodTracks adapts to your workflow. Built for single-operator food trucks and small teams, it handles the unpredictability of mobile food service — variable footfall, weather-dependent demand, multi-location schedules — with tools that generic restaurant software simply doesn&apos;t offer.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Works with SumUp UK',
                    desc: 'Native integration with SumUp, the most popular card reader among UK street food traders. Connect in under 2 minutes.',
                  },
                  {
                    title: 'Saves 2h/week on admin',
                    desc: 'Scan supplier invoices with your phone — AI extracts all product data in 30 seconds. No more manual spreadsheet entry.',
                  },
                  {
                    title: 'Reduces food waste by 32%',
                    desc: 'AI forecasting predicts demand by location and weather so you prep only what you need — cutting waste and protecting margins.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
          </h2>
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="py-16 text-center"
          style={{ background: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)` }}
        >
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-white text-white" />
              ))}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {isFr
                ? 'Rejoignez les food trucks qui font confiance à FoodTracks'
                : 'Join the food trucks that trust FoodTracks'}
            </h2>
            <p className="text-orange-100 text-lg mb-8">
              {isFr
                ? 'Gérez votre stock, prédisez vos ventes, réduisez votre gaspillage. Gratuit pour commencer.'
                : 'Manage your stock, predict your sales, reduce your waste. Free to start.'}
            </p>
            <Link href={`/${locale}/register`}>
              <button className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-orange-600 bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-lg">
                {isFr ? 'Créer mon compte gratuit' : 'Create my free account'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <p className="text-orange-100 text-sm mt-4">
              {isFr
                ? 'Sans carte bancaire · Opérationnel en 30 minutes'
                : 'No credit card · Operational in 30 minutes'}
            </p>

            {/* Internal links */}
            <div className="mt-10 pt-8 border-t border-orange-400 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/blog/comment-gerer-stock-food-truck`}
                className="text-sm text-orange-100 hover:text-white hover:underline transition-colors"
              >
                {isFr ? 'Guide gestion de stock →' : 'Inventory management guide →'}
              </Link>
              <Link
                href={`/${locale}/blog/reduire-gaspillage-alimentaire-food-truck`}
                className="text-sm text-orange-100 hover:text-white hover:underline transition-colors"
              >
                {isFr ? 'Réduire le gaspillage →' : 'Reduce food waste →'}
              </Link>
              <Link
                href={`/${locale}/blog/prediction-vente-food-truck-ia`}
                className="text-sm text-orange-100 hover:text-white hover:underline transition-colors"
              >
                {isFr ? 'Prédictions IA food truck →' : 'AI sales predictions →'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
