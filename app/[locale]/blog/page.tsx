import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogArticles } from '@/lib/blog/articles';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Blog Food Truck — Guides, conseils et astuces | FoodTracks'
    : 'Food Truck Blog — Guides, Tips & Best Practices | FoodTracks';
  const description = isFr
    ? 'Guides pratiques, conseils et stratégies pour gérer et développer votre food truck : gestion de stock, emplacements, rentabilité, réglementation.'
    : 'Practical guides, tips, and strategies to manage and grow your food truck: inventory management, locations, profitability, regulations.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: { fr: `${BASE_URL}/fr/blog`, en: `${BASE_URL}/en/blog` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const lang = isFr ? 'fr' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: isFr ? 'Blog FoodTracks' : 'FoodTracks Blog',
    description: isFr
      ? 'Guides et conseils pour les food truckers'
      : 'Guides and tips for food truckers',
    url: `${BASE_URL}/${locale}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
    },
    blogPost: blogArticles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title[lang],
      description: a.excerpt[lang],
      datePublished: a.date,
      url: `${BASE_URL}/${locale}/blog/${a.slug}`,
    })),
  };

  // Sort articles by date (newest first)
  const sorted = [...blogArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/${locale}`}>
              <Button
                variant="ghost"
                size="icon"
                aria-label={isFr ? "Retour à l'accueil" : 'Back to homepage'}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {isFr ? 'Blog FoodTracks' : 'FoodTracks Blog'}
            </h1>
          </div>
          <p className="text-gray-500 mb-10 ml-14">
            {isFr
              ? 'Guides pratiques et stratégies pour développer votre food truck.'
              : 'Practical guides and strategies to grow your food truck.'}
          </p>

          {/* Articles grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((article) => (
              <Link
                key={article.slug}
                href={`/${locale}/blog/${article.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#FF6B3515', color: '#FF6B35' }}
                    >
                      <Tag className="h-3 w-3 inline mr-1" />
                      {article.category[lang]}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min
                    </span>
                  </div>

                  <h2 className="font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 mb-2 text-lg">
                    {article.title[lang]}
                  </h2>

                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                    {article.excerpt[lang]}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      {new Date(article.date).toLocaleDateString(
                        isFr ? 'fr-FR' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </span>
                    <span className="text-sm font-medium text-[#FF6B35] group-hover:underline">
                      {isFr ? 'Lire →' : 'Read →'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
