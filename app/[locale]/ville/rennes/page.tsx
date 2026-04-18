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
    ? 'Logiciel Gestion Food Truck Rennes — Marché des Lices & Campus'
    : 'Food Truck Management Software Rennes — Lices Market & Campus';
  const description = isFr
    ? 'Gérez votre food truck à Rennes avec FoodTracks : stock en temps réel, prédictions IA adaptées aux Trans Musicales, au marché des Lices et au calendrier étudiant. Plan gratuit disponible.'
    : 'Manage your Rennes food truck with FoodTracks: real-time inventory, AI predictions adapted to Trans Musicales, Lices market and the student calendar. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Rennes',
          'application food truck Rennes',
          'gestion stock food truck Rennes',
          'prédictions ventes food truck Rennes',
          'logiciel restauration mobile Rennes',
          'food truck Bretagne',
        ]
      : [
          'food truck management software Rennes',
          'food truck app Rennes',
          'food truck inventory Rennes',
          'food truck sales forecasting Rennes',
          'mobile catering software Rennes France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/rennes`,
      languages: {
        fr: `${BASE_URL}/fr/ville/rennes`,
        en: `${BASE_URL}/en/ville/rennes`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/rennes`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Rennes' }],
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

export default async function RennesFoodTruckPage({
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
    name: 'FoodTracks — Rennes',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Rennes et en Bretagne.'
      : 'Management software for food trucks operating in Rennes and Brittany.',
    url: `${BASE_URL}/${locale}/ville/rennes`,
    areaServed: {
      '@type': 'City',
      name: 'Rennes',
      sameAs: 'https://www.wikidata.org/wiki/Q647',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/rennes` },
      { '@type': 'ListItem', position: 3, name: 'Rennes', item: `${BASE_URL}/${locale}/ville/rennes` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs emplacements pour un food truck à Rennes ?',
          a: 'Rennes offre plusieurs emplacements stratégiques : le marché des Lices (samedi matin, l\'un des plus grands de France), la place Sainte-Anne, la place du Parlement, le campus de Beaulieu, Villejean et Ker Lann, et les zones d\'activité de la Courrouze et Atalante. FoodTracks analyse vos ventes par emplacement pour identifier les plus rentables.',
        },
        {
          q: 'Comment gérer les pics liés aux Trans Musicales et aux festivals rennais ?',
          a: 'Les Trans Musicales en décembre, les Tombées de la Nuit en été, Mythos et Yaouank créent des afflux exceptionnels. FoodTracks intègre ces événements dans ses prédictions pour ajuster vos commandes fournisseurs et éviter ruptures comme gaspillage.',
        },
        {
          q: 'FoodTracks est-il adapté au marché des Lices ?',
          a: 'Oui. Le marché des Lices le samedi matin attire jusqu\'à 10 000 visiteurs — FoodTracks gère votre stock en temps réel, prédit la demande en fonction de la météo et du calendrier, et synchronise plusieurs emplacements si vous êtes aussi présent en semaine.',
        },
        {
          q: 'Comment optimiser mon stock pour le calendrier étudiant rennais ?',
          a: 'Avec plus de 66 000 étudiants à Rennes 1 et Rennes 2, le calendrier universitaire influence fortement la demande sur les campus et en centre-ville. FoodTracks tient compte des périodes de cours, d\'examens et de vacances pour ajuster vos prédictions.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck rennais ?',
          a: 'FoodTracks propose un plan gratuit complet pour démarrer, sans carte de crédit. Les plans payants incluent les prédictions IA avancées, le scan de factures illimité et le support prioritaire — adapté à tous les budgets.',
        },
      ]
    : [
        {
          q: 'What are the best locations for a food truck in Rennes?',
          a: 'Rennes offers several strategic spots: Lices market (Saturday morning, one of France\'s largest), Place Sainte-Anne, Place du Parlement, Beaulieu and Villejean campuses, Ker Lann, and the Courrouze / Atalante business districts. FoodTracks analyses your sales by location to identify the most profitable ones.',
        },
        {
          q: 'How do I manage peaks during Trans Musicales and Rennes festivals?',
          a: 'Trans Musicales in December, Tombées de la Nuit in summer, Mythos and Yaouank drive exceptional footfall. FoodTracks factors these events into its predictions to adjust supplier orders — avoiding both stockouts and waste.',
        },
        {
          q: 'Is FoodTracks suited to Lices market food trucks?',
          a: 'Yes. Lices market on Saturday morning draws up to 10,000 visitors — FoodTracks manages real-time inventory, predicts demand based on weather and calendar, and syncs multiple locations if you also trade during the week.',
        },
        {
          q: 'How do I optimise stock for the Rennes student calendar?',
          a: 'With over 66,000 students across Rennes 1 and Rennes 2, the university calendar strongly influences demand on campuses and in the city centre. FoodTracks factors term times, exams and holidays into predictions.',
        },
        {
          q: 'How much does FoodTracks cost for a Rennes food truck?',
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
      title: isFr ? 'Multi-emplacements rennais' : 'Multiple Rennes locations',
      desc: isFr
        ? 'Gérez marchés, places, campus et zones d\'activité avec un stock centralisé.'
        : 'Manage markets, squares, campuses and business districts with centralised inventory.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions événements & saison' : 'Event & seasonal forecasting',
      desc: isFr
        ? 'L\'IA intègre les Trans Musicales, les Tombées de la Nuit et le calendrier étudiant.'
        : 'AI factors in Trans Musicales, Tombées de la Nuit and the student calendar.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro rupture de stock' : 'Zero stockouts',
      desc: isFr
        ? 'Alertes proactives avant le marché des Lices et les gros événements pour ne jamais manquer d\'ingrédients clés.'
        : 'Proactive alerts before Lices market and major events so you never run out of key ingredients.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse de rentabilité' : 'Profitability analysis',
      desc: isFr
        ? 'Suivez vos marges par produit et par emplacement pour maximiser votre rentabilité à Rennes.'
        : 'Track margins by product and location to maximise profitability across Rennes.',
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
              <span style={{ color: ORANGE }}>Rennes</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Rennais' : 'Rennes Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Rennes</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Rennes</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées aux festivals rennais et au calendrier étudiant. Réduisez le gaspillage et maximisez vos ventes — du marché des Lices au campus de Beaulieu.'
                : 'Real-time inventory, AI predictions adapted to Rennes festivals and the student calendar. Cut waste and maximise sales — from Lices market to Beaulieu campus.'}
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
                  style={{ backgroundColor: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.20)' }}
                >
                  <Compass className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Rennes : capitale étudiante et bretonne' : 'Rennes: student capital of Brittany'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Capitale de la Bretagne, Rennes réunit un centre médiéval animé, deux grandes universités et une scène culturelle dense — Trans Musicales, Tombées de la Nuit, Mythos. Du marché des Lices (l\'un des plus grands de France) aux campus de Beaulieu et Villejean, en passant par la technopole Atalante, la demande varie selon la saison, les examens et les gros événements. FoodTracks prédit ces variations et optimise vos opérations quotidiennes.'
                      : 'Brittany\'s capital, Rennes combines a buzzing medieval centre, two major universities and a dense cultural scene — Trans Musicales, Tombées de la Nuit, Mythos. From Lices market (one of France\'s largest) to Beaulieu and Villejean campuses, through the Atalante technopole, demand shifts with seasons, exams and major events. FoodTracks predicts these variations and optimises your daily operations.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '66k+',
                    label: isFr ? 'étudiants' : 'students',
                    sub: isFr ? 'Rennes 1 & Rennes 2' : 'Rennes 1 & Rennes 2',
                  },
                  {
                    stat: '10k',
                    label: isFr ? 'visiteurs aux Lices' : 'visitors at Lices',
                    sub: isFr ? 'Chaque samedi matin' : 'Every Saturday morning',
                  },
                  {
                    stat: 'Trans',
                    label: isFr ? 'Musicales & festivals' : 'Musicales & festivals',
                    sub: isFr ? 'Scène culturelle unique' : 'Unique cultural scene',
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
                ? 'Tout ce dont votre food truck rennais a besoin'
                : 'Everything your Rennes food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour les contraintes uniques de Rennes.'
                : 'A complete platform, designed for the unique constraints of Rennes.'}
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
                href={`/${locale}/ville/nantes`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Nantes' : 'FoodTracks in Nantes'}
              </Link>
              <Link
                href={`/${locale}/ville/bordeaux`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Bordeaux' : 'FoodTracks in Bordeaux'}
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
              {isFr ? 'Questions fréquentes — Rennes' : 'FAQ — Rennes'}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Rennes</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Rennes</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers rennais qui utilisent FoodTracks pour vendre plus et gaspiller moins.'
                : 'Join Rennes food truckers using FoodTracks to sell more and waste less.'}
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
