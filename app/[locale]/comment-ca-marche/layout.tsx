import type { Metadata } from 'next';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Comment ca marche — FoodTracks en 4 etapes'
    : 'How It Works — FoodTracks in 4 Steps';
  const description = isFr
    ? 'Decouvrez comment FoodTracks simplifie la gestion de votre food truck en 4 etapes : scan de produits, suivi de stock, predictions IA et analyse des marges.'
    : 'Discover how FoodTracks simplifies food truck management in 4 steps: product scanning, stock tracking, AI predictions, and margin analytics.';

  return {
    title,
    description,
    keywords: isFr
      ? ['comment fonctionne foodtracks', 'gestion food truck etapes', 'logiciel food truck', 'suivi stock food truck', 'predictions IA restauration']
      : ['how foodtracks works', 'food truck management steps', 'food truck software', 'food truck stock tracking', 'AI predictions restaurant'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/comment-ca-marche`,
      languages: { fr: `${BASE_URL}/fr/comment-ca-marche`, en: `${BASE_URL}/en/comment-ca-marche` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/comment-ca-marche`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function CommentCaMarcheLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
