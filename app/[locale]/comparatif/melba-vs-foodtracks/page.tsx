import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ChevronDown, ArrowRight, Star, Zap, ShoppingCart, Brain, ChefHat, Globe } from 'lucide-react';
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
    ? 'FoodTracks vs Melba 2026 : Comparatif Complet pour Food Trucks'
    : 'FoodTracks vs Melba 2026: Complete Food Truck Software Comparison';
  const description = isFr
    ? 'Comparatif détaillé FoodTracks vs Melba : prix, prédictions IA, intégration SumUp, spécialisation food truck. Melba ~79€/mois vs FoodTracks gratuit. Quel outil choisir en 2026 ?'
    : 'Detailed FoodTracks vs Melba comparison: pricing, AI predictions, SumUp integration, food truck specialisation. Melba ~€79/month vs FoodTracks free. Which to choose in 2026?';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'foodtracks vs melba',
          'alternative melba food truck',
          'comparatif logiciel food truck 2026',
          'melba concurrent foodtracks',
          'logiciel gestion food truck moins cher que melba',
          'meilleur logiciel food truck france',
          'melba restaurant food truck',
        ]
      : [
          'foodtracks vs melba',
          'melba alternative food truck',
          'food truck software comparison 2026',
          'melba competitor foodtracks',
          'cheaper food truck software than melba',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/comparatif/melba-vs-foodtracks`,
      languages: {
        fr: `${BASE_URL}/fr/comparatif/melba-vs-foodtracks`,
        en: `${BASE_URL}/en/comparatif/melba-vs-foodtracks`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/comparatif/melba-vs-foodtracks`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks vs Melba comparison' }],
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

export default async function ComparatifMelbaPage({
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
      { '@type': 'ListItem', position: 3, name: 'FoodTracks vs Melba', item: `${BASE_URL}/${locale}/comparatif/melba-vs-foodtracks` },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'FoodTracks vs Melba 2026 : Comparatif Complet pour Food Trucks'
      : 'FoodTracks vs Melba 2026: Complete Food Truck Software Comparison',
    description: isFr
      ? 'Comparatif détaillé FoodTracks vs Melba : prix, fonctionnalités, intégrations et spécialisation food truck.'
      : 'Detailed FoodTracks vs Melba comparison: pricing, features, integrations and food truck specialisation.',
    datePublished: '2026-03-20',
    dateModified: '2026-03-20',
    author: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/comparatif/melba-vs-foodtracks` },
  };

  const faqItems = isFr
    ? [
        {
          question: 'FoodTracks ou Melba : lequel est moins cher ?',
          answer: 'FoodTracks est nettement moins cher que Melba. FoodTracks propose un plan gratuit permanent et un plan Pro à 29€/mois. Melba facture à partir de 79€/mois pour un établissement, sans plan gratuit disponible — soit une économie de plus de 600€/an pour un food trucker indépendant.',
        },
        {
          question: 'Melba est-il adapté aux food trucks ?',
          answer: 'Melba est un logiciel conçu pour les restaurants traditionnels avec cuisine fixe, brigade et fiche technique. Il est performant pour les établissements sédentaires mais ne prend pas en compte les contraintes spécifiques des food trucks : mobilité, emplacements variables, variations de fréquentation liées à la météo ou aux événements. FoodTracks est la seule solution construite exclusivement pour ce modèle.',
        },
        {
          question: 'FoodTracks intègre-t-il SumUp contrairement à Melba ?',
          answer: 'Oui. FoodTracks s\'intègre nativement avec SumUp, le terminal de paiement le plus utilisé par les food truckers en France. Vos ventes sont synchronisées automatiquement et le stock se met à jour en temps réel après chaque transaction. Melba propose des intégrations caisse mais pas de connexion native avec SumUp spécifiquement conçue pour les food trucks mobiles.',
        },
        {
          question: 'FoodTracks prédit-il les ventes mieux que Melba ?',
          answer: 'Oui. FoodTracks utilise un moteur d\'IA spécialisé qui intègre votre historique de ventes, la météo en temps réel, le type d\'emplacement et les événements locaux pour prédire votre demande à 92% de précision. Melba propose des outils de suivi des coûts et de la production, mais pas de prédictions de vente contextualisées pour un food truck itinérant.',
        },
        {
          question: 'Puis-je migrer de Melba vers FoodTracks facilement ?',
          answer: 'Oui, la migration est simple. FoodTracks peut importer vos produits et historiques via CSV, ou reconstruire votre catalogue en scannant vos factures fournisseurs. L\'onboarding guidé vous rend opérationnel en moins de 30 minutes, avec un accompagnement humain gratuit inclus.',
        },
        {
          question: 'Melba ou FoodTracks : lequel choisir pour débuter en food truck ?',
          answer: 'Pour débuter en food truck, FoodTracks est le choix évident : plan gratuit, onboarding en 30 minutes, et fonctionnalités pensées pour votre quotidien de mobile. Melba est une solution robuste pour les restaurateurs sédentaires avec équipe cuisine, mais son coût et sa courbe d\'apprentissage ne sont pas adaptés à un démarrage en food truck.',
        },
      ]
    : [
        {
          question: 'FoodTracks or Melba: which is cheaper?',
          answer: 'FoodTracks is significantly cheaper than Melba. FoodTracks offers a permanent free plan and a Pro plan at €29/month. Melba starts at around €79/month per venue with no free plan — saving independent food truckers over €600 per year.',
        },
        {
          question: 'Is Melba suitable for food trucks?',
          answer: 'Melba is designed for traditional restaurants with fixed kitchens, kitchen brigades, and detailed recipe costings. It is powerful for sedentary establishments but does not account for food truck-specific constraints: mobility, variable locations, and fluctuations driven by weather or local events. FoodTracks is the only solution built exclusively for this model.',
        },
        {
          question: 'Does FoodTracks integrate with SumUp unlike Melba?',
          answer: 'Yes. FoodTracks natively integrates with SumUp, the most widely used payment terminal by food truckers in France. Your sales are automatically synced and stock updates in real time after every transaction. Melba has POS integrations but no native SumUp connection built specifically for mobile food trucks.',
        },
        {
          question: 'Does FoodTracks predict sales better than Melba?',
          answer: 'Yes. FoodTracks uses a specialised AI engine that combines your sales history, real-time weather, location type, and local events to forecast demand with 92% accuracy. Melba offers cost and production tracking tools, but not contextualised sales predictions for an itinerant food truck.',
        },
        {
          question: 'Can I migrate from Melba to FoodTracks easily?',
          answer: 'Yes. FoodTracks can import your products and history via CSV, or rebuild your catalogue by scanning your supplier invoices. The guided onboarding gets you operational in under 30 minutes, with free human support included.',
        },
        {
          question: 'Melba or FoodTracks: which to choose for starting a food truck?',
          answer: 'For starting a food truck, FoodTracks is the obvious choice: free plan, 30-minute onboarding, and features built for your mobile daily life. Melba is a robust solution for sedentary restaurateurs with kitchen teams, but its cost and learning curve are not suited to launching a food truck.',
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
        { feature: 'Plan gratuit', foodtracks: true, melba: false },
        { feature: 'Prix de départ', foodtracks: '0€/mois', melba: '~79€/mois', highlight: true },
        { feature: 'Prédictions IA des ventes', foodtracks: true, melba: false },
        { feature: 'Intégration SumUp native', foodtracks: true, melba: false, highlight: true },
        { feature: 'Conçu pour food trucks', foodtracks: true, melba: false, highlight: true },
        { feature: 'Prédictions météo intégrées', foodtracks: true, melba: false },
        { feature: 'Prédictions par emplacement', foodtracks: true, melba: false },
        { feature: 'Scan de factures fournisseurs', foodtracks: true, melba: true },
        { feature: 'Gestion des fiches techniques', foodtracks: true, melba: true },
        { feature: 'Application mobile iOS/Android', foodtracks: true, melba: true },
        { feature: 'Alertes péremption', foodtracks: true, melba: true },
        { feature: 'Gestion multi-emplacements', foodtracks: true, melba: false },
        { feature: 'Dashboard rentabilité', foodtracks: true, melba: true },
        { feature: 'Export comptable', foodtracks: true, melba: true },
        { feature: 'Support en français', foodtracks: true, melba: true },
        { feature: 'RGPD / Données en Europe', foodtracks: true, melba: true },
        { feature: 'Onboarding en < 30 minutes', foodtracks: true, melba: false },
      ]
    : [
        { feature: 'Free plan', foodtracks: true, melba: false },
        { feature: 'Starting price', foodtracks: '€0/month', melba: '~€79/month', highlight: true },
        { feature: 'AI sales predictions', foodtracks: true, melba: false },
        { feature: 'Native SumUp integration', foodtracks: true, melba: false, highlight: true },
        { feature: 'Built for food trucks', foodtracks: true, melba: false, highlight: true },
        { feature: 'Weather-integrated forecasting', foodtracks: true, melba: false },
        { feature: 'Predictions by location', foodtracks: true, melba: false },
        { feature: 'Supplier invoice scanning', foodtracks: true, melba: true },
        { feature: 'Recipe cost management', foodtracks: true, melba: true },
        { feature: 'iOS/Android mobile app', foodtracks: true, melba: true },
        { feature: 'Expiry alerts', foodtracks: true, melba: true },
        { feature: 'Multi-location management', foodtracks: true, melba: false },
        { feature: 'Profitability dashboard', foodtracks: true, melba: true },
        { feature: 'Accounting export', foodtracks: true, melba: true },
        { feature: 'French support', foodtracks: true, melba: true },
        { feature: 'GDPR / European data', foodtracks: true, melba: true },
        { feature: 'Onboarding in < 30 minutes', foodtracks: true, melba: false },
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
            <li className="text-gray-900 font-medium">FoodTracks vs Melba</li>
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
              ? 'FoodTracks vs Melba — lequel choisir pour votre food truck ?'
              : 'FoodTracks vs Melba — which should you choose for your food truck?'}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            {isFr
              ? 'Melba est conçu pour les restaurants sédentaires. FoodTracks a été créé pour les food trucks. On compare prix, IA prédictive et adéquation métier pour vous aider à faire le bon choix.'
              : 'Melba is designed for sedentary restaurants. FoodTracks was built for food trucks. We compare pricing, predictive AI, and business fit to help you make the right choice.'}
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
                  ? 'Conçu pour les food trucks. IA prédictive météo + emplacement, SumUp natif, plan gratuit.'
                  : 'Built for food trucks. Weather + location AI, native SumUp, free plan.'}
              </p>
              <p className="text-lg font-bold mt-2" style={{ color: ORANGE }}>0€ → 29€/mois</p>
            </div>
            <div className="p-5 rounded-2xl text-left border border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="font-bold text-gray-900">Melba</span>
              </div>
              <p className="text-sm text-gray-600">
                {isFr
                  ? 'Outil restaurant sédentaire. Fiches techniques solides, mais pas prévu pour les food trucks mobiles.'
                  : 'Sedentary restaurant tool. Solid recipe costings, but not built for mobile food trucks.'}
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
                    Melba
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
                      {typeof row.melba === 'boolean' ? (
                        row.melba
                          ? <CheckCircle2 className="h-5 w-5 mx-auto text-gray-400" />
                          : <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{row.melba}</span>
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
                      desc: 'Melba ne prédit pas vos ventes. FoodTracks intègre météo, emplacement et événements locaux pour anticiper votre demande à 92% de précision — et vous préparer exactement ce qu\'il faut.',
                    },
                    {
                      icon: <ShoppingCart className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Intégration SumUp native',
                      desc: 'FoodTracks se connecte en 2 clics à votre SumUp. Toutes vos ventes se synchronisent automatiquement, le stock se met à jour en temps réel. Une fluidité que Melba ne propose pas pour les food trucks.',
                    },
                    {
                      icon: <Brain className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Gratuit dès le départ',
                      desc: 'FoodTracks commence à 0€/mois, sans limite de temps. Le plan Pro à 29€/mois reste 2,7x moins cher que Melba. Plus de 600€ d\'économie annuelle pour un food trucker indépendant.',
                    },
                    {
                      icon: <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Conçu pour la mobilité',
                      desc: 'FoodTracks a été construit avec des food truckers. Gestion multi-emplacements, alertes sur les variations de fréquentation, stock adapté à votre espace limité — tout ce que Melba ne fait pas.',
                    },
                  ]
                : [
                    {
                      icon: <Zap className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Food truck-specialised predictive AI',
                      desc: 'Melba does not predict your sales. FoodTracks integrates weather, location data, and local events to forecast your demand at 92% accuracy — so you prepare exactly what you need.',
                    },
                    {
                      icon: <ShoppingCart className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Native SumUp integration',
                      desc: 'FoodTracks connects to your SumUp in 2 clicks. All sales sync automatically and stock updates in real time — a level of integration Melba does not offer for mobile food trucks.',
                    },
                    {
                      icon: <Brain className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Free from day one',
                      desc: 'FoodTracks starts at €0/month with no time limit. The Pro plan at €29/month is 2.7x cheaper than Melba. Over €600 in annual savings for an independent food trucker.',
                    },
                    {
                      icon: <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Built for mobility',
                      desc: 'FoodTracks was built with food truckers. Multi-location management, footfall alerts, stock adapted to your limited space — everything Melba does not do.',
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

        {/* Context: Melba for restaurants, FoodTracks for food trucks */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {isFr ? 'Deux outils, deux métiers différents' : 'Two tools, two different businesses'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 border border-gray-200 bg-white">
              <h3 className="text-xl font-bold text-gray-700 mb-4">
                {isFr ? 'Melba — pour les restaurants sédentaires' : 'Melba — for sedentary restaurants'}
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {(isFr
                  ? [
                      'Gestion de fiches techniques et coûts matières',
                      'Suivi des commandes fournisseurs',
                      'Interface adaptée à une brigade cuisine',
                      'Idéal pour restaurant, brasserie, dark kitchen fixe',
                      'Pas de prédictions IA contextualisées food truck',
                      'Pas de gestion multi-emplacements mobiles',
                    ]
                  : [
                      'Recipe costing and ingredient management',
                      'Supplier order tracking',
                      'Interface designed for kitchen brigades',
                      'Ideal for restaurants, brasseries, fixed dark kitchens',
                      'No contextualised food truck AI predictions',
                      'No mobile multi-location management',
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-8 border-2" style={{ borderColor: ORANGE, backgroundColor: '#FFFBF7' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: ORANGE }}>
                {isFr ? 'FoodTracks — pour les food trucks mobiles' : 'FoodTracks — for mobile food trucks'}
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {(isFr
                  ? [
                      'Prédictions IA météo + emplacement + événements',
                      'Gestion de stock adaptée à l\'espace limité d\'un truck',
                      'Multi-emplacements avec performance par spot',
                      'Intégration SumUp native en 2 clics',
                      'Alertes de réapprovisionnement avant chaque service',
                      'Plan gratuit permanent sans carte de crédit',
                    ]
                  : [
                      'AI predictions: weather + location + local events',
                      'Stock management adapted to the limited truck space',
                      'Multi-location with per-spot performance tracking',
                      'Native SumUp integration in 2 clicks',
                      'Restocking alerts before every service',
                      'Permanent free plan with no credit card',
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing comparison */}
        <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {isFr ? 'Comparaison des prix' : 'Pricing comparison'}
            </h2>
            <p className="text-center text-gray-600 mb-10">
              {isFr
                ? 'Plus de 600€/an d\'économie avec FoodTracks — et plus de fonctionnalités pour les food trucks'
                : 'Over €600/year saved with FoodTracks — and more food truck features'}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
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

              <div className="rounded-2xl border border-gray-200 p-8 bg-white">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Melba</h3>
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
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" style={{ backgroundColor: '#FFFBF7' }}>
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
              ? 'Rejoignez des centaines de food truckers qui ont choisi la solution construite pour leur métier — pas pour les restaurants sédentaires.'
              : 'Join hundreds of food truckers who chose the solution built for their business — not for sedentary restaurants.'}
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
              {isFr ? 'À lire aussi' : 'Related articles'}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/comparatif/inpulse-vs-foodtracks`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ FoodTracks vs Inpulse : comparatif complet 2026'
                    : '→ FoodTracks vs Inpulse: complete 2026 comparison'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/comparatif/marketman-vs-foodtracks`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ FoodTracks vs MarketMan : comparatif complet 2026'
                    : '→ FoodTracks vs MarketMan: complete 2026 comparison'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/guides/gestion-food-truck`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Guide complet : gérer son food truck en 2026'
                    : '→ Complete guide: managing your food truck in 2026'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/guides/ouvrir-food-truck-auto-entrepreneur`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Ouvrir un food truck en auto-entrepreneur : guide complet'
                    : '→ Opening a food truck as a sole trader: complete guide'}
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
