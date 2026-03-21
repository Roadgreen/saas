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
    ? 'Logiciel Gestion Food Truck Lille — Stock & Prédictions IA'
    : 'Food Truck Management Software Lille — Inventory & AI Forecasting';
  const description = isFr
    ? 'Gérez votre food truck à Lille avec FoodTracks : gestion de stock en temps réel, prédictions IA adaptées à la Braderie, au marché de Wazemmes et à Lille Métropole. Plan gratuit disponible.'
    : 'Manage your Lille food truck with FoodTracks: real-time inventory, AI predictions adapted to the Braderie, Wazemmes market and Lille Métropole. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Lille',
          'application food truck Lille',
          'gestion stock food truck Lille',
          'prédictions ventes food truck Lille',
          'food truck Nord',
          'food truck Hauts-de-France',
          'food truck marché Wazemmes',
        ]
      : [
          'food truck management software Lille',
          'food truck app Lille',
          'food truck inventory Lille',
          'food truck sales forecasting Lille',
          'mobile catering software Lille France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/lille`,
      languages: {
        fr: `${BASE_URL}/fr/ville/lille`,
        en: `${BASE_URL}/en/ville/lille`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/lille`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Lille' }],
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

export default async function LilleFoodTruckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  /* ── Schema.org ──────────────────────────────────────── */
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FoodTracks — Lille',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Lille et en Hauts-de-France.'
      : 'Management software for food trucks operating in Lille and Hauts-de-France.',
    url: `${BASE_URL}/${locale}/ville/lille`,
    areaServed: {
      '@type': 'City',
      name: 'Lille',
      sameAs: 'https://www.wikidata.org/wiki/Q23197',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/lille` },
      { '@type': 'ListItem', position: 3, name: 'Lille', item: `${BASE_URL}/${locale}/ville/lille` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs emplacements pour un food truck à Lille ?',
          a: 'Lille offre des spots incontournables : le marché de Wazemmes (le plus grand du Nord, 3 jours par semaine), le Vieux-Lille autour de la Grand\'Place, le quartier Euralille pour la clientèle d\'affaires, et les nombreux événements culturels de la métropole. FoodTracks analyse vos ventes par emplacement pour identifier vos spots les plus rentables.',
        },
        {
          q: 'Comment gérer la Braderie de Lille avec FoodTracks ?',
          a: 'La Braderie de Lille est l\'un des plus grands marchés aux puces d\'Europe : 2 millions de visiteurs en un week-end. FoodTracks anticipe ce pic exceptionnel grâce à ses prédictions IA — vous recevez des alertes pour constituer vos stocks plusieurs jours à l\'avance et éviter toute rupture lors de cet événement annuel clé.',
        },
        {
          q: 'FoodTracks est-il adapté aux food trucks des marchés du Nord ?',
          a: 'Oui. Le marché de Wazemmes, le marché de la Croix-Rouge ou les marchés saisonniers de Lille sont intégrés dans le modèle de prédiction. FoodTracks gère plusieurs emplacements, synchronise votre stock en temps réel et prédit la demande selon le type de marché, la météo nordiste et les événements locaux.',
        },
        {
          q: 'Comment FoodTracks aide-t-il pour les événements étudiants de Lille ?',
          a: 'Lille est la troisième ville étudiante de France avec 100 000 étudiants. Les soirées de rentrée, les périodes d\'examens et les grands événements comme la Lille Science Po Week génèrent des pics de fréquentation prévisibles. FoodTracks intègre le calendrier universitaire dans ses prédictions pour que vous soyez toujours prêt.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck lillois ?',
          a: 'FoodTracks propose un plan gratuit complet sans carte de crédit. Les plans payants débutent à un tarif compétitif et incluent les prédictions IA avancées, le scan de factures illimité et le support prioritaire. Adapté à tous les profils, du food truck indépendant installé à Wazemmes au groupe opérant sur toute la Métropole Européenne de Lille.',
        },
      ]
    : [
        {
          q: 'What are the best locations for a food truck in Lille?',
          a: 'Lille offers unmissable spots: Wazemmes market (the largest in northern France, open 3 days a week), Vieux-Lille around the Grand\'Place, the Euralille district for business clientele, and numerous cultural events across the métropole. FoodTracks analyses your sales by location to identify your most profitable spots.',
        },
        {
          q: 'How does FoodTracks help manage the Braderie de Lille?',
          a: 'The Braderie de Lille is one of Europe\'s largest flea markets: 2 million visitors in a single weekend. FoodTracks anticipates this exceptional peak through AI predictions — you receive alerts to build up your stock several days in advance and avoid any stockout during this key annual event.',
        },
        {
          q: 'Is FoodTracks suited to food trucks at northern France markets?',
          a: 'Yes. Wazemmes market, Croix-Rouge market, and Lille\'s seasonal markets are factored into the prediction model. FoodTracks manages multiple locations, syncs your inventory in real time, and forecasts demand based on market type, northern French weather, and local events.',
        },
        {
          q: 'How does FoodTracks help with Lille student events?',
          a: 'Lille is the third largest student city in France with 100,000 students. Back-to-school nights, exam periods, and major events generate predictable footfall spikes. FoodTracks integrates the university calendar into its predictions so you are always prepared.',
        },
        {
          q: 'How much does FoodTracks cost for a Lille food truck?',
          a: 'FoodTracks offers a full free plan with no credit card required. Paid plans start at a competitive rate and include advanced AI predictions, unlimited invoice scanning, and priority support — suitable for every profile, from a solo operator at Wazemmes to a group covering the whole Lille European Metropolis.',
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
      title: isFr ? 'Multi-emplacements lillois' : 'Multiple Lille locations',
      desc: isFr
        ? 'Gérez simultanément plusieurs spots — Wazemmes, Vieux-Lille, Euralille — avec un stock centralisé et des prédictions par lieu.'
        : 'Manage multiple spots simultaneously — Wazemmes, Vieux-Lille, Euralille — with centralised inventory and per-location forecasts.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions Braderie & événements' : 'Braderie & event forecasting',
      desc: isFr
        ? 'L\'IA anticipe les pics comme la Braderie, les concerts de l\'Arena, ou les marchés de Noël pour que vous ne soyez jamais à court.'
        : 'AI anticipates peaks like the Braderie, Arena concerts, or Christmas markets so you never run short.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro rupture de stock' : 'Zero stockouts',
      desc: isFr
        ? 'Recevez des alertes proactives avant les grandes journées pour ne jamais manquer d\'ingrédients clés.'
        : 'Get proactive alerts before big trading days so you never run out of key ingredients.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse de rentabilité' : 'Profitability analysis',
      desc: isFr
        ? 'Suivez vos marges par produit et par emplacement pour maximiser votre rentabilité dans chaque quartier de Lille.'
        : 'Track margins by product and location to maximise profitability across every Lille neighbourhood.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan de factures fournisseurs' : 'Supplier invoice scanning',
      desc: isFr
        ? 'Scannez vos factures en quelques secondes pour mettre à jour votre stock automatiquement sans saisie manuelle.'
        : 'Scan invoices in seconds to update your inventory automatically, no manual entry needed.',
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
              <span style={{ color: ORANGE }}>Lille</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Lillois' : 'Lille Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Lille</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Lille</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées à la Braderie, au marché de Wazemmes et aux événements de la Métropole Européenne de Lille. Réduisez le gaspillage et maximisez vos ventes.'
                : 'Real-time inventory, AI predictions adapted to the Braderie, Wazemmes market and Lille Métropole events. Cut waste and maximise sales.'}
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
                    {isFr ? 'Lille : un marché food truck en pleine croissance' : 'Lille: a food truck market in full growth'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Capitale des Hauts-de-France et ville européenne à moins de 2 heures de Paris, Londres et Bruxelles, Lille combine un marché local dense — avec 100 000 étudiants, une scène street food dynamique autour de Wazemmes — et des pics touristiques majeurs comme la Braderie annuelle qui attire 2 millions de visiteurs en un week-end. Pour les food truckers, cette dualité est une opportunité : des revenus réguliers en semaine et des pics spectaculaires lors des événements. FoodTracks est conçu pour gérer ces deux réalités avec précision.'
                      : 'Capital of Hauts-de-France and a European city less than 2 hours from Paris, London, and Brussels, Lille combines a dense local market — with 100,000 students, a vibrant street food scene around Wazemmes — and major tourist peaks like the annual Braderie which attracts 2 million visitors in one weekend. For food truckers, this duality is an opportunity: steady weekday revenue and spectacular spikes during events. FoodTracks is built to manage both realities with precision.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '2M',
                    label: isFr ? 'visiteurs Braderie' : 'Braderie visitors',
                    sub: isFr ? 'Pic annuel à anticiper' : 'Annual peak to plan for',
                  },
                  {
                    stat: '100k',
                    label: isFr ? 'étudiants' : 'students',
                    sub: isFr ? 'Clientèle régulière et prévisible' : 'Regular, predictable clientele',
                  },
                  {
                    stat: '3j/sem',
                    label: isFr ? 'marché de Wazemmes' : 'Wazemmes market',
                    sub: isFr ? 'Emplacement clé du Nord' : 'Key spot in northern France',
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
                ? 'Tout ce dont votre food truck lillois a besoin'
                : 'Everything your Lille food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour les contraintes uniques de Lille et du Nord.'
                : 'A complete platform, designed for the unique constraints of Lille and northern France.'}
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
              <Link href={`/${locale}/ville/paris`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Paris' : 'FoodTracks in Paris'}
              </Link>
              <Link href={`/${locale}/ville/strasbourg`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Strasbourg' : 'FoodTracks in Strasbourg'}
              </Link>
              <Link href={`/${locale}/ville/lyon`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Lyon' : 'FoodTracks in Lyon'}
              </Link>
              <Link href={`/${locale}/ville/bordeaux`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Bordeaux' : 'FoodTracks in Bordeaux'}
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
              {isFr ? 'Questions fréquentes — Lille' : 'FAQ — Lille'}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Lille</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Lille</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers lillois qui utilisent FoodTracks pour vendre plus et gaspiller moins, de Wazemmes à la Braderie.'
                : 'Join Lille food truckers using FoodTracks to sell more and waste less, from Wazemmes to the Braderie.'}
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
