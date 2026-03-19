import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChefHat, ArrowRight, CheckCircle2, TrendingUp, Package,
  BarChart3, ChevronDown, MapPin, FileText, Brain, Shield,
  Clock, Calculator,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const DARK = '#0D0905';
const TEAL = '#14B8A6';
const GREEN = '#22C55E';

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
    ? 'Guide complet gestion food truck 2026 | FoodTracks'
    : 'Complete Food Truck Management Guide 2026 | FoodTracks';
  const description = isFr
    ? 'Guide complet pour gérer votre food truck en 2026 : gestion des stocks, comptabilité, emplacements, prévisions de ventes, réglementation et outils. Tout ce qu\'il faut savoir pour optimiser et rentabiliser votre activité.'
    : 'Complete guide to managing your food truck in 2026: inventory management, accounting, locations, sales forecasting, regulations and tools. Everything you need to optimize and profitize your business.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'gestion food truck',
          'gérer food truck',
          'management food truck',
          'gestion stock food truck',
          'comptabilité food truck',
          'emplacement food truck',
          'prévision ventes food truck',
          'réglementation food truck',
          'logiciel gestion food truck',
          'rentabilité food truck',
          'guide food truck 2026',
        ]
      : [
          'food truck management',
          'manage food truck',
          'food truck inventory management',
          'food truck accounting',
          'food truck locations',
          'food truck sales forecasting',
          'food truck regulations',
          'food truck management software',
          'food truck profitability',
          'food truck guide 2026',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/guides/gestion-food-truck`,
      languages: {
        fr: `${BASE_URL}/fr/guides/gestion-food-truck`,
        en: `${BASE_URL}/en/guides/gestion-food-truck`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/guides/gestion-food-truck`,
      siteName: 'FoodTracks',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: isFr
            ? 'Guide complet gestion food truck 2026'
            : 'Complete food truck management guide 2026',
        },
      ],
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

export default async function GestionFoodTruckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  /* ─── Schema.org ─────────────────────────────────────────── */

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: isFr ? 'Guides' : 'Guides',
        item: `${BASE_URL}/${locale}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: isFr ? 'Gestion food truck' : 'Food truck management',
        item: `${BASE_URL}/${locale}/guides/gestion-food-truck`,
      },
    ],
  };

  const faqItems = isFr
    ? [
        {
          question: 'Comment gérer efficacement un food truck au quotidien ?',
          answer:
            'Une gestion efficace au quotidien repose sur quatre piliers : un suivi de stock en temps réel pour éviter les ruptures et le gaspillage, des prévisions de ventes pour anticiper les quantités à préparer, une comptabilité tenue à jour, et un planning d\'emplacements optimisé. Des outils comme FoodTracks automatisent la majorité de ces tâches en connectant votre terminal de paiement SumUp à votre gestion de stock.',
        },
        {
          question: 'Quels sont les documents obligatoires pour ouvrir un food truck ?',
          answer:
            'Pour ouvrir un food truck en France, vous devez disposer : d\'un permis de conduire B ou C selon le poids du véhicule, d\'un permis d\'exploitation (si vente d\'alcool), d\'une formation HACCP obligatoire, d\'une assurance RC professionnelle, d\'une immatriculation au RCS ou à la chambre des métiers, d\'une autorisation d\'occupation du domaine public pour les emplacements sur la voie publique, et d\'une déclaration à la DDPP (Direction Départementale de la Protection des Populations).',
        },
        {
          question: 'Comment trouver des emplacements rentables pour son food truck ?',
          answer:
            'Pour trouver des emplacements rentables, ciblez les zones à fort passage piéton (marchés, bureaux, universités, événements), analysez vos données de ventes passées par emplacement pour identifier les plus performants, participez aux festivals et événements locaux, et négociez des contrats réguliers avec des entreprises ou des zones industrielles. FoodTracks vous permet de comparer la rentabilité de chaque emplacement pour orienter vos décisions.',
        },
        {
          question: 'Combien coûte la gestion d\'un food truck par mois ?',
          answer:
            'Les charges mensuelles d\'un food truck comprennent : le leasing ou remboursement du véhicule (300–800€), l\'assurance professionnelle (100–200€), le carburant et entretien (200–400€), les approvisionnements en matières premières (variable selon CA), les charges sociales (400–1 200€ selon statut), les autorisations d\'emplacement (50–500€ selon les marchés), et les logiciels de gestion (0–100€). Au total, les charges fixes représentent généralement 2 000 à 4 000€/mois selon la taille de l\'activité.',
        },
        {
          question: 'Comment suivre la comptabilité de son food truck simplement ?',
          answer:
            'La comptabilité d\'un food truck peut être simplifiée avec trois outils : un terminal de paiement comme SumUp qui centralise toutes les ventes, un logiciel de gestion comme FoodTracks qui importe automatiquement les ventes et scanne les factures fournisseurs, et un comptable ou logiciel comptable pour la déclaration annuelle. FoodTracks génère des rapports de chiffre d\'affaires, de marge par produit et de coûts matières directement exploitables.',
        },
        {
          question: 'Quel logiciel de gestion choisir pour son food truck ?',
          answer:
            'Un bon logiciel de gestion food truck doit intégrer : la gestion de stock en temps réel, les prévisions de ventes par IA, le scan de factures fournisseurs, la connexion à votre caisse (SumUp, Square), et des rapports de rentabilité par emplacement. FoodTracks est spécialisé food truck et intègre toutes ces fonctionnalités dans une seule application, disponible gratuitement. Des alternatives existent comme Inpulse ou des solutions généralistes, mais elles sont moins adaptées aux spécificités du food truck.',
        },
      ]
    : [
        {
          question: 'How do you efficiently manage a food truck on a daily basis?',
          answer:
            'Efficient daily management rests on four pillars: real-time inventory tracking to avoid stockouts and waste, sales forecasting to anticipate quantities to prepare, up-to-date accounting, and an optimized location schedule. Tools like FoodTracks automate most of these tasks by connecting your SumUp payment terminal to your inventory management.',
        },
        {
          question: 'What documents are required to open a food truck?',
          answer:
            'To operate a food truck in France, you need: a B or C driving license depending on vehicle weight, an operating permit (if selling alcohol), mandatory HACCP food safety training, professional liability insurance, registration with the trade registry, a public space occupation permit for street locations, and a declaration to the DDPP (Departmental Directorate for Consumer Affairs). Requirements vary by country — always check local regulations.',
        },
        {
          question: 'How do you find profitable locations for a food truck?',
          answer:
            'To find profitable locations, target high foot-traffic zones (markets, offices, universities, events), analyze your past sales data by location to identify the best performers, participate in local festivals and events, and negotiate regular contracts with companies or industrial zones. FoodTracks lets you compare profitability by location to guide your decisions.',
        },
        {
          question: 'How much does running a food truck cost per month?',
          answer:
            'Monthly food truck expenses include: vehicle lease or loan repayment (€300–800), professional insurance (€100–200), fuel and maintenance (€200–400), food supplies (variable), social charges (€400–1,200 depending on status), location permits (€50–500), and management software (€0–100). Fixed costs typically total €2,000–4,000/month depending on business size.',
        },
        {
          question: 'How do you handle food truck accounting simply?',
          answer:
            'Food truck accounting can be simplified with three tools: a payment terminal like SumUp that centralizes all sales, management software like FoodTracks that automatically imports sales data and scans supplier invoices, and an accountant or accounting software for annual tax filings. FoodTracks generates revenue reports, per-product margin analysis, and ingredient cost breakdowns ready for use.',
        },
        {
          question: 'What management software should you choose for your food truck?',
          answer:
            'Good food truck management software must include: real-time inventory management, AI sales forecasting, supplier invoice scanning, POS integration (SumUp, Square), and profitability reports by location. FoodTracks is specialized for food trucks and integrates all these features in one free app. Alternatives like Inpulse or generic solutions exist but are less adapted to food truck specifics.',
        },
      ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'Guide complet gestion food truck 2026'
      : 'Complete Food Truck Management Guide 2026',
    description: isFr
      ? 'Guide complet pour gérer votre food truck en 2026 : stocks, comptabilité, emplacements, prévisions, réglementation et outils.'
      : 'Complete guide to managing your food truck in 2026: inventory, accounting, locations, forecasting, regulations and tools.',
    datePublished: '2026-01-01',
    dateModified: '2026-03-19',
    author: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/guides/gestion-food-truck`,
    },
    inLanguage: locale,
    image: `${BASE_URL}/og-image.png`,
    about: {
      '@type': 'Thing',
      name: isFr ? 'Gestion de food truck' : 'Food truck management',
    },
    keywords: isFr
      ? 'gestion food truck, gérer food truck, logiciel gestion food truck, stock food truck, comptabilité food truck'
      : 'food truck management, manage food truck, food truck software, food truck inventory, food truck accounting',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  /* ─── Content sections ──────────────────────────────────── */

  const pillars = isFr
    ? [
        {
          icon: <Package className="h-7 w-7" style={{ color: ORANGE }} />,
          color: ORANGE,
          title: 'Gestion des stocks',
          desc: 'Suivre vos matières premières en temps réel, éviter ruptures et gaspillage, scanner vos arrivages.',
          href: `/${locale}/fonctionnalites/gestion-stock`,
          cta: 'En savoir plus',
        },
        {
          icon: <Brain className="h-7 w-7" style={{ color: '#8B5CF6' }} />,
          color: '#8B5CF6',
          title: 'Prévisions de ventes',
          desc: 'Anticiper vos ventes grâce à l\'IA et adapter vos commandes à la météo et à vos emplacements.',
          href: `/${locale}/fonctionnalites/predictions-ventes`,
          cta: 'En savoir plus',
        },
        {
          icon: <FileText className="h-7 w-7" style={{ color: TEAL }} />,
          color: TEAL,
          title: 'Scan de factures',
          desc: 'Numériser vos factures fournisseurs en 2 secondes pour mettre à jour votre stock automatiquement.',
          href: `/${locale}/fonctionnalites/scan-factures`,
          cta: 'En savoir plus',
        },
        {
          icon: <MapPin className="h-7 w-7" style={{ color: '#F59E0B' }} />,
          color: '#F59E0B',
          title: 'Gestion des emplacements',
          desc: 'Comparer la rentabilité de chaque emplacement et optimiser votre planning hebdomadaire.',
          href: `/${locale}/fonctionnalites/gestion-stock`,
          cta: 'En savoir plus',
        },
        {
          icon: <Calculator className="h-7 w-7" style={{ color: GREEN }} />,
          color: GREEN,
          title: 'Seuil de rentabilité',
          desc: 'Calculer votre point mort mensuel et journalier pour savoir combien vendre chaque jour.',
          href: `/${locale}/guides/seuil-rentabilite-food-truck`,
          cta: 'Calculer maintenant',
        },
        {
          icon: <BarChart3 className="h-7 w-7" style={{ color: '#06B6D4' }} />,
          color: '#06B6D4',
          title: 'Suivi comptable',
          desc: 'Exporter vos données de ventes, marges et coûts matières pour votre comptable ou déclaration.',
          href: `/${locale}/fonctionnalites/scan-factures`,
          cta: 'En savoir plus',
        },
      ]
    : [
        {
          icon: <Package className="h-7 w-7" style={{ color: ORANGE }} />,
          color: ORANGE,
          title: 'Inventory Management',
          desc: 'Track raw materials in real time, avoid stockouts and waste, scan incoming deliveries.',
          href: `/${locale}/fonctionnalites/gestion-stock`,
          cta: 'Learn more',
        },
        {
          icon: <Brain className="h-7 w-7" style={{ color: '#8B5CF6' }} />,
          color: '#8B5CF6',
          title: 'Sales Forecasting',
          desc: 'Predict your sales using AI and adapt orders based on weather and locations.',
          href: `/${locale}/fonctionnalites/predictions-ventes`,
          cta: 'Learn more',
        },
        {
          icon: <FileText className="h-7 w-7" style={{ color: TEAL }} />,
          color: TEAL,
          title: 'Invoice Scanning',
          desc: 'Digitize supplier invoices in 2 seconds to automatically update your stock.',
          href: `/${locale}/fonctionnalites/scan-factures`,
          cta: 'Learn more',
        },
        {
          icon: <MapPin className="h-7 w-7" style={{ color: '#F59E0B' }} />,
          color: '#F59E0B',
          title: 'Location Management',
          desc: 'Compare profitability by location and optimize your weekly schedule.',
          href: `/${locale}/fonctionnalites/gestion-stock`,
          cta: 'Learn more',
        },
        {
          icon: <Calculator className="h-7 w-7" style={{ color: GREEN }} />,
          color: GREEN,
          title: 'Break-Even Point',
          desc: 'Calculate your monthly and daily break-even threshold to know how much to sell each day.',
          href: `/${locale}/guides/seuil-rentabilite-food-truck`,
          cta: 'Calculate now',
        },
        {
          icon: <BarChart3 className="h-7 w-7" style={{ color: '#06B6D4' }} />,
          color: '#06B6D4',
          title: 'Accounting Tracking',
          desc: 'Export your sales data, margins and ingredient costs for your accountant or tax filing.',
          href: `/${locale}/fonctionnalites/scan-factures`,
          cta: 'Learn more',
        },
      ];

  const checklist = isFr
    ? [
        'Ouvrez votre session et vérifiez l\'état du stock avant de partir',
        'Scannez vos arrivages fournisseurs pour mettre le stock à jour',
        'Consultez les prévisions IA pour savoir combien préparer',
        'Suivez vos ventes en temps réel depuis l\'application',
        'En fin de service, notez les invendus et le gaspillage',
        'Vérifiez votre chiffre d\'affaires journalier vs votre seuil de rentabilité',
      ]
    : [
        'Open your session and check stock status before heading out',
        'Scan incoming supplier deliveries to update inventory',
        'Check AI forecasts to know how much to prepare',
        'Track your sales in real time from the app',
        'At end of service, log unsold items and waste',
        'Check daily revenue vs your break-even threshold',
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

        {/* ══════════════════════════════════════
            BREADCRUMB
            ══════════════════════════════════════ */}
        <nav className="container mx-auto px-4 pt-6 pb-0" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
                FoodTracks
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/guides`} className="hover:text-gray-700 transition-colors">
                {isFr ? 'Guides' : 'Guides'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {isFr ? 'Gestion food truck' : 'Food truck management'}
            </li>
          </ol>
        </nav>

        {/* ══════════════════════════════════════
            HERO
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 pt-14 pb-10 max-w-4xl">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: '#FFF3E8', color: ORANGE }}
          >
            <ChefHat className="h-4 w-4" />
            {isFr ? 'Guide pilier · Mis à jour mars 2026' : 'Pillar guide · Updated March 2026'}
          </div>

          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {isFr
              ? 'Guide complet de la gestion food truck 2026'
              : 'Complete Food Truck Management Guide 2026'}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
            {isFr
              ? 'Tout ce qu\'il faut savoir pour gérer votre food truck de A à Z : stocks, comptabilité, emplacements, prévisions de ventes, réglementation et outils digitaux. Un guide complet pour 2026, régulièrement mis à jour.'
              : 'Everything you need to know to manage your food truck from A to Z: inventory, accounting, locations, sales forecasting, regulations and digital tools. A comprehensive guide for 2026, regularly updated.'}
          </p>

          {/* TL;DR card */}
          <div
            className="rounded-2xl p-6 border-l-4 mb-10"
            style={{ backgroundColor: '#FFF7ED', borderLeftColor: ORANGE }}
          >
            <p className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <span style={{ color: ORANGE }}>TL;DR</span>
              {isFr ? ' — Ce qu\'il faut retenir' : ' — Key Takeaways'}
            </p>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1.5 list-disc list-inside">
              {isFr ? (
                <>
                  <li>La gestion d&apos;un food truck couvre 6 domaines clés : stock, comptabilité, emplacements, prévisions, réglementation, et outils.</li>
                  <li>Un food truck mal géré perd entre 15 et 30 % de son chiffre d&apos;affaires en gaspillage et ruptures.</li>
                  <li>Les outils digitaux spécialisés (comme FoodTracks) réduisent le temps de gestion de 2 à 4h par semaine.</li>
                  <li>Le seuil de rentabilité moyen d&apos;un food truck se situe entre 3 500 et 5 000 € de CA mensuel.</li>
                  <li>La réglementation française impose formation HACCP, assurance RC pro et autorisation d&apos;emplacement.</li>
                </>
              ) : (
                <>
                  <li>Food truck management covers 6 key areas: inventory, accounting, locations, forecasting, regulations, and tools.</li>
                  <li>A poorly managed food truck loses 15–30% of revenue to waste and stockouts.</li>
                  <li>Specialized digital tools (like FoodTracks) reduce management time by 2–4 hours per week.</li>
                  <li>The average food truck break-even point is €3,500–5,000 in monthly revenue.</li>
                  <li>French regulations require HACCP training, professional liability insurance and location permits.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════
            TABLE OF CONTENTS
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 pb-12 max-w-4xl">
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#F8F6F3', border: '1px solid #E8E2DC' }}
          >
            <h2 className="font-jakarta text-lg font-bold text-gray-900 mb-4">
              {isFr ? 'Sommaire' : 'Table of Contents'}
            </h2>
            <ol className="space-y-2 text-sm text-gray-700">
              {(isFr
                ? [
                    'Gestion des stocks : le fondement de votre food truck',
                    'Comptabilité et suivi financier',
                    'Gestion des emplacements',
                    'Prévisions de ventes et IA',
                    'Réglementation food truck en France',
                    'Outils digitaux recommandés',
                    'Checklist quotidienne du food trucker',
                    'Questions fréquentes',
                  ]
                : [
                    'Inventory Management: the foundation of your food truck',
                    'Accounting and financial tracking',
                    'Location management',
                    'Sales forecasting and AI',
                    'Food truck regulations in France',
                    'Recommended digital tools',
                    'Daily food trucker checklist',
                    'Frequently asked questions',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ backgroundColor: ORANGE }}
                  >
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 1 — STOCK MANAGEMENT
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 pb-14 max-w-4xl">
          <h2
            id="gestion-stocks"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: ORANGE }}
            >
              1
            </span>
            {isFr ? 'Gestion des stocks : le fondement de votre food truck' : 'Inventory Management: the foundation of your food truck'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  La gestion des stocks est l&apos;aspect le plus critique de la gestion d&apos;un food truck. Contrairement à un restaurant traditionnel, vous disposez d&apos;un espace de stockage limité, de produits périssables, et vous ne pouvez pas vous réapprovisionner en milieu de service. <strong>Une mauvaise gestion peut faire perdre 15 à 30 % de votre chiffre d&apos;affaires.</strong>
                </p>
                <h3>Les 5 règles d&apos;or de la gestion de stock food truck</h3>
                <ul>
                  <li><strong>Méthode FIFO (First In, First Out)</strong> : les produits les plus anciens sortent toujours en premier. Étiquetez chaque livraison avec la date de réception.</li>
                  <li><strong>Stock minimum par produit</strong> : définissez un seuil d&apos;alerte pour chaque ingrédient. Dès que vous passez en dessous, vous recevez une notification.</li>
                  <li><strong>Suivi des pertes</strong> : notez systématiquement ce que vous jetez. En quelques semaines, vous identifierez les produits sur-commandés.</li>
                  <li><strong>Synchronisation commandes/planning</strong> : adaptez vos commandes à votre planning d&apos;emplacements. Un festival nécessite 3 fois plus de stock qu&apos;un marché hebdomadaire.</li>
                  <li><strong>Scan des arrivages</strong> : photographiez ou scannez chaque bon de livraison pour mettre votre stock à jour instantanément.</li>
                </ul>
                <p>
                  Avec la fonctionnalité de{' '}
                  <Link href={`/${locale}/fonctionnalites/gestion-stock`} style={{ color: ORANGE }}>
                    gestion de stock FoodTracks
                  </Link>
                  , votre inventaire est mis à jour en temps réel à chaque vente via SumUp. Résultat : nos utilisateurs réduisent leur gaspillage de 25 % dès le premier mois.
                </p>
              </>
            ) : (
              <>
                <p>
                  Inventory management is the most critical aspect of running a food truck. Unlike a traditional restaurant, you have limited storage space, perishable products, and cannot restock mid-service. <strong>Poor management can cost you 15–30% of your revenue.</strong>
                </p>
                <h3>The 5 golden rules of food truck inventory management</h3>
                <ul>
                  <li><strong>FIFO method (First In, First Out)</strong>: older products always go first. Label each delivery with the reception date.</li>
                  <li><strong>Minimum stock per product</strong>: set an alert threshold for each ingredient. When you drop below it, you receive a notification.</li>
                  <li><strong>Waste tracking</strong>: systematically record what you throw away. Within weeks you will identify over-ordered products.</li>
                  <li><strong>Order/schedule synchronization</strong>: adapt orders to your location schedule. A festival needs 3x more stock than a weekly market.</li>
                  <li><strong>Delivery scanning</strong>: photograph or scan each delivery note to update your stock instantly.</li>
                </ul>
                <p>
                  With the{' '}
                  <Link href={`/${locale}/fonctionnalites/gestion-stock`} style={{ color: ORANGE }}>
                    FoodTracks inventory management
                  </Link>{' '}
                  feature, your stock updates in real time with every sale via SumUp. Our users reduce waste by 25% in the first month.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2 — ACCOUNTING
            ══════════════════════════════════════ */}
        <section
          className="py-14 relative"
          style={{ backgroundColor: '#FAFAF8' }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="comptabilite"
              className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
                style={{ backgroundColor: TEAL }}
              >
                2
              </span>
              {isFr ? 'Comptabilité et suivi financier' : 'Accounting and financial tracking'}
            </h2>

            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              {isFr ? (
                <>
                  <p>
                    La comptabilité d&apos;un food truck peut vite devenir chronophage si elle n&apos;est pas bien organisée. Entre les ventes quotidiennes, les achats fournisseurs, les charges fixes et les déclarations fiscales, il est facile de se perdre.
                  </p>
                  <h3>Les indicateurs financiers essentiels à suivre</h3>
                  <ul>
                    <li><strong>Chiffre d&apos;affaires journalier</strong> : montant total des ventes par service et par emplacement.</li>
                    <li><strong>Taux de marge brute</strong> : (CA - coûts matières) ÷ CA. Idéalement entre 65 et 75 % pour un food truck.</li>
                    <li><strong>Coût matières (food cost)</strong> : part des matières premières dans votre CA. À maintenir entre 25 et 35 %.</li>
                    <li><strong>Charges fixes mensuelles</strong> : loyer, leasing, assurances, abonnements — elles ne varient pas avec votre activité.</li>
                    <li><strong>Résultat d&apos;exploitation</strong> : CA - charges variables - charges fixes. C&apos;est votre vraie rentabilité.</li>
                  </ul>
                  <h3>Simplifier sa comptabilité avec les bons outils</h3>
                  <p>
                    La combinaison SumUp + FoodTracks couvre l&apos;essentiel : SumUp enregistre chaque vente, FoodTracks importe les données et{' '}
                    <Link href={`/${locale}/fonctionnalites/scan-factures`} style={{ color: ORANGE }}>
                      scanne vos factures fournisseurs
                    </Link>{' '}
                    automatiquement. Vous obtenez un tableau de bord complet sans saisie manuelle. Pour la déclaration annuelle, vous exportez vos données en un clic vers votre comptable.
                  </p>
                  <p>
                    Pour aller plus loin sur le calcul de votre rentabilité, consultez notre{' '}
                    <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} style={{ color: ORANGE }}>
                      calculateur de seuil de rentabilité food truck
                    </Link>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Food truck accounting can quickly become time-consuming if not well organized. Between daily sales, supplier purchases, fixed costs and tax filings, it&apos;s easy to get lost.
                  </p>
                  <h3>Essential financial indicators to track</h3>
                  <ul>
                    <li><strong>Daily revenue</strong>: total sales per service and per location.</li>
                    <li><strong>Gross margin rate</strong>: (Revenue - ingredient costs) ÷ Revenue. Ideally 65–75% for a food truck.</li>
                    <li><strong>Food cost</strong>: share of raw materials in revenue. Keep between 25–35%.</li>
                    <li><strong>Monthly fixed costs</strong>: rent, leasing, insurance, subscriptions — they don&apos;t vary with activity.</li>
                    <li><strong>Operating result</strong>: Revenue - variable costs - fixed costs. That&apos;s your true profitability.</li>
                  </ul>
                  <h3>Simplifying accounting with the right tools</h3>
                  <p>
                    The SumUp + FoodTracks combination covers the essentials: SumUp records every sale, FoodTracks imports the data and{' '}
                    <Link href={`/${locale}/fonctionnalites/scan-factures`} style={{ color: ORANGE }}>
                      scans your supplier invoices
                    </Link>{' '}
                    automatically. You get a complete dashboard without manual entry. For the annual filing, export your data in one click to your accountant.
                  </p>
                  <p>
                    To go further on profitability calculation, see our{' '}
                    <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} style={{ color: ORANGE }}>
                      food truck break-even calculator
                    </Link>
                    .
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 3 — LOCATIONS
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <h2
            id="emplacements"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: '#F59E0B' }}
            >
              3
            </span>
            {isFr ? 'Gestion des emplacements' : 'Location management'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  Le choix et la gestion des emplacements est l&apos;une des décisions les plus impactantes pour la rentabilité d&apos;un food truck. Un bon emplacement peut doubler votre chiffre d&apos;affaires par rapport à un mauvais.
                </p>
                <h3>Types d&apos;emplacements et leur potentiel</h3>
                <ul>
                  <li><strong>Marchés hebdomadaires</strong> : flux régulier et prévisible, souvent le matin. Ticket moyen modéré (8–12€). Idéal pour débuter.</li>
                  <li><strong>Zones d&apos;activité et bureaux</strong> : fort potentiel sur le midi en semaine. Ticket moyen élevé (12–18€). Nécessite un contrat régulier.</li>
                  <li><strong>Festivals et événements</strong> : volume très élevé sur quelques jours. Investissement en stock important. ROI excellent si bien préparé.</li>
                  <li><strong>Friches urbaines et food courts</strong> : emplacement semi-permanent avec loyer fixe. Visibilité forte mais coût élevé.</li>
                  <li><strong>Événements privés et traiteur</strong> : mariage, séminaire d&apos;entreprise. Ticket global élevé. Prévisibilité parfaite.</li>
                </ul>
                <h3>Comment mesurer la rentabilité d&apos;un emplacement ?</h3>
                <p>
                  Pour chaque emplacement, calculez : CA réalisé - coûts matières - frais d&apos;emplacement (droits de place) - coût de déplacement. Comparez ce résultat sur plusieurs passages pour identifier vos meilleurs emplacements. FoodTracks segmente automatiquement vos performances par emplacement dans votre tableau de bord.
                </p>
              </>
            ) : (
              <>
                <p>
                  Choosing and managing locations is one of the most impactful decisions for food truck profitability. A good location can double your revenue compared to a poor one.
                </p>
                <h3>Types of locations and their potential</h3>
                <ul>
                  <li><strong>Weekly markets</strong>: regular and predictable traffic, often mornings. Moderate average ticket (€8–12). Ideal for starting out.</li>
                  <li><strong>Business parks and offices</strong>: strong lunchtime potential on weekdays. High average ticket (€12–18). Requires a regular contract.</li>
                  <li><strong>Festivals and events</strong>: very high volume over a few days. Large stock investment. Excellent ROI if well prepared.</li>
                  <li><strong>Urban spaces and food courts</strong>: semi-permanent spot with fixed rent. Strong visibility but high cost.</li>
                  <li><strong>Private events and catering</strong>: weddings, corporate seminars. High total ticket. Perfect predictability.</li>
                </ul>
                <h3>How to measure location profitability?</h3>
                <p>
                  For each location, calculate: Revenue - ingredient costs - location fees (pitch fee) - travel cost. Compare this result across multiple visits to identify your best locations. FoodTracks automatically segments your performance by location in your dashboard.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4 — SALES FORECASTING
            ══════════════════════════════════════ */}
        <section
          className="py-14 relative"
          style={{ backgroundColor: '#FAFAF8' }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="previsions-ventes"
              className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
                style={{ backgroundColor: '#8B5CF6' }}
              >
                4
              </span>
              {isFr ? 'Prévisions de ventes et IA' : 'Sales forecasting and AI'}
            </h2>

            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              {isFr ? (
                <>
                  <p>
                    Les prévisions de ventes transforment la gestion d&apos;un food truck : plutôt que de commander à l&apos;instinct, vous basez vos achats sur des données. <strong>Les food truckers utilisant des prédictions IA réduisent leur gaspillage de 20 à 40 %</strong> et augmentent leur taux de service (moins de ruptures).
                  </p>
                  <h3>Les facteurs qui influencent vos ventes</h3>
                  <ul>
                    <li><strong>La météo</strong> : une journée ensoleillée peut multiplier vos ventes par 1,5 à 2 selon votre emplacement.</li>
                    <li><strong>Le jour de la semaine</strong> : vendredi midi est généralement le meilleur créneau en zone bureau.</li>
                    <li><strong>Les événements locaux</strong> : concert, match, brocante à proximité — impact fort sur le flux.</li>
                    <li><strong>La saisonnalité</strong> : l&apos;été porte les volumes, l&apos;hiver peut réduire l&apos;activité de 30 à 50 %.</li>
                    <li><strong>Votre historique</strong> : vos données passées sont le meilleur prédicteur de vos ventes futures.</li>
                  </ul>
                  <p>
                    La fonctionnalité de{' '}
                    <Link href={`/${locale}/fonctionnalites/predictions-ventes`} style={{ color: ORANGE }}>
                      prédictions de ventes FoodTracks
                    </Link>{' '}
                    combine météo, historique et emplacement pour générer des prévisions à 85 % de précision. Chaque matin, vous savez exactement combien préparer.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Sales forecasting transforms food truck management: instead of ordering by instinct, you base purchases on data. <strong>Food truckers using AI predictions reduce waste by 20–40%</strong> and improve service rate (fewer stockouts).
                  </p>
                  <h3>Factors that influence your sales</h3>
                  <ul>
                    <li><strong>Weather</strong>: a sunny day can multiply sales by 1.5–2x depending on location.</li>
                    <li><strong>Day of the week</strong>: Friday lunch is generally the best slot in office areas.</li>
                    <li><strong>Local events</strong>: concert, game, flea market nearby — strong impact on foot traffic.</li>
                    <li><strong>Seasonality</strong>: summer drives volumes, winter can reduce activity by 30–50%.</li>
                    <li><strong>Your history</strong>: your past data is the best predictor of future sales.</li>
                  </ul>
                  <p>
                    The{' '}
                    <Link href={`/${locale}/fonctionnalites/predictions-ventes`} style={{ color: ORANGE }}>
                      FoodTracks sales forecasting
                    </Link>{' '}
                    feature combines weather, history and location to generate 85%-accurate forecasts. Every morning you know exactly how much to prepare.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 5 — REGULATIONS
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <h2
            id="reglementation"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: '#EF4444' }}
            >
              5
            </span>
            {isFr ? 'Réglementation food truck en France' : 'Food truck regulations in France'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  La réglementation des food trucks en France a évolué positivement depuis 2014, mais reste complexe. Voici les obligations incontournables à respecter.
                </p>
                <h3>Obligations légales et administratives</h3>
                <ul>
                  <li><strong>Statut juridique</strong> : auto-entrepreneur, EURL, SARL ou SAS selon votre situation. Le statut auto-entrepreneur est limité à 188 700€ de CA annuel.</li>
                  <li><strong>Immatriculation</strong> : au RCS (Registre du Commerce) ou à la Chambre des Métiers selon votre activité (commerce ou artisanat).</li>
                  <li><strong>Formation HACCP obligatoire</strong> : depuis 2012, au moins une personne dans l&apos;établissement doit avoir suivi une formation en hygiène alimentaire (14h minimum).</li>
                  <li><strong>Assurance RC professionnelle</strong> : indispensable pour couvrir les dommages causés à des tiers (intoxication alimentaire, accident).</li>
                  <li><strong>Autorisation d&apos;occupation du domaine public</strong> : délivrée par la mairie pour les emplacements sur la voie publique. Durée et tarif variables selon les communes.</li>
                  <li><strong>Déclaration à la DDPP</strong> : Déclaration d&apos;activité obligatoire auprès de la Direction Départementale de la Protection des Populations.</li>
                </ul>
                <h3>Véhicule et équipements</h3>
                <ul>
                  <li>Permis B pour les véhicules &lt; 3,5 tonnes PTAC, permis C au-delà.</li>
                  <li>Contrôle technique à jour et visite sanitaire périodique.</li>
                  <li>Équipements de cuisson conformes aux normes gaz (NF EN 203) ou électriques.</li>
                  <li>Système de ventilation et d&apos;extraction obligatoire.</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  Food truck regulations in France have evolved positively since 2014, but remain complex. Here are the key obligations to comply with.
                </p>
                <h3>Legal and administrative obligations</h3>
                <ul>
                  <li><strong>Legal structure</strong>: sole trader, EURL, SARL or SAS depending on your situation. Sole trader status is capped at €188,700 annual revenue.</li>
                  <li><strong>Registration</strong>: with the RCS (Trade Registry) or Chamber of Crafts depending on your activity (trade or craft).</li>
                  <li><strong>Mandatory HACCP training</strong>: since 2012, at least one person must have completed food hygiene training (minimum 14 hours).</li>
                  <li><strong>Professional liability insurance</strong>: essential to cover damages caused to third parties (food poisoning, accidents).</li>
                  <li><strong>Public space occupation permit</strong>: issued by the municipality for street locations. Duration and fees vary by municipality.</li>
                  <li><strong>DDPP declaration</strong>: mandatory activity declaration to the Departmental Directorate for Consumer Affairs.</li>
                </ul>
                <h3>Vehicle and equipment</h3>
                <ul>
                  <li>Category B driving license for vehicles under 3.5 tonnes GVW, category C above.</li>
                  <li>Up-to-date vehicle inspection and periodic health inspection.</li>
                  <li>Cooking equipment compliant with gas (NF EN 203) or electrical standards.</li>
                  <li>Mandatory ventilation and extraction system.</li>
                </ul>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 6 — DIGITAL TOOLS (PILLAR GRID)
            ══════════════════════════════════════ */}
        <section
          className="py-16 relative"
          style={{ backgroundColor: DARK }}
        >
          <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
          <div className="container relative mx-auto px-5 sm:px-8 lg:px-16 max-w-5xl">
            <div className="text-center mb-14">
              <h2
                id="outils-digitaux"
                className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-4"
              >
                {isFr ? '6. Outils digitaux recommandés' : '6. Recommended digital tools'}
              </h2>
              <p className="text-lg" style={{ color: '#9CA3AF' }}>
                {isFr
                  ? 'Les outils essentiels pour gérer votre food truck efficacement en 2026'
                  : 'The essential tools to efficiently manage your food truck in 2026'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((pillar, idx) => (
                <Link
                  key={idx}
                  href={pillar.href}
                  className="group rounded-2xl p-7 space-y-4 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="p-3 rounded-xl w-fit"
                    style={{ backgroundColor: `${pillar.color}18`, border: `1px solid ${pillar.color}30` }}
                  >
                    {pillar.icon}
                  </div>
                  <h3 className="font-jakarta text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {pillar.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: pillar.color }}
                  >
                    {pillar.cta}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 7 — DAILY CHECKLIST
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2
            id="checklist"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: ORANGE }}
            >
              7
            </span>
            {isFr ? 'Checklist quotidienne du food trucker' : 'Daily food trucker checklist'}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: '#F8F6F3', border: '1px solid #E8E2DC' }}
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-8 p-6 rounded-2xl"
            style={{ backgroundColor: '#FFF7ED', border: `1px solid rgba(249,115,22,0.2)` }}
          >
            <div className="flex items-start gap-4">
              <TrendingUp className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {isFr ? 'Automatisez cette checklist avec FoodTracks' : 'Automate this checklist with FoodTracks'}
                </p>
                <p className="text-sm text-gray-600">
                  {isFr
                    ? 'FoodTracks centralise toutes ces tâches dans une seule application. Vos stocks se mettent à jour automatiquement, vos prévisions sont générées chaque matin, et vos factures se scannent en 2 secondes.'
                    : 'FoodTracks centralizes all these tasks in a single app. Your stock updates automatically, forecasts are generated every morning, and invoices scan in 2 seconds.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            INTERNAL LINKS
            ══════════════════════════════════════ */}
        <section className="py-10" style={{ backgroundColor: '#FAFAF8' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-sm text-gray-400 mb-4 text-center">
              {isFr ? 'Aller plus loin' : 'Go further'}
            </p>
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
                {isFr ? 'Scan de factures OCR' : 'OCR invoice scanning'}
              </Link>
              <Link
                href={`/${locale}/guides/seuil-rentabilite-food-truck`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Calculateur seuil de rentabilité' : 'Break-even calculator'}
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                Blog
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FAQ
            ══════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-14">
              <h2
                id="faq"
                className="font-jakarta text-3xl md:text-4xl font-bold text-gray-900"
              >
                {isFr ? 'Questions fréquentes' : 'Frequently Asked Questions'}
              </h2>
            </div>
            <div>
              {faqItems.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FINAL CTA
            ══════════════════════════════════════ */}
        <section
          className="relative py-24 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
          }}
        >
          <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
          <div className="container relative mx-auto px-4 max-w-3xl text-center space-y-8">
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {isFr
                ? 'Prêt à mieux gérer votre food truck ?'
                : 'Ready to better manage your food truck?'}
            </h2>
            <p className="text-xl" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'FoodTracks automatise votre gestion de stock, vos prévisions et votre comptabilité. Gratuit, sans carte bancaire.'
                : 'FoodTracks automates your inventory management, forecasting and accounting. Free, no credit card.'}
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-12 py-5 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
                >
                  <ChefHat className="h-5 w-5" />
                  {isFr ? 'Commencer gratuitement' : 'Start for free'}
                </button>
              </Link>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {isFr
                  ? 'Sans carte bancaire · Sans engagement · Opérationnel en 30 minutes'
                  : 'No credit card · No commitment · Operational in 30 minutes'}
              </p>
            </div>

            {/* Internal links in CTA */}
            <div className="mt-10 pt-8 border-t text-left" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold mb-4" style={{ color: '#9CA3AF' }}>
                {isFr ? 'Articles liés' : 'Related guides'}
              </p>
              <ul className="space-y-2">
                {[
                  {
                    href: `/${locale}/fonctionnalites/gestion-stock`,
                    label: isFr
                      ? '→ Gestion de stock food truck en temps réel'
                      : '→ Real-time food truck stock management',
                  },
                  {
                    href: `/${locale}/fonctionnalites/predictions-ventes`,
                    label: isFr
                      ? '→ Prédictions de ventes IA pour food trucks'
                      : '→ AI sales predictions for food trucks',
                  },
                  {
                    href: `/${locale}/fonctionnalites/scan-factures`,
                    label: isFr
                      ? '→ Scan de factures fournisseurs (OCR)'
                      : '→ Supplier invoice scanning (OCR)',
                  },
                  {
                    href: `/${locale}/guides/seuil-rentabilite-food-truck`,
                    label: isFr
                      ? '→ Calculateur seuil de rentabilité food truck'
                      : '→ Food truck break-even calculator',
                  },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm hover:underline transition-colors"
                      style={{ color: ORANGE }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer minimal */}
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
                <Link href={`/${locale}/guides`} className="hover:text-gray-300 transition-colors">{isFr ? 'Guides' : 'Guides'}</Link>
                <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
              </div>
              <p className="text-xs" style={{ color: '#374151' }}>
                © {new Date().getFullYear()} FoodTracks
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
