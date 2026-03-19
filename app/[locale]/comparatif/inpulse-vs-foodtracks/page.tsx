import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ChevronDown, ArrowRight, Star, Zap, ShoppingCart, Brain, ChefHat } from 'lucide-react';
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
    ? 'FoodTracks vs Inpulse 2026 : Comparatif Complet pour Food Trucks'
    : 'FoodTracks vs Inpulse 2026: Complete Food Truck Software Comparison';
  const description = isFr
    ? 'Comparatif détaillé FoodTracks vs Inpulse : prix, fonctionnalités IA, intégration SumUp, facilité d\'utilisation. Découvrez lequel est fait pour votre food truck en 2026.'
    : 'Detailed FoodTracks vs Inpulse comparison: pricing, AI features, SumUp integration, ease of use. Find out which is best for your food truck in 2026.';

  return {
    title,
    description,
    keywords: isFr
      ? ['foodtracks vs inpulse', 'comparatif logiciel food truck', 'alternative inpulse food truck', 'meilleur logiciel gestion food truck 2026', 'inpulse concurrent foodtracks']
      : ['foodtracks vs inpulse', 'food truck software comparison', 'inpulse alternative food truck', 'best food truck management software 2026'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/comparatif/inpulse-vs-foodtracks`,
      languages: {
        fr: `${BASE_URL}/fr/comparatif/inpulse-vs-foodtracks`,
        en: `${BASE_URL}/en/comparatif/inpulse-vs-foodtracks`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/comparatif/inpulse-vs-foodtracks`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks vs Inpulse comparison' }],
      type: 'article',
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

export default async function ComparatifInpulsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Comparatifs' : 'Comparisons', item: `${BASE_URL}/${locale}/comparatif` },
      { '@type': 'ListItem', position: 3, name: 'FoodTracks vs Inpulse', item: `${BASE_URL}/${locale}/comparatif/inpulse-vs-foodtracks` },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'FoodTracks vs Inpulse 2026 : Comparatif Complet pour Food Trucks'
      : 'FoodTracks vs Inpulse 2026: Complete Food Truck Software Comparison',
    description: isFr
      ? 'Comparatif détaillé FoodTracks vs Inpulse : prix, fonctionnalités, intégrations et facilité d\'utilisation.'
      : 'Detailed FoodTracks vs Inpulse comparison: pricing, features, integrations and ease of use.',
    datePublished: '2026-01-01',
    dateModified: '2026-03-01',
    author: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/comparatif/inpulse-vs-foodtracks` },
  };

  const faqItems = isFr
    ? [
        {
          question: 'FoodTracks ou Inpulse : lequel est moins cher ?',
          answer: 'FoodTracks est significativement moins cher qu\'Inpulse. FoodTracks propose un plan gratuit permanent et un plan Pro à 29€/mois. Inpulse facture à partir de 79€/mois sans plan gratuit disponible, ce qui représente une économie de plus de 600€/an pour un food tracker indépendant.',
        },
        {
          question: 'FoodTracks intègre-t-il SumUp contrairement à Inpulse ?',
          answer: 'Oui, FoodTracks propose une intégration native avec SumUp, le terminal de paiement le plus utilisé par les food truckers en France. Cette connexion synchronise automatiquement toutes les transactions et met à jour le stock en temps réel. Inpulse ne propose pas d\'intégration SumUp native.',
        },
        {
          question: 'Inpulse est-il adapté aux food trucks ?',
          answer: 'Inpulse est une solution de gestion des approvisionnements conçue principalement pour les restaurants traditionnels avec équipe cuisine. Pour les food trucks — qui ont des contraintes spécifiques (espace limité, mobilité, emplacements variables) — FoodTracks est bien mieux adapté car il a été conçu exclusivement pour ce modèle.',
        },
        {
          question: 'FoodTracks prédit-il les ventes mieux qu\'Inpulse ?',
          answer: 'FoodTracks utilise un moteur d\'IA spécialisé food truck qui intègre l\'historique de ventes, la météo, le type d\'emplacement et les événements locaux pour prédire la demande avec 92% de précision. Inpulse se concentre davantage sur la gestion des commandes fournisseurs que sur les prédictions de vente.',
        },
        {
          question: 'Puis-je migrer de Inpulse vers FoodTracks facilement ?',
          answer: 'Oui, la migration est simple. FoodTracks importe vos données via fichier CSV ou via scan de vos factures fournisseurs existantes. L\'onboarding guidé permet d\'être opérationnel en moins de 30 minutes. Notre équipe support vous accompagne gratuitement dans la migration.',
        },
        {
          question: 'FoodTracks fonctionne-t-il sur mobile ?',
          answer: 'Oui, FoodTracks est disponible sur iOS et Android via une application native, ainsi qu\'en version web responsive. Vous pouvez scanner des factures, consulter votre stock et voir vos prédictions depuis votre téléphone pendant le service.',
        },
      ]
    : [
        {
          question: 'FoodTracks or Inpulse: which is cheaper?',
          answer: 'FoodTracks is significantly cheaper than Inpulse. FoodTracks offers a permanent free plan and a Pro plan at €29/month. Inpulse charges from €79/month with no free plan, saving independent food truckers over €600/year.',
        },
        {
          question: 'Does FoodTracks integrate with SumUp unlike Inpulse?',
          answer: 'Yes, FoodTracks offers a native integration with SumUp, the most widely used payment terminal among food truckers in Europe. This connection automatically syncs all transactions and updates stock in real time. Inpulse does not offer native SumUp integration.',
        },
        {
          question: 'Is Inpulse suitable for food trucks?',
          answer: 'Inpulse is a procurement management solution primarily designed for traditional restaurants with kitchen teams. For food trucks — with their specific constraints (limited space, mobility, variable locations) — FoodTracks is much better suited as it was designed exclusively for this model.',
        },
        {
          question: 'Does FoodTracks predict sales better than Inpulse?',
          answer: 'FoodTracks uses a food truck-specialized AI engine that combines sales history, weather data, location type, and local events to predict demand with 92% accuracy. Inpulse focuses more on supplier order management than sales predictions.',
        },
        {
          question: 'Can I migrate from Inpulse to FoodTracks easily?',
          answer: 'Yes, migration is straightforward. FoodTracks imports your data via CSV file or by scanning your existing supplier invoices. The guided onboarding gets you operational in under 30 minutes. Our support team helps with migration at no extra cost.',
        },
        {
          question: 'Does FoodTracks work on mobile?',
          answer: 'Yes, FoodTracks is available on iOS and Android via a native app, as well as a responsive web version. You can scan invoices, check stock levels, and view your predictions from your phone during service.',
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

  const comparisonRows = isFr
    ? [
        { feature: 'Plan gratuit', foodtracks: true, inpulse: false },
        { feature: 'Prix de départ', foodtracks: '0€/mois', inpulse: '79€/mois', highlight: true },
        { feature: 'Prédictions IA des ventes', foodtracks: true, inpulse: false },
        { feature: 'Intégration SumUp native', foodtracks: true, inpulse: false, highlight: true },
        { feature: 'Scan de factures fournisseurs', foodtracks: true, inpulse: true },
        { feature: 'Conçu pour food trucks', foodtracks: true, inpulse: false, highlight: true },
        { feature: 'Application mobile iOS/Android', foodtracks: true, inpulse: true },
        { feature: 'Alertes péremption', foodtracks: true, inpulse: true },
        { feature: 'Prédictions par emplacement', foodtracks: true, inpulse: false },
        { feature: 'Prédictions météo intégrées', foodtracks: true, inpulse: false },
        { feature: 'Gestion multi-emplacements', foodtracks: true, inpulse: true },
        { feature: 'Dashboard rentabilité', foodtracks: true, inpulse: false },
        { feature: 'Export comptable', foodtracks: true, inpulse: true },
        { feature: 'Support en français', foodtracks: true, inpulse: true },
        { feature: 'RGPD / Données en Europe', foodtracks: true, inpulse: true },
        { feature: 'Onboarding en < 30 minutes', foodtracks: true, inpulse: false },
      ]
    : [
        { feature: 'Free plan', foodtracks: true, inpulse: false },
        { feature: 'Starting price', foodtracks: '€0/month', inpulse: '€79/month', highlight: true },
        { feature: 'AI sales predictions', foodtracks: true, inpulse: false },
        { feature: 'Native SumUp integration', foodtracks: true, inpulse: false, highlight: true },
        { feature: 'Supplier invoice scanning', foodtracks: true, inpulse: true },
        { feature: 'Built for food trucks', foodtracks: true, inpulse: false, highlight: true },
        { feature: 'iOS/Android mobile app', foodtracks: true, inpulse: true },
        { feature: 'Expiry alerts', foodtracks: true, inpulse: true },
        { feature: 'Predictions by location', foodtracks: true, inpulse: false },
        { feature: 'Weather-integrated forecasting', foodtracks: true, inpulse: false },
        { feature: 'Multi-location management', foodtracks: true, inpulse: true },
        { feature: 'Profitability dashboard', foodtracks: true, inpulse: false },
        { feature: 'Accounting export', foodtracks: true, inpulse: true },
        { feature: 'English support', foodtracks: true, inpulse: true },
        { feature: 'GDPR / European data', foodtracks: true, inpulse: true },
        { feature: 'Onboarding in < 30 minutes', foodtracks: true, inpulse: false },
      ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        <LandingHeader />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 pt-6 pb-0" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li><Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">FoodTracks</Link></li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/comparatif`} className="hover:text-gray-700 transition-colors">
                {isFr ? 'Comparatifs' : 'Comparisons'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">FoodTracks vs Inpulse</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: '#FFF3E8', color: ORANGE }}
          >
            <Star className="h-4 w-4" />
            {isFr ? 'Comparatif 2026 · Mis à jour mars 2026' : '2026 Comparison · Updated March 2026'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
            {isFr
              ? 'FoodTracks vs Inpulse — lequel choisir pour votre food truck ?'
              : 'FoodTracks vs Inpulse — which should you choose for your food truck?'}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            {isFr
              ? 'Deux logiciels, des approches radicalement différentes. On compare prix, fonctionnalités et adéquation avec le métier de food trucker pour vous aider à faire le bon choix.'
              : 'Two software solutions, radically different approaches. We compare pricing, features, and fit for the food truck business to help you make the right choice.'}
          </p>

          {/* Quick verdict */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            <div className="p-5 rounded-2xl text-left border-2" style={{ borderColor: ORANGE, backgroundColor: '#FFF8F5' }}>
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="h-5 w-5" style={{ color: ORANGE }} />
                <span className="font-bold text-gray-900">FoodTracks</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white ml-auto" style={{ backgroundColor: ORANGE }}>
                  {isFr ? 'Recommandé' : 'Recommended'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {isFr
                  ? 'Conçu pour les food trucks. IA prédictive, SumUp natif, prix accessible.'
                  : 'Built for food trucks. Predictive AI, native SumUp, affordable price.'}
              </p>
              <p className="text-lg font-bold mt-2" style={{ color: ORANGE }}>0€ → 29€/mois</p>
            </div>
            <div className="p-5 rounded-2xl text-left border border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-900">Inpulse</span>
              </div>
              <p className="text-sm text-gray-600">
                {isFr
                  ? 'Solution pour restaurants. Pas d\'IA prédictive, pas de SumUp, prix élevé.'
                  : 'Restaurant-focused solution. No predictive AI, no SumUp, high price.'}
              </p>
              <p className="text-lg font-bold mt-2 text-gray-500">~79€+/mois</p>
            </div>
          </div>

          <Link href={`/${locale}/register`}>
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: ORANGE }}
            >
              {isFr ? 'Essayer FoodTracks gratuitement' : 'Try FoodTracks for free'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <p className="text-sm text-gray-400 mt-3">
            {isFr ? 'Sans carte bancaire · Sans engagement' : 'No credit card · No commitment'}
          </p>
        </section>

        {/* Comparison Table */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {isFr ? 'Tableau comparatif complet' : 'Full comparison table'}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8F6F3' }}>
                  <th className="text-left px-6 py-5 text-sm font-semibold text-gray-700 w-1/2">
                    {isFr ? 'Fonctionnalité' : 'Feature'}
                  </th>
                  <th className="text-center px-6 py-5 text-sm font-bold w-1/4" style={{ color: ORANGE }}>
                    FoodTracks
                  </th>
                  <th className="text-center px-6 py-5 text-sm font-semibold text-gray-500 w-1/4">
                    Inpulse
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100"
                    style={row.highlight ? { backgroundColor: '#FFFBF7' } : { backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {row.highlight && <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ backgroundColor: ORANGE }} />}
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.foodtracks === 'boolean' ? (
                        row.foodtracks
                          ? <CheckCircle2 className="h-5 w-5 mx-auto" style={{ color: '#22C55E' }} />
                          : <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: ORANGE }}>{row.foodtracks}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.inpulse === 'boolean' ? (
                        row.inpulse
                          ? <CheckCircle2 className="h-5 w-5 mx-auto text-gray-400" />
                          : <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{row.inpulse}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why FoodTracks wins */}
        <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {isFr
                ? 'Pourquoi FoodTracks est le meilleur choix pour votre food truck'
                : 'Why FoodTracks is the best choice for your food truck'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(isFr
                ? [
                    {
                      icon: <Zap className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'IA prédictive spécialisée food truck',
                      desc: 'Notre moteur d\'IA intègre la météo, les événements locaux et l\'historique par emplacement pour prévoir vos ventes à 92% de précision. Commandez exactement ce dont vous avez besoin.',
                    },
                    {
                      icon: <ShoppingCart className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Intégration SumUp native',
                      desc: 'Connectez votre terminal SumUp en 2 clics. Toutes vos ventes sont automatiquement synchronisées et le stock se met à jour en temps réel. Inpulse ne propose pas cette intégration.',
                    },
                    {
                      icon: <Brain className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Prix accessible dès 0€',
                      desc: 'FoodTracks propose un plan gratuit sans limite de temps. Le plan Pro à 29€/mois est 2,7x moins cher que le tarif de départ d\'Inpulse. Économisez plus de 600€ par an.',
                    },
                    {
                      icon: <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Conçu exclusivement pour les food trucks',
                      desc: 'FoodTracks a été construit avec des food truckers, pour des food truckers. Chaque fonctionnalité répond à vos contraintes réelles : mobilité, espace limité, emplacements variables.',
                    },
                  ]
                : [
                    {
                      icon: <Zap className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Food truck-specialized predictive AI',
                      desc: 'Our AI engine combines weather data, local events, and location history to forecast your sales with 92% accuracy. Order exactly what you need — no more, no less.',
                    },
                    {
                      icon: <ShoppingCart className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Native SumUp integration',
                      desc: 'Connect your SumUp terminal in 2 clicks. All sales are automatically synced and stock updates in real time. Inpulse does not offer this integration.',
                    },
                    {
                      icon: <Brain className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Affordable from €0',
                      desc: 'FoodTracks offers a permanent free plan. The Pro plan at €29/month is 2.7x cheaper than Inpulse\'s entry price. Save over €600 per year.',
                    },
                    {
                      icon: <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Built exclusively for food trucks',
                      desc: 'FoodTracks was built with food truckers, for food truckers. Every feature addresses your real constraints: mobility, limited space, variable locations.',
                    },
                  ]
              ).map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    {card.icon}
                    <h3 className="font-bold text-gray-900">{card.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing comparison */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {isFr ? 'Comparaison des prix' : 'Pricing comparison'}
          </h2>
          <p className="text-center text-gray-600 mb-10">
            {isFr
              ? 'Une différence de plus de 600€/an — avec plus de fonctionnalités chez FoodTracks'
              : 'Over €600/year difference — with more features at FoodTracks'}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* FoodTracks */}
            <div className="rounded-2xl border-2 p-8" style={{ borderColor: ORANGE, backgroundColor: '#FFFBF7' }}>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
                <h3 className="text-xl font-bold text-gray-900">FoodTracks</h3>
                <span
                  className="ml-auto text-xs px-3 py-1 rounded-full font-semibold text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isFr ? 'Recommandé' : 'Recommended'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-sm text-gray-700">{isFr ? 'Plan Gratuit' : 'Free Plan'}</span>
                  <span className="font-bold" style={{ color: ORANGE }}>0€/mois</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-sm text-gray-700">{isFr ? 'Plan Pro (IA + SumUp)' : 'Pro Plan (AI + SumUp)'}</span>
                  <span className="font-bold" style={{ color: ORANGE }}>29€/mois</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">{isFr ? 'Coût annuel (Pro)' : 'Annual cost (Pro)'}</span>
                  <span className="font-bold text-gray-900">348€/an</span>
                </div>
              </div>
              <Link href={`/${locale}/register`}>
                <button
                  className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isFr ? 'Commencer gratuitement' : 'Start for free'}
                </button>
              </Link>
            </div>

            {/* Inpulse */}
            <div className="rounded-2xl border border-gray-200 p-8 bg-white">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Inpulse</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{isFr ? 'Plan Gratuit' : 'Free Plan'}</span>
                  <span className="text-sm font-medium text-red-500">
                    {isFr ? 'Non disponible' : 'Not available'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{isFr ? 'Plan de départ' : 'Starting plan'}</span>
                  <span className="font-bold text-gray-700">~79€/mois</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">{isFr ? 'Coût annuel estimé' : 'Estimated annual cost'}</span>
                  <span className="font-bold text-gray-700">~948€/an</span>
                </div>
              </div>
              <div className="mt-6 py-3 rounded-xl text-center text-sm text-gray-400 border border-gray-200">
                {isFr ? '600€/an de plus que FoodTracks Pro' : '€600/year more than FoodTracks Pro'}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
            </h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
              {faqItems.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isFr
              ? 'Prêt à passer à FoodTracks ?'
              : 'Ready to switch to FoodTracks?'}
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {isFr
              ? 'Rejoignez des centaines de food truckers qui ont choisi la solution la mieux adaptée à leur métier — sans carte bancaire, sans engagement.'
              : 'Join hundreds of food truckers who chose the solution built for their business — no credit card, no commitment.'}
          </p>
          <Link href={`/${locale}/register`}>
            <button
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: ORANGE }}
            >
              {isFr ? 'Créer mon compte gratuit' : 'Create my free account'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            {isFr
              ? 'Sans carte bancaire · Opérationnel en 30 minutes · Support humain inclus'
              : 'No credit card · Operational in 30 minutes · Human support included'}
          </p>

          {/* Internal links */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {isFr ? 'Articles liés' : 'Related articles'}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/blog/logiciel-gestion-food-truck`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Quel logiciel de gestion choisir pour son food truck en 2026 ?'
                    : '→ Best food truck management software in 2026'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog/prediction-vente-food-truck-ia`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Comment l\'IA prédit vos ventes de food truck'
                    : '→ How AI predicts your food truck sales'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog/connecter-sumup-food-truck-suivi-ventes`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Connecter SumUp à votre food truck pour le suivi des ventes'
                    : '→ Connect SumUp to your food truck for sales tracking'}
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
