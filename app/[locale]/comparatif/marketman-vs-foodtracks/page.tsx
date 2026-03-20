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
    ? 'FoodTracks vs MarketMan 2026 : Comparatif Complet pour Food Trucks'
    : 'FoodTracks vs MarketMan 2026: Complete Food Truck Software Comparison';
  const description = isFr
    ? 'Comparatif détaillé FoodTracks vs MarketMan : prix, fonctionnalités IA, intégration SumUp, marché FR vs US/UK. MarketMan ~399$/mois vs FoodTracks gratuit. Découvrez lequel choisir en 2026.'
    : 'Detailed FoodTracks vs MarketMan comparison: pricing, AI features, SumUp integration, FR vs US/UK market. MarketMan ~$399/month vs FoodTracks free. Find out which to choose in 2026.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'foodtracks vs marketman',
          'alternative marketman france',
          'comparatif logiciel food truck 2026',
          'marketman concurrent foodtracks',
          'logiciel gestion food truck moins cher que marketman',
          'meilleur logiciel food truck france',
        ]
      : [
          'foodtracks vs marketman',
          'marketman alternative france',
          'food truck software comparison 2026',
          'marketman competitor foodtracks',
          'cheaper food truck software than marketman',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/comparatif/marketman-vs-foodtracks`,
      languages: {
        fr: `${BASE_URL}/fr/comparatif/marketman-vs-foodtracks`,
        en: `${BASE_URL}/en/comparatif/marketman-vs-foodtracks`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/comparatif/marketman-vs-foodtracks`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks vs MarketMan comparison' }],
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

export default async function ComparatifMarketManPage({
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
      { '@type': 'ListItem', position: 3, name: 'FoodTracks vs MarketMan', item: `${BASE_URL}/${locale}/comparatif/marketman-vs-foodtracks` },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'FoodTracks vs MarketMan 2026 : Comparatif Complet pour Food Trucks'
      : 'FoodTracks vs MarketMan 2026: Complete Food Truck Software Comparison',
    description: isFr
      ? 'Comparatif détaillé FoodTracks vs MarketMan : prix, fonctionnalités, intégrations et adéquation marché FR vs US/UK.'
      : 'Detailed FoodTracks vs MarketMan comparison: pricing, features, integrations and FR vs US/UK market fit.',
    datePublished: '2026-03-01',
    dateModified: '2026-03-19',
    author: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/comparatif/marketman-vs-foodtracks` },
  };

  const faqItems = isFr
    ? [
        {
          question: 'FoodTracks ou MarketMan : lequel est moins cher ?',
          answer: 'FoodTracks est radicalement moins cher que MarketMan. FoodTracks propose un plan gratuit permanent et un plan Pro à 29€/mois. MarketMan facture à partir de ~399$/mois (environ 370€/mois) pour ses plans de base, soit plus de 4 000€ d\'économie par an. Cette différence est particulièrement significative pour un food truck indépendant ou une petite flotte en France.',
        },
        {
          question: 'MarketMan est-il disponible en France et compatible avec SumUp ?',
          answer: 'MarketMan est principalement conçu pour le marché américain et britannique. Son interface est disponible en anglais, ses intégrations ciblent les POS américains (Toast, Square, Clover) et il n\'existe pas d\'intégration native avec SumUp, le terminal de paiement dominant en France. FoodTracks, conçu pour le marché français, intègre SumUp nativement et est entièrement disponible en français.',
        },
        {
          question: 'MarketMan est-il adapté aux food trucks ou aux restaurants ?',
          answer: 'MarketMan est une solution de gestion des approvisionnements conçue pour les restaurants avec équipe de cuisine, plusieurs fournisseurs et des processus de commande complexes. Pour un food truck — opérant en mobilité, avec un espace limité et des emplacements variables — FoodTracks est mieux adapté car il intègre la gestion multi-emplacements, les prédictions de vente IA et le scan de factures dans une interface pensée pour la mobilité.',
        },
        {
          question: 'FoodTracks prédit-il les ventes contrairement à MarketMan ?',
          answer: 'Oui. FoodTracks dispose d\'un moteur d\'IA prédictive spécialisé food truck qui intègre l\'historique de ventes, la météo, le type d\'emplacement et les événements locaux pour prévoir la demande à 92% de précision. MarketMan se concentre principalement sur la gestion des commandes fournisseurs et la comptabilité des coûts, sans prédictions de vente intégrées.',
        },
        {
          question: 'MarketMan respecte-t-il le RGPD ? Où sont stockées les données ?',
          answer: 'MarketMan est une société américaine dont les serveurs sont principalement hébergés aux États-Unis. Pour un opérateur français, cela soulève des questions de conformité RGPD. FoodTracks est une solution européenne, avec des données hébergées en Europe, pleinement conforme au RGPD et aux exigences de la réglementation française sur la restauration.',
        },
        {
          question: 'Puis-je migrer de MarketMan vers FoodTracks facilement ?',
          answer: 'Oui. FoodTracks importe vos données via fichier CSV ou via le scan de vos factures fournisseurs existantes. L\'onboarding guidé vous rend opérationnel en moins de 30 minutes. Notre équipe support francophone vous accompagne gratuitement dans la migration depuis MarketMan, y compris l\'export et la réimportation de votre catalogue de produits et de vos fournisseurs.',
        },
      ]
    : [
        {
          question: 'FoodTracks or MarketMan: which is cheaper?',
          answer: 'FoodTracks is dramatically cheaper than MarketMan. FoodTracks offers a permanent free plan and a Pro plan at €29/month. MarketMan charges from ~$399/month (~€370/month) for its entry plans, saving over €4,000 per year. This difference is especially significant for an independent food truck operator or small fleet in France.',
        },
        {
          question: 'Is MarketMan available in France and compatible with SumUp?',
          answer: 'MarketMan is primarily designed for the US and UK markets. Its interface is in English, its integrations target US POS systems (Toast, Square, Clover), and there is no native integration with SumUp, the dominant payment terminal in France. FoodTracks, built for the French market, integrates SumUp natively and is fully available in French.',
        },
        {
          question: 'Is MarketMan suited to food trucks or restaurants?',
          answer: 'MarketMan is a procurement management solution designed for restaurants with kitchen teams, multiple suppliers, and complex ordering processes. For a food truck — operating mobile, with limited space and variable locations — FoodTracks is better suited as it integrates multi-location management, AI sales predictions, and invoice scanning in an interface built for mobility.',
        },
        {
          question: 'Does FoodTracks predict sales unlike MarketMan?',
          answer: 'Yes. FoodTracks has a food truck-specialized predictive AI engine that combines sales history, weather data, location type, and local events to forecast demand with 92% accuracy. MarketMan focuses primarily on supplier order management and cost accounting, with no integrated sales predictions.',
        },
        {
          question: 'Is MarketMan GDPR compliant? Where is data stored?',
          answer: 'MarketMan is a US company with servers primarily hosted in the United States. For a French operator, this raises GDPR compliance questions. FoodTracks is a European solution with data hosted in Europe, fully compliant with GDPR and French food service regulations.',
        },
        {
          question: 'Can I migrate from MarketMan to FoodTracks easily?',
          answer: 'Yes. FoodTracks imports your data via CSV file or by scanning your existing supplier invoices. The guided onboarding gets you operational in under 30 minutes. Our French-speaking support team helps with migration from MarketMan at no extra cost, including exporting and re-importing your product catalogue and supplier list.',
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
        { feature: 'Plan gratuit', foodtracks: true, marketman: false },
        { feature: 'Prix de départ', foodtracks: '0€/mois', marketman: '~399$/mois', highlight: true },
        { feature: 'Langue française', foodtracks: true, marketman: false, highlight: true },
        { feature: 'Prédictions IA des ventes', foodtracks: true, marketman: false, highlight: true },
        { feature: 'Intégration SumUp native', foodtracks: true, marketman: false, highlight: true },
        { feature: 'Conçu pour food trucks', foodtracks: true, marketman: false },
        { feature: 'Gestion multi-emplacements mobiles', foodtracks: true, marketman: false },
        { feature: 'Scan de factures fournisseurs', foodtracks: true, marketman: true },
        { feature: 'Application mobile iOS/Android', foodtracks: true, marketman: true },
        { feature: 'Alertes péremption', foodtracks: true, marketman: true },
        { feature: 'Prédictions météo intégrées', foodtracks: true, marketman: false },
        { feature: 'Intégrations POS français (SumUp, iZettle)', foodtracks: true, marketman: false },
        { feature: 'Dashboard rentabilité', foodtracks: true, marketman: true },
        { feature: 'RGPD / Données en Europe', foodtracks: true, marketman: false, highlight: true },
        { feature: 'Support en français', foodtracks: true, marketman: false },
        { feature: 'Onboarding en < 30 minutes', foodtracks: true, marketman: false },
        { feature: 'Export comptable', foodtracks: true, marketman: true },
      ]
    : [
        { feature: 'Free plan', foodtracks: true, marketman: false },
        { feature: 'Starting price', foodtracks: '€0/month', marketman: '~$399/month', highlight: true },
        { feature: 'French language', foodtracks: true, marketman: false, highlight: true },
        { feature: 'AI sales predictions', foodtracks: true, marketman: false, highlight: true },
        { feature: 'Native SumUp integration', foodtracks: true, marketman: false, highlight: true },
        { feature: 'Built for food trucks', foodtracks: true, marketman: false },
        { feature: 'Mobile multi-location management', foodtracks: true, marketman: false },
        { feature: 'Supplier invoice scanning', foodtracks: true, marketman: true },
        { feature: 'iOS/Android mobile app', foodtracks: true, marketman: true },
        { feature: 'Expiry alerts', foodtracks: true, marketman: true },
        { feature: 'Weather-integrated forecasting', foodtracks: true, marketman: false },
        { feature: 'French POS integrations (SumUp, iZettle)', foodtracks: true, marketman: false },
        { feature: 'Profitability dashboard', foodtracks: true, marketman: true },
        { feature: 'GDPR / European data storage', foodtracks: true, marketman: false, highlight: true },
        { feature: 'French-language support', foodtracks: true, marketman: false },
        { feature: 'Onboarding in < 30 minutes', foodtracks: true, marketman: false },
        { feature: 'Accounting export', foodtracks: true, marketman: true },
      ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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
            <li className="text-gray-900 font-medium">FoodTracks vs MarketMan</li>
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
              ? 'FoodTracks vs MarketMan — lequel choisir pour votre food truck ?'
              : 'FoodTracks vs MarketMan — which should you choose for your food truck?'}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            {isFr
              ? 'MarketMan est une référence aux États-Unis et au Royaume-Uni, mais est-il adapté au marché français ? On compare prix, fonctionnalités, intégrations et conformité RGPD pour vous aider à choisir.'
              : 'MarketMan is a reference in the US and UK, but is it suited to the French market? We compare pricing, features, integrations, and GDPR compliance to help you choose.'}
          </p>

          {/* Quick verdict */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            <div className="p-5 rounded-2xl text-left border-2" style={{ borderColor: ORANGE, backgroundColor: '#FFF8F5' }}>
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="h-5 w-5" style={{ color: ORANGE }} />
                <span className="font-bold text-gray-900">FoodTracks</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white ml-auto" style={{ backgroundColor: ORANGE }}>
                  {isFr ? 'Recommandé FR' : 'Recommended FR'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {isFr
                  ? 'Conçu pour le marché français. IA prédictive, SumUp natif, RGPD, prix accessible.'
                  : 'Built for the French market. Predictive AI, native SumUp, GDPR compliant, affordable.'}
              </p>
              <p className="text-lg font-bold mt-2" style={{ color: ORANGE }}>0€ → 29€/mois</p>
            </div>
            <div className="p-5 rounded-2xl text-left border border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="font-bold text-gray-900">MarketMan</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-gray-500 bg-gray-100 ml-auto">
                  {isFr ? 'Marché US/UK' : 'US/UK market'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {isFr
                  ? 'Solution US/UK. Pas de SumUp, interface anglais, serveurs US, prix élevé.'
                  : 'US/UK solution. No SumUp, English interface, US servers, high price.'}
              </p>
              <p className="text-lg font-bold mt-2 text-gray-500">~399$/mois</p>
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

        {/* Context: MarketMan US/UK vs FoodTracks FR */}
        <section className="py-12" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {isFr ? 'MarketMan : une solution américaine dans un marché français' : 'MarketMan: an American solution in a French market'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isFr
                  ? 'Fondée à New York et adoptée par des milliers de restaurants aux États-Unis et au Royaume-Uni, MarketMan est une plateforme solide de gestion des approvisionnements pour la restauration. Cependant, elle présente des limitations importantes pour les food truckers français : absence d\'intégration avec SumUp (dominant en France), interface uniquement en anglais, serveurs hébergés aux États-Unis (questions RGPD), et un prix de départ d\'environ 399$/mois (~370€) sans plan gratuit.'
                  : 'Founded in New York and adopted by thousands of restaurants in the US and UK, MarketMan is a solid procurement management platform for the food service industry. However, it presents significant limitations for French food truck operators: no integration with SumUp (dominant in France), English-only interface, servers hosted in the United States (GDPR concerns), and a starting price of approximately $399/month (~€370) with no free plan.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {isFr
                  ? 'FoodTracks a été conçu dès le départ pour les food truckers français et européens : intégration SumUp native, conformité RGPD, support francophone, et une IA prédictive qui intègre les spécificités du marché français (météo, événements locaux, marchés hebdomadaires). Le tout à partir de 0€/mois.'
                  : 'FoodTracks was built from the ground up for French and European food truck operators: native SumUp integration, GDPR compliance, French-speaking support, and predictive AI that integrates the specificities of the French market (weather, local events, weekly markets). Starting from €0/month.'}
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {isFr ? 'Tableau comparatif complet (17 critères)' : 'Full comparison table (17 criteria)'}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8F6F3' }}>
                  <th className="text-left px-6 py-5 text-sm font-semibold text-gray-700 w-1/2">
                    {isFr ? 'Critère' : 'Criterion'}
                  </th>
                  <th className="text-center px-6 py-5 text-sm font-bold w-1/4" style={{ color: ORANGE }}>
                    FoodTracks
                  </th>
                  <th className="text-center px-6 py-5 text-sm font-semibold text-gray-500 w-1/4">
                    MarketMan
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
                      {typeof row.marketman === 'boolean' ? (
                        row.marketman
                          ? <CheckCircle2 className="h-5 w-5 mx-auto text-gray-400" />
                          : <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{row.marketman}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            {isFr
              ? '* Tarifs MarketMan basés sur les informations publiques disponibles en mars 2026. Vérifiez sur le site officiel de MarketMan pour les tarifs actuels.'
              : '* MarketMan pricing based on publicly available information as of March 2026. Check MarketMan\'s official website for current pricing.'}
          </p>
        </section>

        {/* Why FoodTracks wins */}
        <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {isFr
                ? 'Pourquoi les food truckers français choisissent FoodTracks'
                : 'Why French food truckers choose FoodTracks'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(isFr
                ? [
                    {
                      icon: <Zap className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'IA prédictive pensée pour la France',
                      desc: 'Notre moteur d\'IA intègre la météo française, les événements locaux (Braderie, Carnaval, festivals), les marchés hebdomadaires et votre historique par emplacement pour prévoir vos ventes à 92% de précision. MarketMan ne propose pas de prédictions de vente.',
                    },
                    {
                      icon: <ShoppingCart className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'SumUp natif — le terminal français dominant',
                      desc: 'Connectez votre terminal SumUp en 2 clics. Toutes vos ventes se synchronisent automatiquement et le stock se met à jour en temps réel. MarketMan cible les POS américains (Toast, Square US) sans intégration SumUp.',
                    },
                    {
                      icon: <Brain className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Prix 13× moins cher — 0€ vs ~399$/mois',
                      desc: 'FoodTracks propose un plan gratuit sans limite de temps. Le plan Pro à 29€/mois représente une économie de plus de 4 000€/an par rapport au prix de départ de MarketMan. Pour un food truck indépendant, c\'est une différence radicale.',
                    },
                    {
                      icon: <Globe className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'RGPD & données en Europe',
                      desc: 'FoodTracks est une solution européenne, hébergeant vos données sur des serveurs en Europe, pleinement conforme au RGPD. MarketMan est une société américaine avec des serveurs aux États-Unis, ce qui pose des questions de conformité pour les opérateurs européens.',
                    },
                  ]
                : [
                    {
                      icon: <Zap className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Predictive AI built for France',
                      desc: 'Our AI engine integrates French weather, local events (Braderie, Carnival, festivals), weekly markets, and your location history to forecast sales with 92% accuracy. MarketMan does not offer sales predictions.',
                    },
                    {
                      icon: <ShoppingCart className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'Native SumUp — the dominant French terminal',
                      desc: 'Connect your SumUp terminal in 2 clicks. All sales sync automatically and stock updates in real time. MarketMan targets US POS systems (Toast, US Square) with no SumUp integration.',
                    },
                    {
                      icon: <Brain className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: '13× cheaper — €0 vs ~$399/month',
                      desc: 'FoodTracks offers a permanent free plan. The Pro plan at €29/month saves over €4,000/year compared to MarketMan\'s entry price. For an independent food truck, that is a radical difference.',
                    },
                    {
                      icon: <Globe className="h-6 w-6" style={{ color: ORANGE }} />,
                      title: 'GDPR & European data storage',
                      desc: 'FoodTracks is a European solution, hosting your data on European servers, fully GDPR compliant. MarketMan is a US company with servers in the United States, raising compliance questions for European operators.',
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
              ? 'Une différence de plus de 4 000€/an — avec plus de fonctionnalités adaptées au marché français chez FoodTracks'
              : 'Over €4,000/year difference — with more features adapted to the French market at FoodTracks'}
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
                  {isFr ? 'Recommandé FR' : 'Recommended FR'}
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

            {/* MarketMan */}
            <div className="rounded-2xl border border-gray-200 p-8 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-700">MarketMan</h3>
                <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold text-gray-500 bg-gray-100">
                  {isFr ? 'Marché US/UK' : 'US/UK market'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{isFr ? 'Plan Gratuit' : 'Free Plan'}</span>
                  <span className="text-sm font-medium text-red-500">
                    {isFr ? 'Non disponible' : 'Not available'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{isFr ? 'Plan de départ' : 'Starting plan'}</span>
                  <span className="font-bold text-gray-700">~399$/mois</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">{isFr ? 'Coût annuel estimé' : 'Estimated annual cost'}</span>
                  <span className="font-bold text-gray-700">~4 788$/an</span>
                </div>
              </div>
              <div className="mt-6 py-3 rounded-xl text-center text-sm text-gray-400 border border-gray-200">
                {isFr ? '+4 000€/an de plus que FoodTracks Pro' : '+€4,000/year more than FoodTracks Pro'}
              </div>
            </div>
          </div>
        </section>

        {/* Who is MarketMan for */}
        <section className="py-12" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {isFr ? 'Quand MarketMan peut avoir du sens (et quand non)' : 'When MarketMan may make sense (and when it doesn\'t)'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-400" />
                    {isFr ? 'MarketMan peut convenir si…' : 'MarketMan may work if…'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {isFr ? 'Vous opérez principalement aux USA ou au Royaume-Uni' : 'You operate primarily in the US or UK'}</li>
                    <li>• {isFr ? 'Vous utilisez un POS américain (Toast, Square US)' : 'You use a US POS system (Toast, US Square)'}</li>
                    <li>• {isFr ? 'Vous gérez un restaurant traditionnel avec grande équipe' : 'You manage a traditional restaurant with a large team'}</li>
                    <li>• {isFr ? 'Le budget n\'est pas une contrainte' : 'Budget is not a constraint'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    {isFr ? 'MarketMan ne convient pas si…' : 'MarketMan is not suited if…'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {isFr ? 'Vous opérez en France ou en Europe' : 'You operate in France or Europe'}</li>
                    <li>• {isFr ? 'Vous utilisez SumUp comme terminal de paiement' : 'You use SumUp as your payment terminal'}</li>
                    <li>• {isFr ? 'Vous êtes un food truck ou restaurateur mobile' : 'You are a food truck or mobile caterer'}</li>
                    <li>• {isFr ? 'La conformité RGPD est importante pour vous' : 'GDPR compliance matters to you'}</li>
                    <li>• {isFr ? 'Vous souhaitez des prédictions de vente IA' : 'You want AI sales predictions'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
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
              ? 'Rejoignez des centaines de food truckers français qui ont choisi la solution pensée pour leur marché — sans carte bancaire, sans engagement, sans les contraintes d\'un outil américain.'
              : 'Join hundreds of French food truckers who chose the solution built for their market — no credit card, no commitment, without the constraints of a US tool.'}
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
              ? 'Sans carte bancaire · Opérationnel en 30 minutes · Support humain en français'
              : 'No credit card · Operational in 30 minutes · Human support in French'}
          </p>

          {/* Internal links */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {isFr ? 'Articles et comparatifs liés' : 'Related articles and comparisons'}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/comparatif/inpulse-vs-foodtracks`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ FoodTracks vs Inpulse — comparatif complet 2026'
                    : '→ FoodTracks vs Inpulse — full comparison 2026'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/fonctionnalites/integration-sumup`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Intégration SumUp pour food trucks — comment ça marche ?'
                    : '→ SumUp integration for food trucks — how does it work?'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/fonctionnalites/predictions-ventes`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: ORANGE }}
                >
                  {isFr
                    ? '→ Prédictions de ventes IA pour food trucks'
                    : '→ AI sales predictions for food trucks'}
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
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
