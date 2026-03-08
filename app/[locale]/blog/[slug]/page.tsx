import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogArticles, getArticleBySlug, getAllSlugs } from '@/lib/blog/articles';

const BASE_URL = 'https://foodtracks.io';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const isFr = locale === 'fr';
  const lang = isFr ? 'fr' : 'en';
  const title = article.title[lang];
  const description = article.excerpt[lang];

  return {
    title,
    description,
    keywords: article.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        fr: `${BASE_URL}/fr/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | FoodTracks`,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      siteName: 'FoodTracks',
      type: 'article',
      publishedTime: article.date,
      authors: ['FoodTracks'],
      images: article.heroImage
        ? [{ url: `${BASE_URL}${article.heroImage}`, width: 1200, height: 630 }]
        : [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | FoodTracks`,
      description,
      images: article.heroImage ? [`${BASE_URL}${article.heroImage}`] : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const isFr = locale === 'fr';
  const lang = isFr ? 'fr' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title[lang],
    description: article.excerpt[lang],
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/blog/${slug}`,
    },
    keywords: article.keywords.join(', '),
    inLanguage: locale,
    ...(article.heroImage && { image: `${BASE_URL}${article.heroImage}` }),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', 'article h2', 'article p:first-of-type'],
    },
    about: {
      '@type': 'Thing',
      name: article.category[lang],
      description: article.excerpt[lang],
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'FoodTracks Blog',
      url: `${BASE_URL}/${locale}/blog`,
    },
    citation: `FoodTracks — ${isFr ? 'Gestion de stock intelligente pour food trucks' : 'Smart inventory management for food trucks'}. ${BASE_URL}`,
  };

  // FAQ Schema per article (GEO — AI engines love structured Q&A)
  const faqJsonLd = article.faqItems && article.faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question[lang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[lang],
      },
    })),
  } : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'FoodTracks',
        item: `${BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title[lang],
        item: `${BASE_URL}/${locale}/blog/${slug}`,
      },
    ],
  };

  // Find related articles (same category, excluding current)
  const related = blogArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 pt-6 pb-2" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
                FoodTracks
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/blog`} className="hover:text-gray-700 transition-colors">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-[250px]">
              {article.title[lang]}
            </li>
          </ol>
        </nav>

        {/* Article header */}
        <header className="container mx-auto px-4 py-8 max-w-3xl">
          <Link href={`/${locale}/blog`}>
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isFr ? 'Retour au blog' : 'Back to blog'}
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: '#FF6B3520', color: '#FF6B35' }}>
              <Tag className="h-3 w-3" />
              {article.category[lang]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(article.date).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} min {isFr ? 'de lecture' : 'read'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
            {article.title[lang]}
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            {article.excerpt[lang]}
          </p>
        </header>

        {/* Hero image */}
        {article.heroImage && (
          <div className="container mx-auto px-4 max-w-3xl pb-8">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={article.heroImage}
                alt={article.title[lang]}
                width={1200}
                height={675}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Key Takeaway — AI-friendly quotable block */}
        <div className="container mx-auto px-4 max-w-3xl pb-6">
          <div
            className="rounded-2xl p-6 border-l-4"
            style={{ backgroundColor: '#FFF7ED', borderLeftColor: '#F97316' }}
            role="complementary"
            aria-label={isFr ? 'Points clés' : 'Key takeaways'}
          >
            <h2 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
              <span style={{ color: '#F97316' }}>TL;DR</span>
              {isFr ? ' — Ce qu\'il faut retenir' : ' — Key Takeaway'}
            </h2>
            {article.keyTakeaways && article.keyTakeaways[lang].length > 0 ? (
              <ul className="text-sm text-gray-700 leading-relaxed space-y-1.5 list-disc list-inside">
                {article.keyTakeaways[lang].map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">
                {article.excerpt[lang]}
              </p>
            )}
          </div>
        </div>

        {/* Article content */}
        <article className="container mx-auto px-4 max-w-3xl pb-16">
          <div
            className="prose prose-lg prose-gray max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-li:text-gray-700
              prose-strong:text-gray-900
              prose-a:text-[#FF6B35] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(article.content[lang]),
            }}
          />

          {/* FAQ per article — GEO + rich snippets */}
          {article.faqItems && article.faqItems.length > 0 && (
            <div className="mt-12 p-6 rounded-2xl" style={{ backgroundColor: '#F8F6F3', border: '1px solid #E8E2DC' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isFr ? 'Questions fréquentes' : 'Frequently Asked Questions'}
              </h2>
              <dl className="space-y-4">
                {article.faqItems.map((faq, i) => (
                  <div key={i}>
                    <dt className="font-semibold text-gray-900 text-sm">{faq.question[lang]}</dt>
                    <dd className="text-sm text-gray-600 mt-1">{faq.answer[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl text-center" style={{ backgroundColor: '#FF6B3510', border: '1px solid #FF6B3530' }}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isFr
                ? 'Prêt à optimiser votre food truck ?'
                : 'Ready to optimize your food truck?'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isFr
                ? 'Essayez FoodTracks gratuitement — aucune carte bancaire requise.'
                : 'Try FoodTracks for free — no credit card required.'}
            </p>
            <Link href={`/${locale}/pricing`}>
              <Button className="text-white font-semibold px-6 py-2.5" style={{ backgroundColor: '#FF6B35' }}>
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
              </Button>
            </Link>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="container mx-auto px-4 max-w-5xl pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isFr ? 'Articles similaires' : 'Related articles'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/${locale}/blog/${r.slug}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all h-full flex flex-col">
                    {r.heroImage && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={r.heroImage}
                          alt={r.title[lang]}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-xs font-medium px-2 py-1 rounded-full self-start mb-3" style={{ backgroundColor: '#FF6B3515', color: '#FF6B35' }}>
                        {r.category[lang]}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 mb-2">
                        {r.title[lang]}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-auto">
                        {r.excerpt[lang]}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/** Simple markdown to HTML converter for blog content */
function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Paragraphs: wrap non-tag lines
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<[hulo]/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

  return html;
}
