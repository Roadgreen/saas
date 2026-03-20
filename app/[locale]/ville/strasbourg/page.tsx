import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const TEAL   = '#14B8A6';
const DARK   = '#0D0905';
const GREEN  = '#22C55E';

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
    ? 'Logiciel Gestion Food Truck Strasbourg — Stock & Prédictions IA | FoodTracks'
    : 'Food Truck Management Software Strasbourg — Inventory & AI Forecasting | FoodTracks';
  const description = isFr
    ? 'Gérez votre food truck à Strasbourg avec FoodTracks : gestion de stock en temps réel, prédictions IA adaptées au Marché de Noël, au tourisme alsacien et à l\'Eurométropole. Plan gratuit disponible.'
    : 'Manage your Strasbourg food truck with FoodTracks: real-time inventory, AI predictions adapted to the Christmas Market, Alsatian tourism and the Eurometropolis. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Strasbourg',
          'application food truck Strasbourg',
          'gestion stock food truck Strasbourg',
          'food truck Alsace',
          'food truck marché de Noël Strasbourg',
          'food truck Eurométropole',
          'food truck Grand Est',
        ]
      : [
          'food truck management software Strasbourg',
          'food truck app Strasbourg',
          'food truck inventory Strasbourg',
          'food truck Christmas market Strasbourg',
          'mobile catering software Strasbourg France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/strasbourg`,
      languages: {
        fr: `${BASE_URL}/fr/ville/strasbourg`,
        en: `${BASE_URL}/en/ville/strasbourg`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/strasbourg`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Strasbourg' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group" style={{ borderBottom: '1px solid #EDEBE8' }}>
      <summary className="w-full flex items-center justify-between py-7 text-left gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-orange-600 transition-colors duration-200">
          {question}
        </span>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-open:bg-orange-50 bg-gray-50 transition-all">
          <ChevronDown className="h-4 w-4 text-gray-400 group-open:text-orange-500 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <p className="pb-8 text-sm md:text-base leading-[1.8] max-w-2xl text-gray-500">{answer}</p>
    </details>
  );
}

export default async function StrasbourgFoodTruckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FoodTracks — Strasbourg',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Strasbourg et en Alsace.'
      : 'Management software for food trucks operating in Strasbourg and Alsace.',
    url: `${BASE_URL}/${locale}/ville/strasbourg`,
    areaServed: {
      '@type': 'City',
      name: 'Strasbourg',
      sameAs: 'https://www.wikidata.org/wiki/Q6602',
    },
    brand: { '@type': 'Brand', name: 'FoodTracks' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: isFr ? 'Plan gratuit disponible' : 'Free plan available',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/strasbourg` },
      { '@type': 'ListItem', position: 3, name: 'Strasbourg', item: `${BASE_URL}/${locale}/ville/strasbourg` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Comment gérer le Marché de Noël de Strasbourg avec FoodTracks ?',
          a: 'Le Marché de Noël de Strasbourg est le plus ancien et le plus visité d\'Europe avec 3 millions de visiteurs sur 4 semaines. FoodTracks anticipe ce pic exceptionnel en analysant vos ventes passées et en vous envoyant des alertes de réapprovisionnement plusieurs semaines à l\'avance. Vous n\'avez plus à improviser en pleine période : votre stock est prêt bien avant l\'ouverture.',
        },
        {
          q: 'Quels sont les meilleurs emplacements food truck à Strasbourg ?',
          a: 'Strasbourg offre plusieurs zones très fréquentées : la Grande Île (Petite France, Place Kléber, cathédrale Notre-Dame) pour les touristes, le quartier du Parlement Européen pour la clientèle institutionnelle, les marchés de quartier comme le marché du Neudorf, et les campus universitaires. FoodTracks analyse vos ventes par emplacement pour identifier vos spots les plus rentables.',
        },
        {
          q: 'FoodTracks prend-il en compte le tourisme alsacien et transfrontalier ?',
          a: 'Oui. Strasbourg accueille une clientèle touristique internationale — notamment allemande, suisse et luxembourgeoise — avec des flux très différents selon la saison. FoodTracks intègre la saisonnalité alsacienne dans ses prédictions IA : l\'été pour les touristes culturels, l\'automne pour le vignoble, et l\'hiver pour le Marché de Noël.',
        },
        {
          q: 'Comment gérer les événements du Parlement Européen à Strasbourg ?',
          a: 'Le Parlement Européen siège à Strasbourg plusieurs semaines par an, générant un afflux de fonctionnaires européens, journalistes et visiteurs institutionnels. FoodTracks intègre ces sessions dans son calendrier de prédictions et vous alerte pour adapter vos stocks et votre offre à cette clientèle internationale spécifique.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck strasbourgeois ?',
          a: 'FoodTracks propose un plan gratuit complet sans carte de crédit. Les plans payants incluent les prédictions IA avancées pour anticiper le Marché de Noël et les flux touristiques, le scan de factures illimité et le support prioritaire. Adapté à tous les profils, du food truck indépendant au groupe couvrant toute l\'Eurométropole de Strasbourg.',
        },
      ]
    : [
        {
          q: 'How does FoodTracks help manage Strasbourg\'s Christmas Market?',
          a: 'Strasbourg\'s Christmas Market is Europe\'s oldest and most visited, with 3 million visitors over 4 weeks. FoodTracks anticipates this exceptional peak by analysing your past sales and sending restocking alerts several weeks in advance. You no longer need to improvise mid-season: your stock is ready well before opening day.',
        },
        {
          q: 'What are the best food truck locations in Strasbourg?',
          a: 'Strasbourg offers several high-footfall zones: Grande Île (Petite France, Place Kléber, Notre-Dame Cathedral) for tourists, the European Parliament district for institutional clientele, neighbourhood markets like Marché du Neudorf, and university campuses. FoodTracks analyses your sales by location to identify your most profitable spots.',
        },
        {
          q: 'Does FoodTracks account for Alsatian and cross-border tourism?',
          a: 'Yes. Strasbourg welcomes international tourists — especially German, Swiss, and Luxembourgish visitors — with very different flows depending on the season. FoodTracks integrates Alsatian seasonality into its AI predictions: summer for cultural tourists, autumn for the wine route, and winter for the Christmas Market.',
        },
        {
          q: 'How do I manage European Parliament events in Strasbourg?',
          a: 'The European Parliament sits in Strasbourg for several weeks per year, generating an influx of European officials, journalists, and institutional visitors. FoodTracks integrates these sessions into its prediction calendar and alerts you to adapt your stock and offer to this specific international clientele.',
        },
        {
          q: 'How much does FoodTracks cost for a Strasbourg food truck?',
          a: 'FoodTracks offers a full free plan with no credit card required. Paid plans include advanced AI predictions to anticipate the Christmas Market and tourist flows, unlimited invoice scanning, and priority support — suitable for every profile from a solo operator to a group covering the entire Strasbourg Eurometropolis.',
        },
      ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const benefits = [
    {
      icon: <MapPin className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Multi-emplacements strasbourgeois' : 'Multiple Strasbourg locations',
      desc: isFr
        ? 'Grande Île, Petite France, Parlement Européen, campus — gérez tous vos spots avec un stock centralisé.'
        : 'Grande Île, Petite France, European Parliament, campuses — manage all your spots with centralised inventory.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions Marché de Noël & tourisme' : 'Christmas Market & tourism forecasting',
      desc: isFr
        ? 'L\'IA anticipe les 3 millions de visiteurs du Marché de Noël et les flux touristiques alsaciens pour vous préparer bien à l\'avance.'
        : 'AI anticipates the 3 million Christmas Market visitors and Alsatian tourist flows so you are ready well in advance.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro rupture de stock' : 'Zero stockouts',
      desc: isFr
        ? 'Alertes proactives avant les sessions du Parlement, les fêtes alsaciennes et les marchés de Noël pour ne jamais manquer d\'ingrédients.'
        : 'Proactive alerts before Parliament sessions, Alsatian festivals, and Christmas markets so you never run out.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse de rentabilité' : 'Profitability analysis',
      desc: isFr
        ? 'Identifiez vos produits et emplacements les plus rentables pour optimiser votre offre à chaque quartier de Strasbourg.'
        : 'Identify your most profitable products and locations to optimise your offer in every Strasbourg district.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan de factures fournisseurs' : 'Supplier invoice scanning',
      desc: isFr
        ? 'Scannez vos factures en quelques secondes — idéal pour gérer vos approvisionnements auprès des producteurs alsaciens.'
        : 'Scan invoices in seconds — ideal for managing supply from Alsatian producers.',
    },
    {
      icon: <Star className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Plan gratuit sans limite de temps' : 'Unlimited free plan',
      desc: isFr
        ? 'Commencez gratuitement sans carte de crédit. Évoluez vers le plan Pro quand votre activité grandit.'
        : 'Start free with no credit card. Upgrade to Pro as your business grows.',
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LandingHeader />

      {/* HERO */}
      <section
        className="relative overflow-hidden py-24 md:py-36"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(249,115,22,0.14) 0%, transparent 50%),
                       radial-gradient(ellipse 80% 60% at 100% 75%, rgba(20,184,166,0.10) 0%, transparent 50%),
                       #07111E`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: '#6B7280' }}>
              <Link href={`/${locale}`} className="hover:text-white transition-colors">FoodTracks</Link>
              <span>/</span>
              <span style={{ color: ORANGE }}>Strasbourg</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Strasbourgeois' : 'Strasbourg Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Strasbourg</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Strasbourg</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées au Marché de Noël, au tourisme alsacien et aux sessions du Parlement Européen. Réduisez le gaspillage et maximisez vos ventes.'
                : 'Real-time inventory, AI predictions adapted to the Christmas Market, Alsatian tourism and European Parliament sessions. Cut waste and maximise sales.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4 text-white text-base"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.4)' }}
                >
                  <Package className="h-4 w-4" />
                  {isFr ? 'Démarrer gratuitement' : 'Start for free'}
                </button>
              </Link>
              <a href="#fonctionnalites">
                <button
                  className="btn-landing btn-outline-dark inline-flex items-center justify-center rounded-full font-semibold px-10 py-4 border text-base"
                  style={{ borderColor: 'rgba(249,115,22,0.25)', color: '#D1D5DB', backgroundColor: 'transparent' }}
                >
                  {isFr ? 'Voir les fonctionnalités' : 'See features'}
                </button>
              </a>
            </div>

            <p className="text-sm" style={{ color: '#6B7280' }}>
              {isFr ? 'Gratuit · Sans carte de crédit · Sans engagement' : 'Free · No credit card · No commitment'}
            </p>
          </div>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-2xl p-8 md:p-12"
              style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDEBE8' }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="p-3 rounded-xl shrink-0"
                  style={{ backgroundColor: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)' }}
                >
                  <MapPin className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Strasbourg : tourisme alsacien et pics saisonniers exceptionnels' : 'Strasbourg: Alsatian tourism and exceptional seasonal peaks'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Strasbourg est une ville à forte identité touristique : capitale européenne siège du Parlement de l\'UE, ville du plus célèbre Marché de Noël d\'Europe, et porte de la Route des Vins d\'Alsace. Pour un food trucker, cela signifie une demande qui peut varier du simple au décuple selon la saison. La Petite France et la cathédrale attirent 10 millions de visiteurs par an, avec un pic violent en novembre-décembre lors du Marché de Noël. FoodTracks est conçu pour anticiper ces variations extrêmes et vous permettre de ne jamais manquer une vente.'
                      : 'Strasbourg has a strong tourist identity: European capital hosting the EU Parliament, city of Europe\'s most famous Christmas Market, and gateway to the Alsatian Wine Route. For a food truck operator, this means demand can vary tenfold depending on the season. Petite France and the cathedral attract 10 million visitors per year, with a sharp peak in November-December during the Christmas Market. FoodTracks is designed to anticipate these extreme variations so you never miss a sale.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '3M',
                    label: isFr ? 'visiteurs Marché de Noël' : 'Christmas Market visitors',
                    sub: isFr ? 'En 4 semaines' : 'In 4 weeks',
                  },
                  {
                    stat: '10M',
                    label: isFr ? 'touristes / an' : 'tourists / year',
                    sub: isFr ? 'Forte saisonnalité alsacienne' : 'Strong Alsatian seasonality',
                  },
                  {
                    stat: '10×',
                    label: isFr ? 'variation saisonnière' : 'seasonal variation',
                    sub: isFr ? 'Été vs hiver à anticiper' : 'Summer vs winter to plan for',
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="font-jakarta text-4xl font-extrabold mb-1" style={{ color: ORANGE }}>
                      {item.stat}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="fonctionnalites" className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {isFr
                ? 'Tout ce dont votre food truck strasbourgeois a besoin'
                : 'Everything your Strasbourg food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour le tourisme alsacien et les événements européens de Strasbourg.'
                : 'A complete platform, designed for Alsatian tourism and Strasbourg\'s European events.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-7 space-y-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {b.icon}
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-4">{isFr ? 'Fonctionnalités clés' : 'Key features'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/fonctionnalites/gestion-stock`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Gestion de stock en temps réel' : 'Real-time inventory management'}
              </Link>
              <Link href={`/${locale}/fonctionnalites/predictions-ventes`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Prédictions de ventes IA' : 'AI sales forecasting'}
              </Link>
              <Link href={`/${locale}/fonctionnalites/scan-factures`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Scan de factures' : 'Invoice scanning'}
              </Link>
              <Link href={`/${locale}/ville/lille`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Lille' : 'FoodTracks in Lille'}
              </Link>
              <Link href={`/${locale}/ville/nice`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Nice' : 'FoodTracks in Nice'}
              </Link>
              <Link href={`/${locale}/ville/paris`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Paris' : 'FoodTracks in Paris'}
              </Link>
              <Link href={`/${locale}/ville/lyon`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Lyon' : 'FoodTracks in Lyon'}
              </Link>
              <Link href={`/${locale}/guides/gestion-food-truck`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Guide complet gestion food truck' : 'Complete food truck management guide'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
              {isFr ? 'Questions fréquentes — Strasbourg' : 'FAQ — Strasbourg'}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {faqData.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative py-28 md:py-36 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto space-y-10">
            <h2 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Strasbourg</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Strasbourg</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers strasbourgeois qui utilisent FoodTracks pour anticiper le Marché de Noël, gérer le tourisme alsacien et vendre plus toute l\'année.'
                : 'Join Strasbourg food truckers using FoodTracks to anticipate the Christmas Market, manage Alsatian tourism, and sell more all year round.'}
            </p>
            <div className="flex flex-col items-center gap-6">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-14 py-5 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
                >
                  <ArrowRight className="h-5 w-5" />
                  {isFr ? 'Commencer gratuitement' : 'Get started free'}
                </button>
              </Link>
              <p className="text-sm text-white/70">
                {isFr ? 'Gratuit · Sans carte de crédit' : 'Free · No credit card'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-12 relative"
        style={{ backgroundColor: '#070503', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
              <span className="font-jakarta text-lg font-bold text-white tracking-tight">FoodTracks</span>
            </Link>
            <div className="flex items-center gap-6 text-sm" style={{ color: '#4B5563' }}>
              <Link href={`/${locale}/pricing`} className="hover:text-gray-300 transition-colors">{isFr ? 'Tarifs' : 'Pricing'}</Link>
              <Link href={`/${locale}/blog`} className="hover:text-gray-300 transition-colors">Blog</Link>
              <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
            </div>
            <p className="text-xs" style={{ color: '#374151' }}>
              © {new Date().getFullYear()} FoodTracks
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
