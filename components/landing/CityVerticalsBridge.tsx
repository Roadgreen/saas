import Link from 'next/link';
import { Wheat, Sandwich, IceCream, Coffee, Tent } from 'lucide-react';

interface Props {
  locale: 'fr' | 'en' | string;
  cityName: string;
}

const ITEMS = [
  { slug: 'boulangerie', Icon: Wheat,    fr: { name: 'Boulangerie & pâtisserie', use: 'Réduire les invendus quotidiens' }, en: { name: 'Bakery & pastry shop',  use: 'Cut daily bread waste' } },
  { slug: 'snack',       Icon: Sandwich, fr: { name: 'Snack & sandwicherie',     use: 'Calibrer le rush du midi' },         en: { name: 'Snack bar & sandwiches', use: 'Master the lunch rush' } },
  { slug: 'glacier',     Icon: IceCream, fr: { name: 'Glacier artisanal',        use: 'Anticiper la météo' },                en: { name: 'Ice cream shop',         use: 'Anticipate the weather' } },
  { slug: 'cafe',        Icon: Coffee,   fr: { name: 'Café & coffee shop',       use: 'Pâtisseries et boissons' },           en: { name: 'Café & coffee shop',     use: 'Pastries and drinks' } },
  { slug: 'marche',      Icon: Tent,     fr: { name: 'Marchand de marché',       use: 'Quantité par marché' },               en: { name: 'Market stallholder',     use: 'Load per market day' } },
] as const;

export function CityVerticalsBridge({ locale, cityName }: Props) {
  const isFr = locale === 'fr';
  const lang: 'fr' | 'en' = isFr ? 'fr' : 'en';

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#F97316', letterSpacing: '0.1em' }}>
              {isFr ? 'Pas seulement les food trucks' : 'Not just food trucks'}
            </p>
            <h2 className="font-jakarta text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#0D0905' }}>
              {isFr
                ? <>FoodTracks pour tous les commerces alimentaires à <span style={{ color: '#F97316' }}>{cityName}</span></>
                : <>FoodTracks for every food business in <span style={{ color: '#F97316' }}>{cityName}</span></>}
            </h2>
            <p className="mt-3 text-base max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              {isFr
                ? 'Le même moteur de prévision et de gestion, adapté à votre métier.'
                : 'The same forecasting and inventory engine, tuned to your trade.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ITEMS.map(({ slug, Icon, ...item }) => (
              <Link
                key={slug}
                href={`/${locale}/${slug}`}
                data-track-component={`city-bridge-${slug}`}
                className="group rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: '#FAFAF8', border: '1px solid #E5E0DB' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.18)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: '#F97316' }} />
                </div>
                <span className="font-semibold text-sm leading-tight" style={{ color: '#111827' }}>
                  {item[lang].name}
                </span>
                <span className="text-xs leading-snug" style={{ color: '#6B7280' }}>
                  {item[lang].use}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
