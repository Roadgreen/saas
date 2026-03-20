import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChefHat, ArrowRight, CheckCircle2, AlertTriangle, BookOpen,
  BarChart3, Package, ChevronDown, TrendingUp, CreditCard, Shield,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const DARK = '#0D0905';

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
    ? 'Ouvrir un Food Truck en Auto-Entrepreneur 2026 — Guide Complet'
    : 'Opening a Food Truck as a Sole Trader 2026 — Complete Guide';
  const description = isFr
    ? 'Tout savoir pour ouvrir un food truck en auto-entrepreneur en 2026 : démarches URSSAF, permis, assurances, seuil de chiffre d\'affaires, cotisations et outils de gestion. Guide gratuit et complet.'
    : 'Everything you need to open a food truck as a sole trader in 2026: URSSAF registration, permits, insurance, turnover thresholds, contributions and management tools. Free complete guide.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'ouvrir food truck auto-entrepreneur',
          'food truck auto entrepreneur',
          'créer food truck micro-entreprise',
          'statut auto entrepreneur food truck',
          'démarches ouvrir food truck',
          'food truck auto-entrepreneur 2026',
          'permis food truck auto entrepreneur',
          'cotisations auto entrepreneur restauration',
          'seuil chiffre affaires food truck',
        ]
      : [
          'open food truck sole trader',
          'food truck self employed',
          'food truck micro business france',
          'start food truck autoentrepreneur',
          'food truck registration france',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/guides/ouvrir-food-truck-auto-entrepreneur`,
      languages: {
        fr: `${BASE_URL}/fr/guides/ouvrir-food-truck-auto-entrepreneur`,
        en: `${BASE_URL}/en/guides/ouvrir-food-truck-auto-entrepreneur`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/guides/ouvrir-food-truck-auto-entrepreneur`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: isFr ? 'Guide ouvrir food truck auto-entrepreneur' : 'Open food truck sole trader guide' }],
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE_URL}/og-image.png`] },
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

export default async function OuvrirFoodTruckAutoEntrepreneurPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'Ouvrir un Food Truck en Auto-Entrepreneur 2026 — Guide Complet'
      : 'Opening a Food Truck as a Sole Trader 2026 — Complete Guide',
    description: isFr
      ? 'Guide complet pour créer un food truck sous le statut auto-entrepreneur en 2026 : démarches, permis, fiscalité, gestion.'
      : 'Complete guide to setting up a food truck as a sole trader in 2026: registration, permits, taxation, management.',
    datePublished: '2026-03-20',
    dateModified: '2026-03-20',
    author: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/guides/ouvrir-food-truck-auto-entrepreneur` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Guides' : 'Guides', item: `${BASE_URL}/${locale}/guides` },
      { '@type': 'ListItem', position: 3, name: isFr ? 'Ouvrir un food truck auto-entrepreneur' : 'Open a food truck sole trader', item: `${BASE_URL}/${locale}/guides/ouvrir-food-truck-auto-entrepreneur` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Peut-on ouvrir un food truck en auto-entrepreneur ?',
          a: 'Oui, il est tout à fait possible de créer un food truck sous le statut auto-entrepreneur (micro-entreprise). C\'est même le statut privilégié pour démarrer : démarches simplifiées, pas de comptabilité complexe, cotisations proportionnelles au chiffre d\'affaires. Attention cependant : votre activité doit être déclarée sous le code APE 5610C (Restauration rapide hors restaurant), et vous devez respecter le seuil de CA de 188 700€ pour rester en micro-entreprise (seuil 2026).',
        },
        {
          q: 'Quel est le seuil de chiffre d\'affaires pour un food truck en auto-entrepreneur ?',
          a: 'En 2026, le seuil de chiffre d\'affaires pour rester auto-entrepreneur dans la restauration (activité de vente de marchandises et produits consommables) est de 188 700€ hors taxes par an. Au-delà, vous devrez passer à un autre régime (SARL, SAS, EURL...). Ce seuil est relevé régulièrement, vérifiez les chiffres officiels sur autoentrepreneur.urssaf.fr.',
        },
        {
          q: 'Quels permis faut-il pour un food truck auto-entrepreneur ?',
          a: 'Pour exploiter un food truck en auto-entrepreneur, vous avez besoin de plusieurs documents : 1) La formation HACCP (hygiène alimentaire, obligatoire) ; 2) Le permis de conduire adapté au poids total de votre véhicule (permis B suffisant jusqu\'à 3,5 tonnes) ; 3) Une autorisation d\'occupation du domaine public ou une place sur un marché pour chaque emplacement ; 4) Un certificat d\'aptitude professionnelle ou une attestation de stage si vous n\'avez pas d\'expérience en restauration.',
        },
        {
          q: 'Quelles assurances obligatoires pour un food truck ?',
          a: 'En tant qu\'auto-entrepreneur food truck, vous devez souscrire à plusieurs assurances : 1) Responsabilité civile professionnelle (RCP) — obligatoire, couvre les dommages causés à vos clients ; 2) Assurance véhicule professionnelle couvrant l\'usage commercial du camion ; 3) Assurance des marchandises et du matériel professionnel. Le coût moyen tourne autour de 150-300€/mois pour l\'ensemble de ces garanties.',
        },
        {
          q: 'Combien de cotisations paie-t-on en auto-entrepreneur food truck ?',
          a: 'Les cotisations sociales d\'un auto-entrepreneur en restauration/vente représentent environ 12,3% du chiffre d\'affaires encaissé (taux 2026 pour les activités de vente). À cela s\'ajoute la CFE (cotisation foncière des entreprises) dès la deuxième année, et l\'impôt sur le revenu selon votre situation (versement libératoire possible à 1% du CA). En résumé, prévoyez environ 15-20% de votre CA pour les charges obligatoires.',
        },
        {
          q: 'Auto-entrepreneur ou SARL pour un food truck : que choisir ?',
          a: 'L\'auto-entrepreneur est idéal pour démarrer : zéro frais fixe, charges proportionnelles, déclarations trimestrielles simples. C\'est la bonne option si vous générez moins de 100 000€/an. Au-delà, la SARL ou SAS devient intéressante pour optimiser votre fiscalité, vous salarier, et protéger votre patrimoine personnel. Beaucoup de food truckers commencent en micro-entreprise et migrent vers une société après 2-3 ans d\'activité.',
        },
      ]
    : [
        {
          q: 'Can you open a food truck as a sole trader in France?',
          a: 'Yes, it is entirely possible to set up a food truck under the auto-entrepreneur (sole trader / micro-enterprise) status. It is actually the preferred status for getting started: simplified registration, no complex accounting, contributions proportional to turnover. However, your activity must be registered under APE code 5610C (Fast food outside restaurants), and you must stay within the €188,700 turnover threshold to remain in the micro-enterprise scheme (2026 threshold).',
        },
        {
          q: 'What is the turnover limit for a food truck sole trader?',
          a: 'In 2026, the turnover limit to remain an auto-entrepreneur in catering (sale of goods and consumable products) is €188,700 excluding tax per year. Beyond this, you will need to switch to another legal structure (SARL, SAS, EURL...). This threshold is revised regularly — check the official figures at autoentrepreneur.urssaf.fr.',
        },
        {
          q: 'What permits are required for a food truck sole trader?',
          a: 'To operate a food truck as a sole trader, you need several documents: 1) HACCP food hygiene training (mandatory); 2) A driving licence appropriate for your vehicle\'s gross weight (standard category B suffices up to 3.5 tonnes); 3) A public space occupation permit or market stall allocation for each location; 4) A vocational certificate or training attestation if you have no prior catering experience.',
        },
        {
          q: 'What insurance is mandatory for a food truck?',
          a: 'As a food truck sole trader, you must take out several types of insurance: 1) Professional liability insurance (RCP) — mandatory, covers damage caused to customers; 2) Professional vehicle insurance covering the commercial use of your truck; 3) Insurance for goods and professional equipment. Average combined cost is around €150–300/month.',
        },
        {
          q: 'How much do sole trader contributions cost for a food truck?',
          a: 'Social contributions for an auto-entrepreneur in catering/retail represent approximately 12.3% of collected turnover (2026 rate for sales activities). On top of that, CFE (business property tax) is due from the second year, plus income tax depending on your situation (optional flat-rate withholding at 1% of turnover). Budget around 15–20% of your turnover for mandatory charges.',
        },
        {
          q: 'Sole trader or limited company for a food truck: which to choose?',
          a: 'The sole trader status is ideal for getting started: no fixed costs, proportional charges, simple quarterly declarations. It is the right option if you generate less than €100,000/year. Beyond that, a SARL or SAS becomes interesting to optimise your tax, pay yourself a salary, and protect your personal assets. Many food truckers start as a micro-enterprise and switch to a company structure after 2–3 years of operation.',
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

  const steps = isFr
    ? [
        {
          number: '01',
          title: 'Choisir le statut juridique',
          desc: 'L\'auto-entrepreneur (micro-entreprise) est le statut idéal pour démarrer. Démarches en ligne en 15 minutes sur autoentrepreneur.urssaf.fr. Code APE 5610C pour la restauration rapide.',
          icon: <BookOpen className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '02',
          title: 'Se former à l\'hygiène alimentaire (HACCP)',
          desc: 'Formation obligatoire pour toute personne manipulant des denrées alimentaires. Durée : 14 heures, coût : 150-300€. Nombreux organismes agréés disponibles en ligne ou en présentiel.',
          icon: <Shield className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '03',
          title: 'Trouver et équiper votre food truck',
          desc: 'Achat d\'un truck neuf (50-100k€) ou d\'occasion (15-40k€). Équipement cuisine : friteuse, plancha, réfrigération. Vérifiez la conformité aux normes sanitaires avec un vétérinaire officiel de votre DDPP.',
          icon: <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '04',
          title: 'Obtenir vos autorisations d\'emplacement',
          desc: 'Contactez la mairie pour les marchés et domaine public. Les marchés privés nécessitent un accord du propriétaire. Certaines communes ont des règlements stricts : renseignez-vous en amont.',
          icon: <TrendingUp className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '05',
          title: 'Souscrire vos assurances',
          desc: 'RC professionnelle, assurance véhicule commercial, protection marchandises. Budget : 150-300€/mois. Comparez plusieurs offres : certains assureurs sont spécialisés en food truck.',
          icon: <CreditCard className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '06',
          title: 'Mettre en place votre gestion',
          desc: 'Terminal de paiement (SumUp est le plus utilisé), logiciel de caisse, gestion de stock. FoodTracks s\'intègre directement à SumUp pour suivre vos ventes et prédire vos besoins en stock.',
          icon: <BarChart3 className="h-6 w-6" style={{ color: ORANGE }} />,
        },
      ]
    : [
        {
          number: '01',
          title: 'Choose your legal structure',
          desc: 'The auto-entrepreneur (micro-enterprise) status is ideal for getting started. Register online in 15 minutes at autoentrepreneur.urssaf.fr. APE code 5610C for fast food catering.',
          icon: <BookOpen className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '02',
          title: 'Complete your food hygiene training (HACCP)',
          desc: 'Mandatory training for anyone handling food products. Duration: 14 hours, cost: €150–300. Many approved providers are available online or in person.',
          icon: <Shield className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '03',
          title: 'Find and equip your food truck',
          desc: 'Buy new (€50–100k) or second-hand (€15–40k). Kitchen equipment: fryer, griddle, refrigeration. Verify sanitary compliance with an official vet from your local DDPP.',
          icon: <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '04',
          title: 'Obtain your location permits',
          desc: 'Contact your local town hall for markets and public spaces. Private markets require the landowner\'s agreement. Some municipalities have strict regulations — check in advance.',
          icon: <TrendingUp className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '05',
          title: 'Take out your insurance',
          desc: 'Professional liability, commercial vehicle insurance, goods protection. Budget: €150–300/month. Compare several offers — some insurers specialise in food trucks.',
          icon: <CreditCard className="h-6 w-6" style={{ color: ORANGE }} />,
        },
        {
          number: '06',
          title: 'Set up your business management',
          desc: 'Payment terminal (SumUp is the most widely used), POS software, stock management. FoodTracks integrates directly with SumUp to track your sales and predict your stock needs.',
          icon: <BarChart3 className="h-6 w-6" style={{ color: ORANGE }} />,
        },
      ];

  const warnings = isFr
    ? [
        'Le statut auto-entrepreneur ne permet pas de récupérer la TVA sur vos achats. Si vos charges d\'approvisionnement sont élevées, cela peut impacter votre rentabilité.',
        'Au-delà de 188 700€ de CA, vous devez changer de régime. Anticipez ce seuil pour éviter une transition forcée en cours d\'année.',
        'L\'auto-entrepreneur est responsable sur ses biens personnels. Pensez à souscrire une assurance RC pro solide et à tenir une comptabilité rigoureuse.',
        'Certaines communes limitent les autorisations de food trucks. Vérifiez la réglementation locale avant d\'investir.',
      ]
    : [
        'The sole trader status does not allow you to reclaim VAT on your purchases. If your supply costs are high, this can impact your profitability.',
        'Above €188,700 in turnover, you must change your legal structure. Plan ahead to avoid a forced transition mid-year.',
        'As a sole trader, you are personally liable for debts. Take out solid professional liability insurance and keep rigorous accounts.',
        'Some municipalities restrict food truck permits. Check local regulations before investing.',
      ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LandingHeader />

      {/* HERO */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 10% 30%, rgba(249,115,22,0.12) 0%, transparent 55%),
                       radial-gradient(ellipse 70% 50% at 90% 70%, rgba(20,184,166,0.08) 0%, transparent 50%),
                       #07111E`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16 max-w-4xl">
          <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: '#6B7280' }}>
            <Link href={`/${locale}`} className="hover:text-white transition-colors">FoodTracks</Link>
            <span>/</span>
            <Link href={`/${locale}/guides`} className="hover:text-white transition-colors">{isFr ? 'Guides' : 'Guides'}</Link>
            <span>/</span>
            <span style={{ color: ORANGE }}>{isFr ? 'Auto-entrepreneur food truck' : 'Food truck sole trader'}</span>
          </nav>

          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border mb-6"
            style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
          >
            <BookOpen className="h-4 w-4" />
            {isFr ? 'Guide complet · 2026' : 'Complete guide · 2026'}
          </div>

          <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {isFr
              ? <>Ouvrir un food truck en<br /><span style={{ color: ORANGE }}>auto-entrepreneur</span></>
              : <>Open a food truck as a<br /><span style={{ color: ORANGE }}>sole trader</span></>}
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: '#9CA3AF' }}>
            {isFr
              ? 'Démarches URSSAF, permis, assurances, seuils de CA, cotisations — tout ce qu\'il faut savoir pour lancer votre food truck sous le régime micro-entreprise en 2026.'
              : 'URSSAF registration, permits, insurance, turnover thresholds, contributions — everything you need to launch your food truck under the micro-enterprise scheme in 2026.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/register`}>
              <button
                className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-8 py-4 text-white"
                style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.4)' }}
              >
                <Package className="h-4 w-4" />
                {isFr ? 'Démarrer FoodTracks gratuitement' : 'Start FoodTracks for free'}
              </button>
            </Link>
            <a href="#etapes">
              <button
                className="btn-landing btn-outline-dark inline-flex items-center justify-center rounded-full font-semibold px-8 py-4 border"
                style={{ borderColor: 'rgba(249,115,22,0.25)', color: '#D1D5DB', backgroundColor: 'transparent' }}
              >
                {isFr ? 'Voir les étapes' : 'See the steps'}
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* INTRO / STATUT */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
              {isFr ? 'L\'auto-entrepreneur, le statut idéal pour démarrer en food truck' : 'The sole trader status — ideal for starting a food truck'}
            </h2>
            <p className="mb-4">
              {isFr
                ? 'Le régime de l\'auto-entrepreneur (ou micro-entreprise) est le choix n°1 des food truckers débutants en France. Il offre une simplicité administrative inégalée : inscription en ligne en quelques minutes, pas de bilan comptable obligatoire, cotisations sociales calculées directement sur votre chiffre d\'affaires réel.'
                : 'The auto-entrepreneur (or micro-enterprise) scheme is the number one choice for beginner food truckers in France. It offers unmatched administrative simplicity: online registration in minutes, no mandatory accounting statements, social contributions calculated directly on your actual turnover.'}
            </p>
            <p className="mb-4">
              {isFr
                ? 'Contrairement aux idées reçues, l\'auto-entrepreneur est parfaitement adapté à la restauration ambulante. Des milliers de food truckers opèrent sous ce statut chaque année avec succès. La clé est de bien connaître les règles du jeu : seuils de CA, obligations sanitaires, autorisations d\'emplacement et gestion de la trésorerie.'
                : 'Contrary to popular belief, the sole trader status is perfectly suited to mobile catering. Thousands of food truckers operate under this status successfully every year. The key is to know the rules of the game: turnover thresholds, sanitary obligations, location permits, and cash flow management.'}
            </p>
          </div>

          {/* Key figures */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                stat: '188 700€',
                label: isFr ? 'Seuil de CA 2026' : '2026 turnover threshold',
                sub: isFr ? 'Pour rester micro-entreprise' : 'To remain micro-enterprise',
              },
              {
                stat: '12,3%',
                label: isFr ? 'Taux de cotisations' : 'Contribution rate',
                sub: isFr ? 'Sur CA encaissé (restauration)' : 'On collected turnover (catering)',
              },
              {
                stat: '15 min',
                label: isFr ? 'Pour s\'inscrire' : 'To register',
                sub: isFr ? 'Sur autoentrepreneur.urssaf.fr' : 'At autoentrepreneur.urssaf.fr',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#FFF8F5', border: '1px solid rgba(249,115,22,0.15)' }}>
                <div className="font-jakarta text-3xl font-extrabold mb-1" style={{ color: ORANGE }}>{item.stat}</div>
                <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="etapes" className="py-24 md:py-32 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-4">
              {isFr ? 'Les 6 étapes pour ouvrir votre food truck' : 'The 6 steps to open your food truck'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Du statut juridique à votre premier service — le parcours complet.'
                : 'From legal structure to your first service — the complete roadmap.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-7"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="text-3xl font-extrabold font-jakarta flex-shrink-0"
                    style={{ color: 'rgba(249,115,22,0.4)' }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {step.icon}
                      <h3 className="font-jakarta text-lg font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WARNINGS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 max-w-4xl">
          <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-8">
            {isFr ? 'Points de vigilance — auto-entrepreneur food truck' : 'Key watch-outs — food truck sole trader'}
          </h2>
          <div className="space-y-4">
            {warnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{ backgroundColor: '#FFFBF5', border: '1px solid rgba(249,115,22,0.20)' }}
              >
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                <p className="text-sm text-gray-700 leading-relaxed">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GESTION SECTION */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-4">
                {isFr
                  ? 'La gestion : votre levier pour rester rentable'
                  : 'Management: your lever for staying profitable'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {isFr
                  ? 'En auto-entrepreneur, chaque euro compte. Contrairement à une société, vous ne pouvez pas reporter vos pertes ni récupérer la TVA. La gestion rigoureuse de votre stock, de vos ventes et de vos coûts est la clé pour rester dans les clous et croître sereinement.'
                  : 'As a sole trader, every euro counts. Unlike a company, you cannot carry forward losses or reclaim VAT. Rigorous management of your stock, sales, and costs is the key to staying on track and growing with peace of mind.'}
              </p>
              <ul className="space-y-3">
                {(isFr
                  ? [
                      'Suivez vos ventes quotidiennement par emplacement',
                      'Anticipez vos besoins en stock avec les prédictions IA',
                      'Identifiez vos plats les plus rentables',
                      'Synchronisez votre SumUp pour une comptabilité automatique',
                    ]
                  : [
                      'Track your daily sales by location',
                      'Anticipate your stock needs with AI predictions',
                      'Identify your most profitable dishes',
                      'Sync your SumUp for automatic bookkeeping',
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-8 border-2" style={{ borderColor: ORANGE, backgroundColor: '#FFF8F5' }}>
              <div className="flex items-center gap-3 mb-4">
                <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
                <span className="font-jakarta text-lg font-bold text-gray-900">FoodTracks</span>
                <span
                  className="ml-auto text-xs px-3 py-1 rounded-full font-semibold text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isFr ? 'Gratuit' : 'Free'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {isFr
                  ? 'Le logiciel de gestion conçu pour les food trucks. Intégration SumUp native, prédictions IA, suivi de stock en temps réel. Plan gratuit permanent.'
                  : 'The management software built for food trucks. Native SumUp integration, AI predictions, real-time stock tracking. Permanent free plan.'}
              </p>
              <div className="space-y-2 mb-6">
                {(isFr
                  ? ['Intégration SumUp en 2 clics', 'Prédictions de ventes IA', 'Gestion de stock temps réel', 'Scan de factures fournisseurs', 'Dashboard rentabilité']
                  : ['SumUp integration in 2 clicks', 'AI sales predictions', 'Real-time stock management', 'Supplier invoice scanning', 'Profitability dashboard']
                ).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: '#22C55E' }} />
                    {feature}
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/register`}>
                <button
                  className="w-full py-3 rounded-xl font-bold text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isFr ? 'Démarrer gratuitement' : 'Start for free'}
                </button>
              </Link>
              <p className="text-xs text-gray-400 text-center mt-2">{isFr ? 'Sans carte de crédit' : 'No credit card'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 max-w-4xl">
          <h2 className="font-jakarta text-3xl font-bold text-gray-900 text-center mb-12">
            {isFr ? 'Questions fréquentes — Food truck auto-entrepreneur' : 'FAQ — Food truck sole trader'}
          </h2>
          <div className="max-w-2xl mx-auto">
            {faqData.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 max-w-4xl">
          <h2 className="font-jakarta text-xl font-bold text-gray-900 mb-6">
            {isFr ? 'Aller plus loin' : 'Go further'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                href: `/${locale}/guides/gestion-food-truck`,
                label: isFr ? 'Guide complet : gérer son food truck' : 'Complete guide: managing your food truck',
              },
              {
                href: `/${locale}/guides/seuil-rentabilite-food-truck`,
                label: isFr ? 'Calculer le seuil de rentabilité de son food truck' : 'Calculate your food truck break-even point',
              },
              {
                href: `/${locale}/guides/food-truck-reglementation-france`,
                label: isFr ? 'Réglementation food truck en France 2026' : 'Food truck regulations in France 2026',
              },
              {
                href: `/${locale}/fonctionnalites/gestion-stock`,
                label: isFr ? 'Gestion de stock en temps réel — FoodTracks' : 'Real-time stock management — FoodTracks',
              },
              {
                href: `/${locale}/fonctionnalites/integration-sumup`,
                label: isFr ? 'Connecter SumUp à FoodTracks' : 'Connect SumUp to FoodTracks',
              },
              {
                href: `/${locale}/comparatif/inpulse-vs-foodtracks`,
                label: isFr ? 'FoodTracks vs Inpulse : comparatif' : 'FoodTracks vs Inpulse: comparison',
              },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4 transition-colors"
                style={{ color: ORANGE }}
              >
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Lancez votre food truck.<br /><span style={{ color: ORANGE }}>FoodTracks s&rsquo;occupe du reste.</span></>
                : <>Launch your food truck.<br /><span style={{ color: ORANGE }}>FoodTracks handles the rest.</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Stock, prédictions IA, intégration SumUp — le logiciel de gestion conçu pour les food truckers auto-entrepreneurs. Gratuit, sans engagement.'
                : 'Stock, AI predictions, SumUp integration — the management software built for food truck sole traders. Free, no commitment.'}
            </p>
            <Link href={`/${locale}/register`}>
              <button
                className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-14 py-5 text-lg text-white"
                style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
              >
                <ArrowRight className="h-5 w-5" />
                {isFr ? 'Commencer gratuitement' : 'Get started free'}
              </button>
            </Link>
            <p className="text-sm text-white/60">{isFr ? 'Gratuit · Sans carte de crédit' : 'Free · No credit card'}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-12"
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
    </>
  );
}
