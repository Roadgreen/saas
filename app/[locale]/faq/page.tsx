import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingHeader } from '@/components/landing/Header';
import { blogArticles } from '@/lib/blog/articles';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'FAQ Food Truck — Questions Fréquentes sur la Gestion' : 'Food Truck FAQ — Frequently Asked Questions';
  const description = isFr
    ? 'Réponses à toutes vos questions sur FoodTracks : tarifs, fonctionnalités de gestion de food truck, sécurité des données, intégrations SumUp/Stripe et plus encore.'
    : 'Answers to all your questions about FoodTracks: pricing, food truck management features, data security, SumUp/Stripe integrations and more.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/faq`,
      languages: { fr: `${BASE_URL}/fr/faq`, en: `${BASE_URL}/en/faq` },
    },
    openGraph: {
      title: `${title} | FoodTracks`,
      description,
      url: `${BASE_URL}/${locale}/faq`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: `${title} | FoodTracks`, description },
  };
}

type FAQCategory = {
  title: string;
  items: { question: string; answer: string }[];
};

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Landing');
  const isFr = locale === 'fr';
  const lang = locale as 'fr' | 'en';

  // General FAQs from landing page
  const generalFaqs: FAQCategory = {
    title: isFr ? 'General' : 'General',
    items: [1, 2, 3, 4, 5, 6, 7].map((i) => ({
      question: t(`faq.q${i}.question`),
      answer: t(`faq.q${i}.answer`),
    })),
  };

  // Pricing FAQs
  const pricingFaqs: FAQCategory = {
    title: isFr ? 'Tarifs et abonnements' : 'Pricing & Plans',
    items: isFr
      ? [
          { question: 'Est-ce que FoodTracks est vraiment gratuit ?', answer: 'Oui, le plan Gratuit est 100% gratuit sans limite de temps. Il inclut 1 utilisateur, 1 emplacement et la gestion de stock de base.' },
          { question: 'Puis-je changer de plan a tout moment ?', answer: 'Oui, vous pouvez passer au plan Pro ou revenir au plan Gratuit a tout moment depuis votre tableau de bord, sans engagement.' },
          { question: 'Y a-t-il un essai gratuit pour le plan Pro ?', answer: 'Oui, le plan Pro inclut un essai gratuit de 14 jours. Aucune carte bancaire requise pour commencer.' },
          { question: 'Quels moyens de paiement acceptez-vous ?', answer: 'Nous acceptons les cartes Visa, Mastercard et les paiements via Stripe. Toutes les transactions sont securisees.' },
          { question: 'Puis-je obtenir un remboursement ?', answer: 'Oui, si vous annulez dans les 14 premiers jours de votre abonnement Pro, vous etes integralement rembourse.' },
        ]
      : [
          { question: 'Is FoodTracks really free?', answer: 'Yes, the Free plan is 100% free with no time limit. It includes 1 user, 1 location, and basic stock management.' },
          { question: 'Can I switch plans at any time?', answer: 'Yes, you can upgrade to Pro or downgrade to Free anytime from your dashboard, with no commitment.' },
          { question: 'Is there a free trial for the Pro plan?', answer: 'Yes, the Pro plan includes a 14-day free trial. No credit card required to get started.' },
          { question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, and payments via Stripe. All transactions are secured.' },
          { question: 'Can I get a refund?', answer: 'Yes, if you cancel within the first 14 days of your Pro subscription, you get a full refund.' },
        ],
  };

  // Blog FAQs (from articles that have faqItems)
  const blogFaqItems = blogArticles
    .filter((a) => a.faqItems && a.faqItems.length > 0)
    .flatMap((a) =>
      a.faqItems!.map((faq) => ({
        question: faq.question[lang],
        answer: faq.answer[lang],
      }))
    )
    .slice(0, 10);

  const blogFaqs: FAQCategory = {
    title: isFr ? 'Depuis notre blog' : 'From our blog',
    items: blogFaqItems,
  };

  const categories = [generalFaqs, pricingFaqs];
  if (blogFaqs.items.length > 0) categories.push(blogFaqs);

  // Aggregate all FAQs for JSON-LD
  const allFaqs = categories.flatMap((c) => c.items);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${BASE_URL}/${locale}/faq` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="flex flex-col min-h-screen">
        <LandingHeader />

        <nav className="container mx-auto px-8 pt-6 pb-0" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><a href={`/${locale}`} className="hover:text-gray-700 transition-colors">FoodTracks</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">FAQ</li>
          </ol>
        </nav>

        <div className="flex-1 p-8 pt-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-2">
              {isFr ? 'Questions frequentes' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12">
              {isFr ? 'Tout ce que vous devez savoir sur FoodTracks.' : 'Everything you need to know about FoodTracks.'}
            </p>

            {categories.map((category, ci) => (
              <section key={ci} className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{category.title}</h2>
                <div className="space-y-3">
                  {category.items.map((faq, i) => (
                    <details key={i} className="group border rounded-lg">
                      <summary className="cursor-pointer px-6 py-4 font-medium text-gray-900 hover:text-orange-600 transition-colors">
                        {faq.question}
                      </summary>
                      <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
