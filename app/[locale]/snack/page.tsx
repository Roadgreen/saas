import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVerticalBySlug } from '@/lib/verticals/data';
import { VerticalLandingTemplate } from '@/components/landing/VerticalLandingTemplate';

const SLUG = 'snack';
const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = getVerticalBySlug(SLUG);
  if (!config) return {};
  const content = config[locale as 'fr' | 'en'] ?? config.fr;
  const keywords = config.keywords[locale as 'fr' | 'en'] ?? config.keywords.fr;

  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `${BASE_URL}/${locale}/${SLUG}`,
      languages: {
        fr: `${BASE_URL}/fr/${SLUG}`,
        en: `${BASE_URL}/en/${SLUG}`,
      },
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${BASE_URL}/${locale}/${SLUG}`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/verticals/${SLUG}.jpg`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const config = getVerticalBySlug(SLUG);
  if (!config) notFound();

  const content = config[locale as 'fr' | 'en'] ?? config.fr;

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.title,
    description: content.metaDescription,
    provider: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    areaServed: { '@type': 'Country', name: 'FR' },
    url: `${BASE_URL}/${locale}/${SLUG}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: content.title, item: `${BASE_URL}/${locale}/${SLUG}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <VerticalLandingTemplate config={config} locale={locale as 'fr' | 'en'} />
    </>
  );
}
