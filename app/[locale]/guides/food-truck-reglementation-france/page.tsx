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
    ? 'Réglementation Food Truck en France 2026 — Guide Complet'
    : 'Food Truck Regulations in France 2026 — Complete Guide';
  const description = isFr
    ? 'Guide complet de la réglementation food truck en France : permis, hygiène HACCP, assurances, TVA, emplacements. Sources officielles et conseils pratiques pour être en règle.'
    : 'Complete guide to food truck regulations in France: permits, HACCP hygiene, insurance, VAT, locations. Official sources and practical advice for full compliance.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'réglementation food truck France',
          'permis food truck',
          'hygiène food truck HACCP',
          'assurance food truck',
          'TVA food truck',
          'licence food truck',
        ]
      : [
          'food truck regulations France',
          'food truck permits France',
          'food truck hygiene HACCP',
          'food truck insurance France',
          'food truck VAT France',
          'food truck licence France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
      languages: {
        fr: `${BASE_URL}/fr/guides/food-truck-reglementation-france`,
        en: `${BASE_URL}/en/guides/food-truck-reglementation-france`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
      siteName: 'FoodTracks',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: isFr
            ? 'Réglementation food truck en France 2026'
            : 'Food truck regulations in France 2026',
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

export default async function ReglementationFoodTruckPage({
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
        name: isFr ? 'Réglementation Food Truck' : 'Food Truck Regulations',
        item: `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
      },
    ],
  };

  const faqItems = isFr
    ? [
        {
          question: 'Quel statut juridique choisir pour un food truck ?',
          answer:
            'Le choix dépend de votre chiffre d\'affaires prévisionnel et de votre situation personnelle. L\'auto-entreprise (micro-entreprise) est idéale pour débuter avec un CA inférieur à 188 700 €/an grâce à sa simplicité administrative. Au-delà, ou si vous avez un associé, optez pour une SARL ou SAS qui offrent une meilleure protection du patrimoine personnel et davantage de flexibilité fiscale.',
        },
        {
          question: 'La carte de commerçant ambulant est-elle obligatoire ?',
          answer:
            'Oui, la carte de commerçant ambulant est obligatoire dès que vous exercez votre activité en dehors de la commune de domiciliation de votre entreprise. Elle est délivrée par le CFE compétent, valable 4 ans et renouvelable. Sans cette carte, vous risquez une amende pouvant aller jusqu\'à 1 500 € en cas de contrôle.',
        },
        {
          question: 'Qui doit suivre la formation HACCP ?',
          answer:
            'Au moins une personne au sein de votre établissement doit avoir suivi une formation en hygiène alimentaire de 14 heures minimum, conformément au décret n° 2011-731. Cette formation couvre les principes HACCP, la méthode des 5M et la gestion des températures. Elle est dispensée par des organismes agréés et coûte entre 200 et 500 €.',
        },
        {
          question: 'Quelles assurances sont obligatoires pour un food truck ?',
          answer:
            'L\'assurance Responsabilité Civile Professionnelle (RC Pro) est indispensable pour couvrir les dommages causés aux tiers (intoxication alimentaire, accident). L\'assurance du véhicule professionnel est également obligatoire. Il est fortement recommandé d\'ajouter une multirisque professionnelle (vol, incendie, bris de matériel) et une protection juridique. Comptez entre 1 200 et 3 000 €/an selon les garanties.',
        },
        {
          question: 'Quel taux de TVA appliquer en food truck ?',
          answer:
            'La TVA en food truck dépend du type de vente. La restauration sur place et à emporter de plats préparés est soumise au taux de 10 %. Les produits alimentaires non préparés (boissons non alcoolisées, desserts emballés) bénéficient du taux réduit de 5,5 %. Les boissons alcoolisées sont au taux normal de 20 %. En micro-entreprise, vous pouvez bénéficier de la franchise en base de TVA.',
        },
        {
          question: 'Comment obtenir un emplacement sur la voie publique ?',
          answer:
            'Pour stationner sur le domaine public, vous devez obtenir une Autorisation d\'Occupation Temporaire (AOT) ou une permission de voirie auprès de la mairie concernée. Le tarif varie de 5 à 30 €/jour selon les communes. Pour les marchés, il faut s\'inscrire auprès du placier municipal. Les délais d\'obtention varient de quelques jours à plusieurs mois selon la demande.',
        },
        {
          question: 'Quelles sont les normes de sécurité pour le véhicule ?',
          answer:
            'Le véhicule doit passer un contrôle technique tous les 2 ans (UTAC). L\'installation gaz doit être conforme aux normes NF et vérifiée annuellement. Un extincteur adapté est obligatoire à bord. Le système de ventilation et d\'extraction doit respecter les normes en vigueur, et le raccordement électrique doit être conforme aux normes NF C 15-100.',
        },
        {
          question: 'Combien coûte la création d\'un food truck en France ?',
          answer:
            'Le budget total de lancement varie entre 30 000 et 120 000 € selon le type de véhicule (neuf ou occasion) et l\'aménagement. Les principaux postes sont : le véhicule aménagé (20 000–80 000 €), l\'équipement de cuisine (5 000–15 000 €), les frais administratifs et formations (1 000–3 000 €), le stock initial (1 000–3 000 €) et les assurances (1 200–3 000 €/an). Utilisez notre calculateur de seuil de rentabilité pour planifier votre investissement.',
        },
      ]
    : [
        {
          question: 'What legal status should I choose for a food truck in France?',
          answer:
            'The choice depends on your projected revenue and personal situation. The auto-entrepreneur (micro-enterprise) status is ideal for starting with annual revenue under €188,700 thanks to its administrative simplicity. Beyond that threshold, or if you have a partner, opt for a SARL or SAS which offer better personal asset protection and more tax flexibility.',
        },
        {
          question: 'Is the itinerant trader card mandatory?',
          answer:
            'Yes, the carte de commerçant ambulant is mandatory as soon as you operate outside the municipality where your business is registered. It is issued by the relevant CFE, valid for 4 years and renewable. Without this card, you risk a fine of up to €1,500 if inspected.',
        },
        {
          question: 'Who needs HACCP training?',
          answer:
            'At least one person in your establishment must have completed a minimum 14-hour food hygiene training course, in accordance with decree no. 2011-731. This training covers HACCP principles, the 5M method, and temperature management. It is delivered by approved organizations and costs between €200 and €500.',
        },
        {
          question: 'What insurance is mandatory for a food truck?',
          answer:
            'Professional Liability Insurance (RC Pro) is essential to cover third-party damages (food poisoning, accidents). Professional vehicle insurance is also mandatory. It is strongly recommended to add multi-risk professional insurance (theft, fire, equipment damage) and legal protection. Expect to pay between €1,200 and €3,000/year depending on coverage.',
        },
        {
          question: 'What VAT rate applies to food trucks?',
          answer:
            'VAT for food trucks depends on the type of sale. On-site and takeaway prepared meals are subject to 10% VAT. Unprepared food products (non-alcoholic drinks, packaged desserts) benefit from the reduced 5.5% rate. Alcoholic beverages are at the standard 20% rate. Under micro-enterprise status, you may benefit from VAT exemption (franchise en base).',
        },
        {
          question: 'How do I get a public road pitch?',
          answer:
            'To set up on public land, you need a Temporary Occupation Authorization (AOT) or a road permit from the relevant municipality. The fee ranges from €5 to €30/day depending on the commune. For markets, you must register with the municipal market manager (placier). Processing times range from a few days to several months depending on demand.',
        },
        {
          question: 'What are the vehicle safety standards?',
          answer:
            'The vehicle must pass a technical inspection every 2 years (UTAC). Gas installations must comply with NF standards and be checked annually. A suitable fire extinguisher is mandatory on board. The ventilation and extraction system must meet current standards, and electrical connections must comply with NF C 15-100 standards.',
        },
        {
          question: 'How much does it cost to start a food truck in France?',
          answer:
            'The total startup budget ranges from €30,000 to €120,000 depending on the vehicle type (new or used) and fit-out. Main costs include: the fitted vehicle (€20,000–80,000), kitchen equipment (€5,000–15,000), administrative fees and training (€1,000–3,000), initial stock (€1,000–3,000), and insurance (€1,200–3,000/year). Use our break-even calculator to plan your investment.',
        },
      ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'Réglementation food truck en France 2026 — Guide complet'
      : 'Food Truck Regulations in France 2026 — Complete Guide',
    description: isFr
      ? 'Guide complet de la réglementation food truck en France : permis, hygiène HACCP, assurances, TVA, emplacements.'
      : 'Complete guide to food truck regulations in France: permits, HACCP hygiene, insurance, VAT, locations.',
    datePublished: '2026-03-19',
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
      '@id': `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
    },
    inLanguage: locale,
    image: `${BASE_URL}/og-image.png`,
    about: {
      '@type': 'Thing',
      name: isFr ? 'Réglementation food truck France' : 'Food truck regulations France',
    },
    keywords: isFr
      ? 'réglementation food truck France, permis food truck, hygiène food truck HACCP, assurance food truck, TVA food truck'
      : 'food truck regulations France, food truck permits France, food truck hygiene HACCP, food truck insurance France, food truck VAT France',
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
          icon: <Calculator className="h-7 w-7" style={{ color: GREEN }} />,
          color: GREEN,
          title: 'Seuil de rentabilité',
          desc: 'Calculer votre point mort mensuel et journalier pour savoir combien vendre chaque jour.',
          href: `/${locale}/guides/seuil-rentabilite-food-truck`,
          cta: 'Calculer maintenant',
        },
        {
          icon: <ChefHat className="h-7 w-7" style={{ color: '#F59E0B' }} />,
          color: '#F59E0B',
          title: 'Guide gestion food truck',
          desc: 'Le guide complet pour gérer votre food truck de A à Z : stocks, comptabilité, emplacements et outils.',
          href: `/${locale}/guides/gestion-food-truck`,
          cta: 'Lire le guide',
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
          icon: <Calculator className="h-7 w-7" style={{ color: GREEN }} />,
          color: GREEN,
          title: 'Break-Even Point',
          desc: 'Calculate your monthly and daily break-even threshold to know how much to sell each day.',
          href: `/${locale}/guides/seuil-rentabilite-food-truck`,
          cta: 'Calculate now',
        },
        {
          icon: <ChefHat className="h-7 w-7" style={{ color: '#F59E0B' }} />,
          color: '#F59E0B',
          title: 'Food Truck Management Guide',
          desc: 'The complete guide to managing your food truck from A to Z: inventory, accounting, locations and tools.',
          href: `/${locale}/guides/gestion-food-truck`,
          cta: 'Read the guide',
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
              {isFr ? 'Réglementation Food Truck' : 'Food Truck Regulations'}
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
            <Shield className="h-4 w-4" />
            {isFr ? 'Guide réglementaire · Mars 2026' : 'Regulatory guide · March 2026'}
          </div>

          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {isFr
              ? 'Réglementation food truck en France : le guide complet 2026'
              : 'Food truck regulations in France: the complete 2026 guide'}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
            {isFr
              ? 'Ouvrir et exploiter un food truck en France implique de respecter un cadre réglementaire précis : statut juridique, carte de commerçant ambulant, formation HACCP, assurances, TVA et autorisations d\'emplacement. Ce guide rassemble toutes les obligations légales à jour pour 2026, avec les sources officielles et des conseils pratiques.'
              : 'Opening and operating a food truck in France requires compliance with a precise regulatory framework: legal status, itinerant trader card, HACCP training, insurance, VAT and location permits. This guide covers all current legal obligations for 2026, with official sources and practical advice.'}
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
                  <li>L&apos;immatriculation au RCS et le choix du statut juridique (auto-entrepreneur, SARL, SAS) sont la première étape obligatoire.</li>
                  <li>La carte de commerçant ambulant est requise dès que vous vendez hors de votre commune de domiciliation.</li>
                  <li>La formation HACCP (14h minimum) est obligatoire pour au moins une personne de l&apos;équipe.</li>
                  <li>L&apos;assurance RC Pro et l&apos;assurance véhicule professionnel sont les deux couvertures minimales obligatoires.</li>
                  <li>Le taux de TVA applicable est de 10 % pour la restauration à emporter et 5,5 % pour les produits non préparés.</li>
                </>
              ) : (
                <>
                  <li>RCS registration and legal status choice (auto-entrepreneur, SARL, SAS) are the mandatory first step.</li>
                  <li>The itinerant trader card is required as soon as you sell outside your registered municipality.</li>
                  <li>HACCP training (minimum 14 hours) is mandatory for at least one team member.</li>
                  <li>Professional liability (RC Pro) and professional vehicle insurance are the two minimum mandatory coverages.</li>
                  <li>The applicable VAT rate is 10% for takeaway food and 5.5% for unprepared products.</li>
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
                    'Statut juridique et immatriculation',
                    'Carte de commerçant ambulant',
                    'Formation et hygiène HACCP',
                    'Assurances obligatoires',
                    'TVA et obligations fiscales',
                    'Autorisations d\'emplacement',
                    'Normes véhicule et sécurité',
                    'Questions fréquentes',
                  ]
                : [
                    'Legal status & registration',
                    'Itinerant trader card',
                    'HACCP training & hygiene',
                    'Mandatory insurance',
                    'VAT & tax obligations',
                    'Location permits',
                    'Vehicle & safety standards',
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
            SECTION 1 — STATUT JURIDIQUE
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 pb-14 max-w-4xl">
          <h2
            id="statut-juridique"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: ORANGE }}
            >
              1
            </span>
            {isFr ? 'Statut juridique et immatriculation' : 'Legal status & registration'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  La première étape pour lancer votre food truck est de choisir un statut juridique adapté et de vous immatriculer. Ce choix impacte votre fiscalité, votre protection sociale et vos possibilités de développement.
                </p>
                <h3>Les statuts juridiques possibles</h3>
                <ul>
                  <li><strong>Auto-entrepreneur (micro-entreprise)</strong> : le plus simple pour débuter. Plafond de CA à 188 700 €/an pour les activités de vente. Charges sociales réduites (12,3 % du CA). Comptabilité simplifiée.</li>
                  <li><strong>EURL (Entreprise Unipersonnelle à Responsabilité Limitée)</strong> : adaptée si vous êtes seul et souhaitez protéger votre patrimoine personnel. Imposition à l&apos;IR ou à l&apos;IS au choix.</li>
                  <li><strong>SARL (Société à Responsabilité Limitée)</strong> : idéale si vous avez un associé. Responsabilité limitée aux apports. Structure bien encadrée juridiquement.</li>
                  <li><strong>SAS (Société par Actions Simplifiée)</strong> : la plus flexible. Liberté statutaire, président assimilé salarié. Adaptée si vous prévoyez une forte croissance ou des investisseurs.</li>
                </ul>
                <h3>Démarches d&apos;immatriculation</h3>
                <p>
                  L&apos;immatriculation se fait via le guichet unique de l&apos;INPI (<a href="https://www.guichet-entreprises.fr" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>guichet-entreprises.fr</a>). Vous obtiendrez votre numéro SIRET et votre code APE <strong>56.10C</strong> (restauration de type rapide). L&apos;inscription au Registre du Commerce et des Sociétés (RCS) est obligatoire pour les activités commerciales.
                </p>
                <p>
                  Pour estimer vos charges et votre rentabilité selon le statut choisi, utilisez notre{' '}
                  <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} style={{ color: ORANGE }}>
                    calculateur de seuil de rentabilité food truck
                  </Link>.
                </p>
                <p className="text-sm text-gray-500">
                  Source : <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23887" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr</a>
                </p>
              </>
            ) : (
              <>
                <p>
                  The first step to launching your food truck is choosing the right legal status and registering your business. This choice impacts your taxation, social protection and growth potential.
                </p>
                <h3>Available legal structures</h3>
                <ul>
                  <li><strong>Auto-entrepreneur (micro-enterprise)</strong>: the simplest to start with. Revenue cap at €188,700/year for sales activities. Reduced social charges (12.3% of revenue). Simplified accounting.</li>
                  <li><strong>EURL (Single-Person Limited Liability Company)</strong>: suitable if you are alone and want to protect personal assets. Choice of income tax or corporate tax.</li>
                  <li><strong>SARL (Limited Liability Company)</strong>: ideal if you have a partner. Liability limited to contributions. Well-regulated legal structure.</li>
                  <li><strong>SAS (Simplified Joint-Stock Company)</strong>: the most flexible. Statutory freedom, president treated as employee. Suitable if you expect strong growth or investors.</li>
                </ul>
                <h3>Registration process</h3>
                <p>
                  Registration is done through the INPI one-stop shop (<a href="https://www.guichet-entreprises.fr" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>guichet-entreprises.fr</a>). You will receive your SIRET number and APE code <strong>56.10C</strong> (fast food service). Registration with the Trade and Companies Register (RCS) is mandatory for commercial activities.
                </p>
                <p>
                  To estimate your costs and profitability based on your chosen status, use our{' '}
                  <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} style={{ color: ORANGE }}>
                    food truck break-even calculator
                  </Link>.
                </p>
                <p className="text-sm text-gray-500">
                  Source: <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23887" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr</a>
                </p>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2 — CARTE COMMERCANT AMBULANT
            ══════════════════════════════════════ */}
        <section
          className="py-14 relative"
          style={{ backgroundColor: '#FAFAF8' }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="carte-commercant"
              className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
                style={{ backgroundColor: TEAL }}
              >
                2
              </span>
              {isFr ? 'Carte de commerçant ambulant' : 'Itinerant trader card'}
            </h2>

            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              {isFr ? (
                <>
                  <p>
                    La carte de commerçant ambulant est un document indispensable pour tout food trucker exerçant en dehors de sa commune de domiciliation. Elle atteste de votre droit à pratiquer le commerce itinérant sur l&apos;ensemble du territoire français.
                  </p>
                  <h3>Qui est concerné ?</h3>
                  <p>
                    Tout commerçant ou artisan exerçant une activité ambulante <strong>en dehors de la commune de domiciliation de son entreprise</strong> doit détenir cette carte. Si vous ne vendez que dans votre commune d&apos;inscription, elle n&apos;est pas obligatoire.
                  </p>
                  <h3>Comment l&apos;obtenir ?</h3>
                  <ul>
                    <li><strong>Demande au CFE</strong> (Centre de Formalités des Entreprises) compétent ou directement via le guichet unique de l&apos;INPI.</li>
                    <li><strong>Pièces à fournir</strong> : justificatif d&apos;identité, justificatif de domiciliation, extrait Kbis ou attestation d&apos;inscription au répertoire des métiers.</li>
                    <li><strong>Coût</strong> : 30 € (timbre fiscal).</li>
                    <li><strong>Délai</strong> : environ 1 mois après dépôt du dossier complet.</li>
                    <li><strong>Validité</strong> : 4 ans, renouvelable sur demande avant expiration.</li>
                  </ul>
                  <h3>Sanctions en cas d&apos;absence</h3>
                  <p>
                    L&apos;absence de carte de commerçant ambulant en cas de contrôle peut entraîner une amende de <strong>1 500 €</strong> (contravention de 5e classe). Pensez à toujours la conserver dans votre véhicule.
                  </p>
                  <p className="text-sm text-gray-500">
                    Source : <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F22536" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr/professionnels-entreprises</a>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    The carte de commerçant ambulant (itinerant trader card) is an essential document for any food truck operator working outside their registered municipality. It certifies your right to practice itinerant trade throughout France.
                  </p>
                  <h3>Who needs it?</h3>
                  <p>
                    Any trader or craftsperson conducting mobile business <strong>outside the municipality where their business is registered</strong> must hold this card. If you only sell in your registered municipality, it is not required.
                  </p>
                  <h3>How to obtain it?</h3>
                  <ul>
                    <li><strong>Apply at the CFE</strong> (Centre de Formalités des Entreprises) or directly through the INPI one-stop shop.</li>
                    <li><strong>Required documents</strong>: ID proof, business address proof, Kbis extract or craft registry registration certificate.</li>
                    <li><strong>Cost</strong>: €30 (tax stamp).</li>
                    <li><strong>Processing time</strong>: approximately 1 month after submitting the complete file.</li>
                    <li><strong>Validity</strong>: 4 years, renewable upon request before expiration.</li>
                  </ul>
                  <h3>Penalties for non-compliance</h3>
                  <p>
                    Not having the itinerant trader card during an inspection can result in a fine of <strong>€1,500</strong> (5th class offense). Always keep it in your vehicle.
                  </p>
                  <p className="text-sm text-gray-500">
                    Source: <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F22536" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr/professionnels-entreprises</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 3 — HACCP
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <h2
            id="haccp"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: '#F59E0B' }}
            >
              3
            </span>
            {isFr ? 'Formation et hygiène HACCP' : 'HACCP training & hygiene'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  L&apos;hygiène alimentaire est au coeur de la réglementation food truck. Le règlement européen (CE) n° 852/2004 et le décret français n° 2011-731 imposent des obligations strictes en matière de formation et de pratiques d&apos;hygiène.
                </p>
                <h3>Formation HACCP obligatoire</h3>
                <ul>
                  <li><strong>Au moins une personne</strong> dans l&apos;établissement doit avoir suivi une formation en hygiène alimentaire de <strong>14 heures minimum</strong>.</li>
                  <li>La formation est dispensée par des organismes enregistrés auprès de la DRAAF (Direction Régionale de l&apos;Alimentation, de l&apos;Agriculture et de la Forêt).</li>
                  <li>Coût moyen : <strong>200 à 500 €</strong> selon l&apos;organisme et le format (présentiel ou en ligne).</li>
                  <li>Sont exemptés : les titulaires d&apos;un diplôme en restauration (CAP, BEP, Bac Pro) ou d&apos;une expérience de 3 ans en tant que gérant d&apos;un établissement alimentaire.</li>
                </ul>
                <h3>Plan de Maîtrise Sanitaire (PMS)</h3>
                <p>
                  Le PMS est un document obligatoire qui décrit les mesures prises pour garantir la sécurité alimentaire. Il comprend :
                </p>
                <ul>
                  <li>Les bonnes pratiques d&apos;hygiène (BPH) et de fabrication (BPF).</li>
                  <li>Le plan HACCP avec l&apos;analyse des dangers et les points critiques.</li>
                  <li>Le plan de nettoyage et de désinfection.</li>
                  <li>La gestion de la traçabilité des matières premières.</li>
                  <li>Les relevés de températures (frigos, cuisson, service).</li>
                </ul>
                <h3>Contrôles DDPP</h3>
                <p>
                  La Direction Départementale de la Protection des Populations (DDPP) peut effectuer des contrôles inopinés. En cas de manquement grave, vous risquez une fermeture administrative temporaire, une amende, voire des poursuites pénales. Tenez vos registres à jour et votre PMS accessible dans le véhicule.
                </p>
                <p>
                  Pour automatiser le suivi de vos stocks et de la traçabilité, découvrez la{' '}
                  <Link href={`/${locale}/fonctionnalites/gestion-stock`} style={{ color: ORANGE }}>
                    gestion de stock FoodTracks
                  </Link>.
                </p>
                <p className="text-sm text-gray-500">
                  Source : <a href="https://agriculture.gouv.fr/la-formation-obligatoire-en-hygiene-alimentaire" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>agriculture.gouv.fr</a>
                </p>
              </>
            ) : (
              <>
                <p>
                  Food hygiene is at the heart of food truck regulations. European regulation (EC) No 852/2004 and French decree No 2011-731 impose strict obligations regarding training and hygiene practices.
                </p>
                <h3>Mandatory HACCP training</h3>
                <ul>
                  <li><strong>At least one person</strong> in the establishment must have completed a food hygiene training course of <strong>minimum 14 hours</strong>.</li>
                  <li>Training is delivered by organizations registered with the DRAAF (Regional Directorate for Food, Agriculture and Forestry).</li>
                  <li>Average cost: <strong>€200 to €500</strong> depending on the provider and format (in-person or online).</li>
                  <li>Exemptions apply for holders of a catering diploma (CAP, BEP, Bac Pro) or 3 years of experience managing a food establishment.</li>
                </ul>
                <h3>Sanitary Control Plan (PMS)</h3>
                <p>
                  The PMS is a mandatory document describing the measures taken to ensure food safety. It includes:
                </p>
                <ul>
                  <li>Good hygiene practices (GHP) and good manufacturing practices (GMP).</li>
                  <li>The HACCP plan with hazard analysis and critical control points.</li>
                  <li>The cleaning and disinfection schedule.</li>
                  <li>Raw material traceability management.</li>
                  <li>Temperature logs (fridges, cooking, service).</li>
                </ul>
                <h3>DDPP inspections</h3>
                <p>
                  The Departmental Directorate for Consumer Affairs (DDPP) can carry out unannounced inspections. In case of serious non-compliance, you risk temporary administrative closure, fines, or even criminal prosecution. Keep your records up to date and your PMS accessible in the vehicle.
                </p>
                <p>
                  To automate stock tracking and traceability, discover{' '}
                  <Link href={`/${locale}/fonctionnalites/gestion-stock`} style={{ color: ORANGE }}>
                    FoodTracks inventory management
                  </Link>.
                </p>
                <p className="text-sm text-gray-500">
                  Source: <a href="https://agriculture.gouv.fr/la-formation-obligatoire-en-hygiene-alimentaire" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>agriculture.gouv.fr</a>
                </p>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4 — ASSURANCES
            ══════════════════════════════════════ */}
        <section
          className="py-14 relative"
          style={{ backgroundColor: '#FAFAF8' }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="assurances"
              className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
                style={{ backgroundColor: '#8B5CF6' }}
              >
                4
              </span>
              {isFr ? 'Assurances obligatoires' : 'Mandatory insurance'}
            </h2>

            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              {isFr ? (
                <>
                  <p>
                    Les assurances sont un pilier de la protection de votre activité food truck. Certaines sont légalement obligatoires, d&apos;autres fortement recommandées pour couvrir les risques spécifiques à la restauration ambulante.
                  </p>
                  <h3>Assurances obligatoires</h3>
                  <ul>
                    <li><strong>Responsabilité Civile Professionnelle (RC Pro)</strong> : couvre les dommages corporels, matériels ou immatériels causés à des tiers dans le cadre de votre activité (intoxication alimentaire, brûlure d&apos;un client, dégât sur un emplacement). Coût moyen : 400 à 800 €/an.</li>
                    <li><strong>Assurance véhicule professionnel</strong> : au minimum au tiers pour la circulation. Optez pour une formule tous risques incluant le contenu (équipement de cuisine, stock). Coût moyen : 800 à 2 000 €/an selon le véhicule.</li>
                  </ul>
                  <h3>Assurances recommandées</h3>
                  <ul>
                    <li><strong>Multirisque professionnelle</strong> : couvre vol, incendie, bris de matériel, dégâts des eaux, perte d&apos;exploitation. Indispensable pour protéger votre investissement.</li>
                    <li><strong>Protection juridique</strong> : prend en charge les frais de justice en cas de litige avec un client, un fournisseur ou une collectivité.</li>
                    <li><strong>Prévoyance et mutuelle TNS</strong> : si vous êtes travailleur non salarié, pensez à une couverture complémentaire santé et prévoyance.</li>
                  </ul>
                  <p>
                    Intégrez le coût de vos assurances dans votre calcul de charges fixes. Notre{' '}
                    <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} style={{ color: ORANGE }}>
                      calculateur de seuil de rentabilité
                    </Link>{' '}
                    vous aide à déterminer le CA nécessaire pour couvrir l&apos;ensemble de vos charges.
                  </p>
                  <p className="text-sm text-gray-500">
                    Source : <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23668" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr</a>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Insurance is a cornerstone of protecting your food truck business. Some policies are legally mandatory, others strongly recommended to cover risks specific to mobile catering.
                  </p>
                  <h3>Mandatory insurance</h3>
                  <ul>
                    <li><strong>Professional Liability Insurance (RC Pro)</strong>: covers bodily, material or immaterial damage caused to third parties during your business (food poisoning, customer burns, damage at a pitch). Average cost: €400–800/year.</li>
                    <li><strong>Professional vehicle insurance</strong>: minimum third-party cover for driving. Opt for comprehensive cover including contents (kitchen equipment, stock). Average cost: €800–2,000/year depending on the vehicle.</li>
                  </ul>
                  <h3>Recommended insurance</h3>
                  <ul>
                    <li><strong>Multi-risk professional insurance</strong>: covers theft, fire, equipment damage, water damage, loss of business. Essential to protect your investment.</li>
                    <li><strong>Legal protection</strong>: covers legal costs in case of disputes with a customer, supplier or municipality.</li>
                    <li><strong>Health and disability cover (TNS)</strong>: if you are self-employed, consider complementary health and disability insurance.</li>
                  </ul>
                  <p>
                    Include insurance costs in your fixed charges calculation. Our{' '}
                    <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} style={{ color: ORANGE }}>
                      break-even calculator
                    </Link>{' '}
                    helps you determine the revenue needed to cover all your costs.
                  </p>
                  <p className="text-sm text-gray-500">
                    Source: <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23668" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 5 — TVA
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <h2
            id="tva-fiscalite"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: '#EF4444' }}
            >
              5
            </span>
            {isFr ? 'TVA et obligations fiscales' : 'VAT & tax obligations'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  La fiscalité d&apos;un food truck comporte plusieurs particularités, notamment en matière de TVA. Le taux applicable dépend du type de produit vendu et de la nature de la vente.
                </p>
                <h3>Franchise en base de TVA</h3>
                <p>
                  En micro-entreprise, vous bénéficiez de la franchise en base de TVA tant que votre CA ne dépasse pas <strong>91 900 €</strong> (seuil 2026 pour les activités de vente). Vous ne facturez pas de TVA et ne la récupérez pas sur vos achats. Au-delà de ce seuil, vous devenez redevable de la TVA.
                </p>
                <h3>Taux de TVA applicables</h3>
                <ul>
                  <li><strong>10 % (taux intermédiaire)</strong> : restauration sur place et vente à emporter de plats préparés destinés à une consommation immédiate (burgers, sandwichs, plats chauds, salades composées).</li>
                  <li><strong>5,5 % (taux réduit)</strong> : produits alimentaires non préparés ou conditionnés pour une conservation (boissons non alcoolisées en bouteille, desserts emballés, conserves).</li>
                  <li><strong>20 % (taux normal)</strong> : boissons alcoolisées, confiseries, certains produits à base de chocolat.</li>
                </ul>
                <h3>Obligations déclaratives</h3>
                <ul>
                  <li><strong>Micro-entreprise</strong> : déclaration mensuelle ou trimestrielle du CA sur autoentrepreneur.urssaf.fr.</li>
                  <li><strong>Société</strong> : déclaration de TVA mensuelle ou trimestrielle (CA3 ou CA12), liasse fiscale annuelle.</li>
                  <li><strong>Livre de recettes</strong> : obligatoire pour les micro-entrepreneurs, il consigne chronologiquement toutes les recettes encaissées.</li>
                  <li><strong>Registre des achats</strong> : obligatoire pour les activités de vente, il détaille tous les achats de marchandises.</li>
                </ul>
                <p>
                  FoodTracks simplifie votre suivi fiscal en important automatiquement vos ventes SumUp et en{' '}
                  <Link href={`/${locale}/fonctionnalites/scan-factures`} style={{ color: ORANGE }}>
                    scannant vos factures fournisseurs
                  </Link>
                  . Vos données de CA et de coûts matières sont toujours à jour pour vos déclarations.
                </p>
                <p className="text-sm text-gray-500">
                  Source : <a href="https://www.impots.gouv.fr/professionnel/questions/quels-sont-les-taux-de-tva-en-vigueur-en-france-et-dans-lunion-europeenne" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>impots.gouv.fr</a>
                </p>
              </>
            ) : (
              <>
                <p>
                  Food truck taxation has several specificities, particularly regarding VAT. The applicable rate depends on the type of product sold and the nature of the sale.
                </p>
                <h3>VAT exemption (franchise en base)</h3>
                <p>
                  Under micro-enterprise status, you benefit from VAT exemption as long as your revenue does not exceed <strong>€91,900</strong> (2026 threshold for sales activities). You do not charge VAT and cannot reclaim it on purchases. Beyond this threshold, you become liable for VAT.
                </p>
                <h3>Applicable VAT rates</h3>
                <ul>
                  <li><strong>10% (intermediate rate)</strong>: on-site dining and takeaway of prepared meals intended for immediate consumption (burgers, sandwiches, hot dishes, composed salads).</li>
                  <li><strong>5.5% (reduced rate)</strong>: unprepared or packaged food products for storage (bottled non-alcoholic beverages, packaged desserts, canned goods).</li>
                  <li><strong>20% (standard rate)</strong>: alcoholic beverages, confectionery, certain chocolate-based products.</li>
                </ul>
                <h3>Reporting obligations</h3>
                <ul>
                  <li><strong>Micro-enterprise</strong>: monthly or quarterly revenue declaration on autoentrepreneur.urssaf.fr.</li>
                  <li><strong>Company</strong>: monthly or quarterly VAT return (CA3 or CA12), annual tax return.</li>
                  <li><strong>Revenue ledger</strong>: mandatory for micro-entrepreneurs, recording all receipts chronologically.</li>
                  <li><strong>Purchase register</strong>: mandatory for sales activities, detailing all goods purchases.</li>
                </ul>
                <p>
                  FoodTracks simplifies tax tracking by automatically importing your SumUp sales and{' '}
                  <Link href={`/${locale}/fonctionnalites/scan-factures`} style={{ color: ORANGE }}>
                    scanning your supplier invoices
                  </Link>
                  . Your revenue and ingredient cost data are always up to date for your filings.
                </p>
                <p className="text-sm text-gray-500">
                  Source: <a href="https://www.impots.gouv.fr/professionnel/questions/quels-sont-les-taux-de-tva-en-vigueur-en-france-et-dans-lunion-europeenne" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>impots.gouv.fr</a>
                </p>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 6 — EMPLACEMENTS
            ══════════════════════════════════════ */}
        <section
          className="py-14 relative"
          style={{ backgroundColor: '#FAFAF8' }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="autorisations-emplacement"
              className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
                style={{ backgroundColor: GREEN }}
              >
                6
              </span>
              {isFr ? 'Autorisations d\'emplacement' : 'Location permits'}
            </h2>

            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              {isFr ? (
                <>
                  <p>
                    Stationner un food truck sur la voie publique ou un terrain privé nécessite des autorisations spécifiques. Les règles varient d&apos;une commune à l&apos;autre, ce qui rend la veille réglementaire indispensable.
                  </p>
                  <h3>Sur le domaine public</h3>
                  <ul>
                    <li><strong>Permission de voirie</strong> : autorisation délivrée par la mairie pour occuper une portion de la voie publique avec un véhicule. Elle précise l&apos;emplacement exact, les horaires et la durée.</li>
                    <li><strong>AOT (Autorisation d&apos;Occupation Temporaire)</strong> : titre administratif plus formel, souvent exigé pour des emplacements réguliers. Renouvelable et révocable par l&apos;administration.</li>
                    <li><strong>Redevance d&apos;occupation</strong> : tarif variable selon les communes, de 5 à 30 €/jour en moyenne. Certaines mairies proposent des forfaits mensuels ou annuels.</li>
                  </ul>
                  <h3>Sur les marchés</h3>
                  <ul>
                    <li>Inscription auprès du <strong>placier municipal</strong> qui attribue les emplacements.</li>
                    <li>Distinction entre <strong>abonnés</strong> (emplacement fixe garanti) et <strong>volants</strong> (emplacement attribué en fonction des disponibilités).</li>
                    <li>Droits de place variables : de 10 à 50 €/marché selon la taille et la localisation.</li>
                  </ul>
                  <h3>Sur terrain privé</h3>
                  <ul>
                    <li><strong>Accord écrit du propriétaire</strong> : convention ou bail précisant les conditions (durée, redevance, obligations).</li>
                    <li>Vérifiez que le terrain est compatible avec une activité de restauration (accès eau, électricité, respect du PLU).</li>
                  </ul>
                  <p>
                    Chaque commune a ses propres règles. Renseignez-vous toujours auprès du service urbanisme ou du service des marchés de la mairie concernée avant de vous installer.
                  </p>
                  <p className="text-sm text-gray-500">
                    Source : <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F32276" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr</a>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Parking a food truck on public roads or private land requires specific authorizations. Rules vary from one municipality to another, making regulatory monitoring essential.
                  </p>
                  <h3>On public land</h3>
                  <ul>
                    <li><strong>Permission de voirie (road permit)</strong>: authorization issued by the municipality to occupy a portion of the public road with a vehicle. It specifies the exact location, hours and duration.</li>
                    <li><strong>AOT (Temporary Occupation Authorization)</strong>: a more formal administrative title, often required for regular pitches. Renewable and revocable by the administration.</li>
                    <li><strong>Occupation fee</strong>: variable rate depending on municipality, averaging €5–30/day. Some town halls offer monthly or annual packages.</li>
                  </ul>
                  <h3>At markets</h3>
                  <ul>
                    <li>Register with the <strong>municipal market manager (placier)</strong> who allocates pitches.</li>
                    <li>Distinction between <strong>subscribers</strong> (guaranteed fixed pitch) and <strong>non-subscribers</strong> (pitch allocated based on availability).</li>
                    <li>Pitch fees vary: €10–50/market depending on size and location.</li>
                  </ul>
                  <h3>On private land</h3>
                  <ul>
                    <li><strong>Written agreement from the owner</strong>: contract or lease specifying conditions (duration, fee, obligations).</li>
                    <li>Verify that the land is compatible with food service (water access, electricity, compliance with local planning rules).</li>
                  </ul>
                  <p>
                    Each municipality has its own rules. Always check with the urban planning department or market services of the relevant town hall before setting up.
                  </p>
                  <p className="text-sm text-gray-500">
                    Source: <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F32276" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>service-public.fr</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 7 — NORMES VEHICULE
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <h2
            id="normes-vehicule"
            className="font-jakarta text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: '#06B6D4' }}
            >
              7
            </span>
            {isFr ? 'Normes véhicule et sécurité' : 'Vehicle & safety standards'}
          </h2>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {isFr ? (
              <>
                <p>
                  Votre food truck est à la fois un véhicule de transport et un local de restauration. Il doit donc répondre à un double ensemble de normes : celles du Code de la route et celles relatives à la sécurité des installations de cuisine.
                </p>
                <h3>Contrôle technique</h3>
                <ul>
                  <li><strong>Périodicité</strong> : tous les 2 ans pour les véhicules utilitaires légers (&lt; 3,5 t). Annuel pour les poids lourds (&gt; 3,5 t).</li>
                  <li>Le contrôle est effectué dans un centre agréé UTAC-OTC.</li>
                  <li>En cas de contre-visite, vous avez 2 mois pour effectuer les réparations et repasser le contrôle.</li>
                </ul>
                <h3>Installation gaz</h3>
                <ul>
                  <li>L&apos;installation gaz doit être <strong>conforme aux normes NF</strong> et vérifiée annuellement par un professionnel qualifié.</li>
                  <li>Les tuyaux souples doivent être remplacés avant leur date de péremption.</li>
                  <li>Un détecteur de gaz et un robinet d&apos;arrêt d&apos;urgence sont obligatoires.</li>
                </ul>
                <h3>Sécurité incendie</h3>
                <ul>
                  <li><strong>Extincteur</strong> : au minimum un extincteur à poudre ABC de 6 kg, accessible et vérifié annuellement.</li>
                  <li>Une <strong>couverture anti-feu</strong> est recommandée à proximité des zones de cuisson.</li>
                </ul>
                <h3>Ventilation et extraction</h3>
                <ul>
                  <li>Un système de ventilation mécanique est obligatoire pour évacuer fumées, vapeurs et odeurs.</li>
                  <li>La hotte d&apos;extraction doit être nettoyée régulièrement (au minimum tous les 3 mois).</li>
                </ul>
                <h3>Raccordement électrique</h3>
                <ul>
                  <li>L&apos;installation électrique doit être conforme à la norme <strong>NF C 15-100</strong>.</li>
                  <li>Un différentiel 30 mA est obligatoire pour protéger contre les risques d&apos;électrocution.</li>
                  <li>Si vous utilisez un groupe électrogène, il doit être placé à l&apos;extérieur du véhicule et correctement ventilé.</li>
                </ul>
                <p>
                  Pour en savoir plus sur la gestion globale de votre food truck, consultez notre{' '}
                  <Link href={`/${locale}/guides/gestion-food-truck`} style={{ color: ORANGE }}>
                    guide complet de la gestion food truck
                  </Link>.
                </p>
                <p className="text-sm text-gray-500">
                  Source : <a href="https://www.ecologie.gouv.fr/controle-technique-des-vehicules" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>DREAL / ecologie.gouv.fr</a>
                </p>
              </>
            ) : (
              <>
                <p>
                  Your food truck is both a transport vehicle and a food service premises. It must therefore meet a dual set of standards: road traffic regulations and kitchen installation safety requirements.
                </p>
                <h3>Technical inspection</h3>
                <ul>
                  <li><strong>Frequency</strong>: every 2 years for light commercial vehicles (&lt; 3.5 t). Annual for heavy goods vehicles (&gt; 3.5 t).</li>
                  <li>Inspection is carried out at an UTAC-OTC approved center.</li>
                  <li>If a re-test is required, you have 2 months to make repairs and re-pass the inspection.</li>
                </ul>
                <h3>Gas installation</h3>
                <ul>
                  <li>The gas installation must be <strong>compliant with NF standards</strong> and checked annually by a qualified professional.</li>
                  <li>Flexible hoses must be replaced before their expiry date.</li>
                  <li>A gas detector and emergency shut-off valve are mandatory.</li>
                </ul>
                <h3>Fire safety</h3>
                <ul>
                  <li><strong>Fire extinguisher</strong>: at minimum one 6 kg ABC powder extinguisher, accessible and inspected annually.</li>
                  <li>A <strong>fire blanket</strong> is recommended near cooking areas.</li>
                </ul>
                <h3>Ventilation and extraction</h3>
                <ul>
                  <li>A mechanical ventilation system is mandatory to evacuate smoke, steam and odors.</li>
                  <li>The extraction hood must be cleaned regularly (at least every 3 months).</li>
                </ul>
                <h3>Electrical connection</h3>
                <ul>
                  <li>The electrical installation must comply with <strong>NF C 15-100</strong> standards.</li>
                  <li>A 30 mA residual current device is mandatory to protect against electrocution.</li>
                  <li>If using a generator, it must be placed outside the vehicle and properly ventilated.</li>
                </ul>
                <p>
                  To learn more about overall food truck management, see our{' '}
                  <Link href={`/${locale}/guides/gestion-food-truck`} style={{ color: ORANGE }}>
                    complete food truck management guide
                  </Link>.
                </p>
                <p className="text-sm text-gray-500">
                  Source: <a href="https://www.ecologie.gouv.fr/controle-technique-des-vehicules" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>DREAL / ecologie.gouv.fr</a>
                </p>
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            PILLAR GRID (CTA CARDS)
            ══════════════════════════════════════ */}
        <section
          className="py-16 relative"
          style={{ backgroundColor: DARK }}
        >
          <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
          <div className="container relative mx-auto px-5 sm:px-8 lg:px-16 max-w-5xl">
            <div className="text-center mb-14">
              <h2
                className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-4"
              >
                {isFr ? 'Outils pour gérer votre food truck en règle' : 'Tools to manage your food truck compliantly'}
              </h2>
              <p className="text-lg" style={{ color: '#9CA3AF' }}>
                {isFr
                  ? 'Les outils essentiels pour automatiser votre gestion et rester conforme'
                  : 'Essential tools to automate your management and stay compliant'}
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
            INTERNAL LINKS
            ══════════════════════════════════════ */}
        <section className="py-10" style={{ backgroundColor: '#FAFAF8' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-sm text-gray-400 mb-4 text-center">
              {isFr ? 'Aller plus loin' : 'Go further'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/guides/gestion-food-truck`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Guide complet gestion food truck' : 'Complete food truck management guide'}
              </Link>
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
                ? 'Gérez votre food truck en toute conformité'
                : 'Manage your food truck in full compliance'}
            </h2>
            <p className="text-xl" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'FoodTracks automatise votre gestion de stock, vos prévisions et votre comptabilité. Restez en règle sans effort. Gratuit, sans carte bancaire.'
                : 'FoodTracks automates your inventory management, forecasting and accounting. Stay compliant effortlessly. Free, no credit card.'}
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
                    href: `/${locale}/guides/gestion-food-truck`,
                    label: isFr
                      ? '→ Guide complet de la gestion food truck'
                      : '→ Complete food truck management guide',
                  },
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
