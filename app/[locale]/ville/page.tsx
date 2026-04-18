import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, ChefHat } from 'lucide-react';
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
    ? 'FoodTracks par Ville — Food Trucks dans toute la France'
    : 'FoodTracks by City — Food Trucks across France';
  const description = isFr
    ? 'Retrouvez FoodTracks dans votre ville : Paris, Lyon, Marseille, Bordeaux, Nantes, Toulouse, Strasbourg, Lille, Nice, Rennes, Montpellier. Logiciel de gestion adapté à chaque scène locale.'
    : 'Find FoodTracks in your city: Paris, Lyon, Marseille, Bordeaux, Nantes, Toulouse, Strasbourg, Lille, Nice, Rennes, Montpellier. Management software tailored to each local scene.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville`,
      languages: {
        fr: `${BASE_URL}/fr/ville`,
        en: `${BASE_URL}/en/ville`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks villes' }],
      type: 'website',
    },
  };
}

const CITIES: Array<{
  slug: string;
  name: string;
  region: { fr: string; en: string };
  highlight: { fr: string; en: string };
}> = [
  { slug: 'paris',       name: 'Paris',       region: { fr: 'Île-de-France',     en: 'Île-de-France' },     highlight: { fr: 'Marchés Saint-Ouen, événements BFM et campus',        en: 'Saint-Ouen markets, BFM events and campuses' } },
  { slug: 'lyon',        name: 'Lyon',        region: { fr: 'Auvergne-Rhône-Alpes', en: 'Auvergne-Rhône-Alpes' }, highlight: { fr: 'Fête des Lumières, Vieux-Lyon et quais',              en: 'Fête des Lumières, Vieux-Lyon and quays' } },
  { slug: 'marseille',   name: 'Marseille',   region: { fr: 'Provence-Alpes-Côte d\'Azur', en: 'Provence-Alpes-Côte d\'Azur' }, highlight: { fr: 'Vieux-Port, plages et MP2013',                        en: 'Vieux-Port, beaches and MP2013' } },
  { slug: 'bordeaux',    name: 'Bordeaux',    region: { fr: 'Nouvelle-Aquitaine', en: 'Nouvelle-Aquitaine' }, highlight: { fr: 'Quais, Chartrons et foires aux vins',                 en: 'Quays, Chartrons and wine fairs' } },
  { slug: 'nantes',      name: 'Nantes',      region: { fr: 'Pays de la Loire',  en: 'Pays de la Loire' },  highlight: { fr: 'Île de Nantes, Talensac et Voyage à Nantes',          en: 'Île de Nantes, Talensac and Voyage à Nantes' } },
  { slug: 'toulouse',    name: 'Toulouse',    region: { fr: 'Occitanie',          en: 'Occitanie' },          highlight: { fr: 'Capitole, aéronautique et campus Rangueil',           en: 'Capitole, aerospace district and Rangueil campus' } },
  { slug: 'strasbourg',  name: 'Strasbourg',  region: { fr: 'Grand Est',          en: 'Grand Est' },          highlight: { fr: 'Marchés de Noël, institutions européennes',           en: 'Christmas markets, European institutions' } },
  { slug: 'lille',       name: 'Lille',       region: { fr: 'Hauts-de-France',    en: 'Hauts-de-France' },    highlight: { fr: 'Braderie, Vieux-Lille et campus',                     en: 'Braderie, Vieux-Lille and campuses' } },
  { slug: 'nice',        name: 'Nice',        region: { fr: 'Provence-Alpes-Côte d\'Azur', en: 'Provence-Alpes-Côte d\'Azur' }, highlight: { fr: 'Promenade des Anglais, Carnaval et tourisme',        en: 'Promenade des Anglais, Carnival and tourism' } },
  { slug: 'rennes',      name: 'Rennes',      region: { fr: 'Bretagne',            en: 'Brittany' },           highlight: { fr: 'Marché des Lices, Trans Musicales et campus',        en: 'Lices market, Trans Musicales and campuses' } },
  { slug: 'montpellier', name: 'Montpellier', region: { fr: 'Occitanie',          en: 'Occitanie' },          highlight: { fr: 'Arceaux, climat méditerranéen et festivals',         en: 'Arceaux, Mediterranean climate and festivals' } },
];

export default async function VilleIndexPage({
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isFr ? 'FoodTracks par ville en France' : 'FoodTracks by city in France',
    itemListElement: CITIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/${locale}/ville/${c.slug}`,
      name: c.name,
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
              <span style={{ color: ORANGE }}>{isFr ? 'Villes' : 'Cities'}</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Partout en France' : 'Across France'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>FoodTracks <span style={{ color: ORANGE }}>par ville</span></>
                : <>FoodTracks <span style={{ color: ORANGE }}>by city</span></>}
            </h1>

            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Chaque ville a sa scène food truck — marchés, festivals, événements, climat. FoodTracks s\'adapte à vos spécificités locales.'
                : 'Every city has its own food truck scene — markets, festivals, events, climate. FoodTracks adapts to your local specifics.'}
            </p>
          </div>
        </div>
      </section>

      {/* CITY GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${locale}/ville/${city.slug}`}
                className="group rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDEBE8' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-jakarta text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {city.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">{isFr ? city.region.fr : city.region.en}</p>
                  </div>
                  <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.10)' }}>
                    <MapPin className="h-4 w-4" style={{ color: ORANGE }} />
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 mb-4">
                  {isFr ? city.highlight.fr : city.highlight.en}
                </p>
                <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: ORANGE }}>
                  {isFr ? 'Voir la page' : 'View page'}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
              {isFr
                ? <>Votre ville n&rsquo;est pas list&eacute;e&nbsp;?</>
                : <>Don&rsquo;t see your city?</>}
            </h2>
            <p className="text-lg leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'FoodTracks fonctionne partout en France, en Belgique, Suisse, Luxembourg et au Royaume-Uni. Inscrivez-vous gratuitement pour commencer.'
                : 'FoodTracks works everywhere in France, Belgium, Switzerland, Luxembourg and the UK. Sign up free to get started.'}
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
