import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChefHat, Scale } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const DARK   = '#0D0905';

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
    ? 'FoodTracks vs Concurrents — Comparatifs Logiciels Food Truck 2026'
    : 'FoodTracks vs Competitors — Food Truck Software Comparisons 2026';
  const description = isFr
    ? 'Comparez FoodTracks à Inpulse, MarketMan, Melba : prix, IA, intégrations, ergonomie. Choisissez le bon logiciel pour votre food truck.'
    : 'Compare FoodTracks with Inpulse, MarketMan and Melba: pricing, AI, integrations, UX. Pick the right software for your food truck.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/comparatif`,
      languages: {
        fr: `${BASE_URL}/fr/comparatif`,
        en: `${BASE_URL}/en/comparatif`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/comparatif`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks comparisons' }],
      type: 'website',
    },
  };
}

const COMPARISONS: Array<{
  slug: string;
  competitor: string;
  tagline: { fr: string; en: string };
  edge: { fr: string; en: string };
}> = [
  {
    slug: 'inpulse-vs-foodtracks',
    competitor: 'Inpulse',
    tagline: {
      fr: 'Logiciel restauration vs gestion food truck spécialisée',
      en: 'Restaurant software vs dedicated food truck management',
    },
    edge: {
      fr: 'FoodTracks coûte moins cher, intègre SumUp nativement et ajoute des prédictions IA par emplacement.',
      en: 'FoodTracks costs less, integrates SumUp natively and adds AI predictions per location.',
    },
  },
  {
    slug: 'marketman-vs-foodtracks',
    competitor: 'MarketMan',
    tagline: {
      fr: 'Gestion de stock restaurant vs food truck mobile-first',
      en: 'Restaurant inventory vs mobile-first food truck software',
    },
    edge: {
      fr: 'FoodTracks est mobile-first, pensé pour le terrain, avec un plan gratuit permanent.',
      en: 'FoodTracks is mobile-first, built for the field, with a permanent free plan.',
    },
  },
  {
    slug: 'melba-vs-foodtracks',
    competitor: 'Melba',
    tagline: {
      fr: 'App de gestion culinaire vs suite opérationnelle food truck',
      en: 'Culinary management app vs operational food truck suite',
    },
    edge: {
      fr: 'FoodTracks couvre stock + ventes + prédictions + scan de factures en une seule plateforme.',
      en: 'FoodTracks covers stock + sales + predictions + invoice scanning in a single platform.',
    },
  },
];

export default async function ComparatifIndexPage({
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
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isFr ? 'Comparatifs FoodTracks vs concurrents' : 'FoodTracks vs competitors comparisons',
    itemListElement: COMPARISONS.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/${locale}/comparatif/${c.slug}`,
      name: `FoodTracks vs ${c.competitor}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <LandingHeader />

      {/* HERO */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(249,115,22,0.14) 0%, transparent 50%),
                       radial-gradient(ellipse 80% 60% at 100% 75%, rgba(20,184,166,0.10) 0%, transparent 50%),
                       #07111E`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: '#6B7280' }}>
              <Link href={`/${locale}`} className="hover:text-white transition-colors">FoodTracks</Link>
              <span>/</span>
              <span style={{ color: ORANGE }}>{isFr ? 'Comparatifs' : 'Comparisons'}</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <Scale className="h-4 w-4" />
              {isFr ? 'Comparez en toute transparence' : 'Compare transparently'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>FoodTracks vs <span style={{ color: ORANGE }}>alternatives</span></>
                : <>FoodTracks vs <span style={{ color: ORANGE }}>alternatives</span></>}
            </h1>

            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Des comparatifs honnêtes, mis à jour en 2026 : prix, fonctionnalités, IA, intégrations et ce pour quoi chaque outil est réellement fait.'
                : 'Honest comparisons, updated for 2026: pricing, features, AI, integrations and what each tool is actually built for.'}
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid gap-6 max-w-4xl mx-auto">
            {COMPARISONS.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/comparatif/${c.slug}`}
                className="group block rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDEBE8' }}
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-jakarta text-xl md:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      FoodTracks vs {c.competitor}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {isFr ? c.tagline.fr : c.tagline.en}
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mt-4 leading-relaxed">
                      {isFr ? c.edge.fr : c.edge.en}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold shrink-0" style={{ color: ORANGE }}>
                    {isFr ? 'Lire le comparatif' : 'Read comparison'}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              {isFr ? <>Essayez par vous-m&ecirc;me</> : <>See for yourself</>}
            </h2>
            <p className="text-lg leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Plan gratuit permanent, sans carte de crédit. Installez FoodTracks et comparez en conditions réelles.'
                : 'Permanent free plan, no credit card. Install FoodTracks and compare in real conditions.'}
            </p>
            <Link href={`/${locale}/register`}>
              <button
                className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4 text-white"
                style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.4)' }}
              >
                <ArrowRight className="h-4 w-4" />
                {isFr ? 'Démarrer gratuitement' : 'Start for free'}
              </button>
            </Link>
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
