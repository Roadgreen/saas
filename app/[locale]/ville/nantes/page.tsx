import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star, Compass,
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
    ? 'Logiciel Gestion Food Truck Nantes — Île de Nantes & Marchés'
    : 'Food Truck Management Software Nantes — Île de Nantes & Markets';
  const description = isFr
    ? 'Gérez votre food truck à Nantes avec FoodTracks : stock en temps réel, prédictions IA adaptées aux événements nantais et aux marchés locaux. Plan gratuit disponible.'
    : 'Manage your Nantes food truck with FoodTracks: real-time inventory, AI predictions adapted to Nantes events and local markets. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Nantes',
          'application food truck Nantes',
          'gestion stock food truck Nantes',
          'prédictions ventes food truck Nantes',
          'logiciel restauration mobile Nantes',
          'food truck Pays de la Loire',
        ]
      : [
          'food truck management software Nantes',
          'food truck app Nantes',
          'food truck inventory Nantes',
          'food truck sales forecasting Nantes',
          'mobile catering software Nantes France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/nantes`,
      languages: {
        fr: `${BASE_URL}/fr/ville/nantes`,
        en: `${BASE_URL}/en/ville/nantes`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/nantes`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Nantes' }],
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

export default async function NantesFoodTruckPage({
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
    name: 'FoodTracks — Nantes',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Nantes et en Pays de la Loire.'
      : 'Management software for food trucks operating in Nantes and Pays de la Loire.',
    url: `${BASE_URL}/${locale}/ville/nantes`,
    areaServed: {
      '@type': 'City',
      name: 'Nantes',
      sameAs: 'https://www.wikidata.org/wiki/Q12191',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/nantes` },
      { '@type': 'ListItem', position: 3, name: 'Nantes', item: `${BASE_URL}/${locale}/ville/nantes` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs emplacements pour un food truck à Nantes ?',
          a: 'Nantes offre de nombreux emplacements stratégiques : le marché de Talensac, les quais de l\'Erdre, l\'île de Nantes, le quartier Bouffay, le Hangar à Bananes et les abords des campus universitaires. FoodTracks analyse vos ventes par emplacement pour identifier les plus rentables.',
        },
        {
          q: 'Comment gérer les pics liés aux événements culturels nantais ?',
          a: 'Le Voyage à Nantes en été, La Folle Journée en janvier, les Rendez-vous de l\'Erdre et les spectacles de Royal de Luxe créent des afflux exceptionnels. FoodTracks intègre ces événements dans ses prédictions pour ajuster vos commandes fournisseurs.',
        },
        {
          q: 'FoodTracks est-il adapté aux food trucks des marchés nantais ?',
          a: 'Oui. Que vous soyez au marché de Talensac le week-end ou sur un marché de quartier, FoodTracks gère plusieurs emplacements, synchronise votre stock en temps réel et fournit des prédictions de ventes par lieu et par jour.',
        },
        {
          q: 'Comment optimiser mon stock pour la saison universitaire ?',
          a: 'Avec plus de 60 000 étudiants, le calendrier universitaire influence fortement la demande à Nantes. FoodTracks tient compte des périodes de cours, d\'examens et de vacances pour ajuster vos prédictions et éviter le gaspillage.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck nantais ?',
          a: 'FoodTracks propose un plan gratuit complet pour démarrer, sans carte de crédit. Les plans payants incluent les prédictions IA avancées, le scan de factures illimité et le support prioritaire — adapté à tous les budgets.',
        },
      ]
    : [
        {
          q: 'What are the best locations for a food truck in Nantes?',
          a: 'Nantes offers many strategic spots: Talensac market, the Erdre quays, Île de Nantes, Bouffay district, Hangar à Bananes and university campus areas. FoodTracks analyses your sales by location to identify the most profitable ones.',
        },
        {
          q: 'How do I manage peaks during Nantes cultural events?',
          a: 'Le Voyage à Nantes in summer, La Folle Journée in January, Rendez-vous de l\'Erdre and Royal de Luxe shows create exceptional crowds. FoodTracks factors these events into its predictions to adjust your supplier orders.',
        },
        {
          q: 'Is FoodTracks suited to Nantes market food trucks?',
          a: 'Yes. Whether you trade at Talensac market on weekends or neighbourhood markets, FoodTracks manages multiple locations, syncs your inventory in real time and provides sales predictions by location and day.',
        },
        {
          q: 'How do I optimise stock for the university season?',
          a: 'With over 60,000 students, the university calendar strongly influences demand in Nantes. FoodTracks accounts for term times, exams and holidays to adjust your predictions and avoid waste.',
        },
        {
          q: 'How much does FoodTracks cost for a Nantes food truck?',
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
      title: isFr ? 'Multi-emplacements nantais' : 'Multiple Nantes locations',
      desc: isFr
        ? 'Gérez marchés, quais, événements et campus avec un stock centralisé.'
        : 'Manage markets, quays, events and campuses with centralised inventory.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions événements & saison' : 'Event & seasonal forecasting',
      desc: isFr
        ? 'L\'IA intègre Le Voyage à Nantes, La Folle Journée et le calendrier universitaire.'
        : 'AI factors in Le Voyage à Nantes, La Folle Journée and the university calendar.',
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
        ? 'Suivez vos marges par produit et par emplacement pour maximiser votre rentabilité à Nantes.'
        : 'Track margins by product and location to maximise profitability across Nantes.',
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
              <span style={{ color: ORANGE }}>Nantes</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Nantais' : 'Nantes Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Nantes</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Nantes</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées aux événements nantais et au calendrier culturel. Réduisez le gaspillage et maximisez vos ventes — de Talensac à l\'île de Nantes.'
                : 'Real-time inventory, AI predictions adapted to Nantes events and cultural calendar. Cut waste and maximise sales — from Talensac to Île de Nantes.'}
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
                  style={{ backgroundColor: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.20)' }}
                >
                  <Compass className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Nantes : créativité et street food à l\'ouest' : 'Nantes: creativity and street food in the west'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Sixième ville de France, Nantes est reconnue pour sa créativité — les Machines de l\'île, le Voyage à Nantes, Royal de Luxe — et une scène food truck en plein essor. Du marché de Talensac aux quais de l\'Erdre, en passant par l\'île de Nantes et le Hangar à Bananes, la demande varie selon la saison, les événements culturels et le calendrier universitaire. FoodTracks prédit ces variations et optimise vos opérations quotidiennes.'
                      : 'France\'s sixth city, Nantes is renowned for its creativity — Machines de l\'île, Le Voyage à Nantes, Royal de Luxe — and a booming food truck scene. From Talensac market to the Erdre quays, through Île de Nantes and Hangar à Bananes, demand shifts with seasons, cultural events and the university calendar. FoodTracks predicts these variations and optimises your daily operations.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '3M+',
                    label: isFr ? 'visiteurs / an' : 'visitors / year',
                    sub: isFr ? 'Destination en forte croissance' : 'Fast-growing destination',
                  },
                  {
                    stat: '40+',
                    label: isFr ? 'marchés hebdomadaires' : 'weekly markets',
                    sub: isFr ? 'Du Talensac au Bouffay' : 'From Talensac to Bouffay',
                  },
                  {
                    stat: '6e',
                    label: isFr ? 'ville de France' : 'city in France',
                    sub: isFr ? 'Scène food truck dynamique' : 'Dynamic food truck scene',
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
                ? 'Tout ce dont votre food truck nantais a besoin'
                : 'Everything your Nantes food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour les contraintes uniques de Nantes.'
                : 'A complete platform, designed for the unique constraints of Nantes.'}
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
                href={`/${locale}/ville/bordeaux`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Bordeaux' : 'FoodTracks in Bordeaux'}
              </Link>
              <Link
                href={`/${locale}/ville/marseille`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Marseille' : 'FoodTracks in Marseille'}
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
              {isFr ? 'Questions fréquentes — Nantes' : 'FAQ — Nantes'}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Nantes</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Nantes</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers nantais qui utilisent FoodTracks pour vendre plus et gaspiller moins.'
                : 'Join Nantes food truckers using FoodTracks to sell more and waste less.'}
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
