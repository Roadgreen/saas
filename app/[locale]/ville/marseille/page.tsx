import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star, Sun,
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
    ? 'Logiciel Gestion Food Truck Marseille — Vieux-Port & Événements'
    : 'Food Truck Management Software Marseille — Old Port & Events';
  const description = isFr
    ? 'Gérez votre food truck à Marseille avec FoodTracks : stock en temps réel, prédictions IA adaptées au Vieux-Port, aux calanques et aux événements provençaux. Gratuit.'
    : 'Manage your Marseille food truck with FoodTracks: real-time inventory, AI predictions adapted to the Old Port, calanques and Provençal events. Free plan.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Marseille',
          'application food truck Marseille',
          'gestion stock food truck Marseille',
          'prédictions ventes food truck Marseille',
          'logiciel restauration mobile Marseille',
          'food truck Provence-Alpes-Côte d\'Azur',
        ]
      : [
          'food truck management software Marseille',
          'food truck app Marseille',
          'food truck inventory Marseille',
          'food truck sales forecasting Marseille',
          'mobile catering software Marseille France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/marseille`,
      languages: {
        fr: `${BASE_URL}/fr/ville/marseille`,
        en: `${BASE_URL}/en/ville/marseille`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/marseille`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Marseille' }],
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

export default async function MarseilleFoodTruckPage({
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
    name: 'FoodTracks — Marseille',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Marseille et en Provence-Alpes-Côte d\'Azur.'
      : 'Management software for food trucks operating in Marseille and Provence-Alpes-Côte d\'Azur.',
    url: `${BASE_URL}/${locale}/ville/marseille`,
    areaServed: {
      '@type': 'City',
      name: 'Marseille',
      sameAs: 'https://www.wikidata.org/wiki/Q2634',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/marseille` },
      { '@type': 'ListItem', position: 3, name: 'Marseille', item: `${BASE_URL}/${locale}/ville/marseille` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs emplacements pour un food truck à Marseille ?',
          a: 'Marseille regorge d\'emplacements stratégiques : le Vieux-Port et ses quais, les marchés de Noailles et du Cours Julien, les plages du Prado, le quartier de la Joliette et le Mucem. FoodTracks analyse vos ventes par emplacement pour identifier les spots les plus rentables.',
        },
        {
          q: 'Comment anticiper la saisonnalité touristique à Marseille ?',
          a: 'Marseille connaît un afflux massif en été avec les plages et les calanques, puis des pics lors de la Foire de Marseille, Fiesta des Suds et des matchs à l\'Orange Vélodrome. FoodTracks intègre ces données dans ses prédictions IA pour ajuster vos commandes fournisseurs.',
        },
        {
          q: 'FoodTracks fonctionne-t-il pour les food trucks des marchés provençaux ?',
          a: 'Absolument. Que vous soyez sur le marché du Prado le samedi ou aux Terrasses du Port, FoodTracks gère plusieurs emplacements, synchronise votre stock en temps réel et fournit des prédictions de ventes par lieu et par jour.',
        },
        {
          q: 'Comment gérer mon stock pour les grands événements marseillais ?',
          a: 'La Foire de Marseille, le Mondial La Marseillaise à Pétanque ou la Fiesta des Suds génèrent des volumes exceptionnels. FoodTracks anticipe ces pics et vous envoie des alertes pour commander suffisamment sans sur-stocker.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck marseillais ?',
          a: 'FoodTracks propose un plan gratuit complet pour démarrer, sans carte de crédit. Les plans payants incluent les prédictions IA avancées, le scan de factures illimité et le support prioritaire — adapté à tous les budgets.',
        },
      ]
    : [
        {
          q: 'What are the best locations for a food truck in Marseille?',
          a: 'Marseille is full of strategic spots: the Old Port and its quays, Noailles and Cours Julien markets, Prado beaches, La Joliette district and the Mucem. FoodTracks analyses your sales by location to identify the most profitable spots.',
        },
        {
          q: 'How do I handle tourist seasonality in Marseille?',
          a: 'Marseille sees a massive summer influx with beaches and calanques, then peaks during the Foire de Marseille, Fiesta des Suds and Orange Vélodrome match days. FoodTracks factors these into its AI predictions to adjust your supplier orders.',
        },
        {
          q: 'Does FoodTracks work for Provençal market food trucks?',
          a: 'Absolutely. Whether you trade at the Prado market on Saturdays or at Terrasses du Port, FoodTracks manages multiple locations, syncs your inventory in real time and provides sales predictions by location and day.',
        },
        {
          q: 'How do I manage stock for major Marseille events?',
          a: 'The Foire de Marseille, Mondial La Marseillaise à Pétanque or Fiesta des Suds generate exceptional volumes. FoodTracks anticipates these peaks and sends alerts to order enough without over-stocking.',
        },
        {
          q: 'How much does FoodTracks cost for a Marseille food truck?',
          a: 'FoodTracks offers a full free plan to get started, no credit card needed. Paid plans include advanced AI predictions, unlimited invoice scanning and priority support — suitable for every budget.',
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
      title: isFr ? 'Multi-emplacements marseillais' : 'Multiple Marseille locations',
      desc: isFr
        ? 'Gérez Vieux-Port, marchés, plages et événements avec un stock centralisé.'
        : 'Manage Old Port, markets, beaches and events with centralised inventory.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions climat & saison' : 'Climate & seasonal forecasting',
      desc: isFr
        ? 'L\'IA adapte ses prédictions au climat méditerranéen, aux afflux touristiques et aux fêtes locales.'
        : 'AI adapts predictions to Mediterranean climate, tourist flows and local festivals.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro rupture de stock' : 'Zero stockouts',
      desc: isFr
        ? 'Alertes proactives avant les marchés et festivals pour ne jamais manquer d\'ingrédients clés.'
        : 'Proactive alerts before markets and festivals so you never run out of key ingredients.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse de rentabilité' : 'Profitability analysis',
      desc: isFr
        ? 'Suivez vos marges par produit et par emplacement pour maximiser votre rentabilité à Marseille.'
        : 'Track margins by product and location to maximise profitability across Marseille.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan de factures fournisseurs' : 'Supplier invoice scanning',
      desc: isFr
        ? 'Scannez vos factures en quelques secondes pour mettre à jour votre stock automatiquement.'
        : 'Scan invoices in seconds to update your inventory automatically.',
    },
    {
      icon: <Star className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Plan gratuit sans limite' : 'Unlimited free plan',
      desc: isFr
        ? 'Commencez gratuitement sans carte de crédit. Évoluez quand votre activité grandit.'
        : 'Start free with no credit card. Upgrade as your business grows.',
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LandingHeader />

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
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
              <span style={{ color: ORANGE }}>Marseille</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Marseillais' : 'Marseille Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Marseille</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Marseille</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées au climat méditerranéen et aux événements marseillais. Réduisez le gaspillage et maximisez vos ventes — du Vieux-Port aux plages du Prado.'
                : 'Real-time inventory, AI predictions adapted to Mediterranean climate and Marseille events. Cut waste and maximise sales — from the Old Port to Prado beaches.'}
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

      {/* ══════════════════════════════════════
          LOCAL CONTEXT
          ══════════════════════════════════════ */}
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
                  <Sun className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Marseille : le food truck au cœur de la Méditerranée' : 'Marseille: food trucks at the heart of the Mediterranean'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Deuxième ville de France avec plus de 5 millions de touristes par an, Marseille offre un terrain exceptionnel pour les food trucks. Du Vieux-Port aux calanques, en passant par les marchés du Cours Julien et de Noailles, la demande varie fortement selon la saison, la météo et les événements — Foire de Marseille, Fiesta des Suds, MP2025. FoodTracks prédit la demande, optimise vos stocks et maximise vos ventes sur chaque emplacement.'
                      : 'France\'s second city with over 5 million tourists a year, Marseille offers exceptional ground for food trucks. From the Old Port to the calanques, through Cours Julien and Noailles markets, demand varies sharply by season, weather and events — Foire de Marseille, Fiesta des Suds, MP2025. FoodTracks predicts demand, optimises stock and maximises sales at every location.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '5M+',
                    label: isFr ? 'touristes / an' : 'tourists / year',
                    sub: isFr ? 'Forte saisonnalité méditerranéenne' : 'Strong Mediterranean seasonality',
                  },
                  {
                    stat: '60+',
                    label: isFr ? 'marchés hebdomadaires' : 'weekly markets',
                    sub: isFr ? 'Du Vieux-Port à la Joliette' : 'From Old Port to La Joliette',
                  },
                  {
                    stat: '2e',
                    label: isFr ? 'ville de France' : 'city in France',
                    sub: isFr ? 'Marché food truck en plein essor' : 'Booming food truck market',
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

      {/* ══════════════════════════════════════
          BENEFITS
          ══════════════════════════════════════ */}
      <section id="fonctionnalites" className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {isFr
                ? 'Tout ce dont votre food truck marseillais a besoin'
                : 'Everything your Marseille food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour les contraintes uniques de Marseille.'
                : 'A complete platform, designed for the unique constraints of Marseille.'}
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

      {/* ══════════════════════════════════════
          INTERNAL LINKS
          ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-4">{isFr ? 'Fonctionnalités clés' : 'Key features'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/fonctionnalites/gestion-stock`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Gestion de stock en temps réel' : 'Real-time inventory management'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/predictions-ventes`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Prédictions de ventes IA' : 'AI sales forecasting'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/scan-factures`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Scan de factures' : 'Invoice scanning'}
              </Link>
              <Link
                href={`/${locale}/ville/paris`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Paris' : 'FoodTracks in Paris'}
              </Link>
              <Link
                href={`/${locale}/ville/toulouse`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Toulouse' : 'FoodTracks in Toulouse'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
              {isFr ? 'Questions fréquentes — Marseille' : 'FAQ — Marseille'}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {faqData.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════ */}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Marseille</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Marseille</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers marseillais qui utilisent FoodTracks pour vendre plus et gaspiller moins.'
                : 'Join Marseille food truckers using FoodTracks to sell more and waste less.'}
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

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
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
