import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingHeader } from '@/components/landing/Header';
import Link from 'next/link';
import { blogArticles } from '@/lib/blog/articles';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'FAQ — Questions Fréquentes sur FoodTracks (Boulangerie, Food Truck, Snack, Glacier, Café, Marché)'
    : 'FAQ — Frequently Asked Questions about FoodTracks (Bakery, Food Truck, Snack, Ice Cream, Café, Market)';
  const description = isFr
    ? 'Réponses à toutes vos questions sur FoodTracks : compatibilité boulangerie, snack, glacier, café et marché, tarifs, fonctionnalités de gestion, sécurité des données, intégrations SumUp/Stripe et plus encore.'
    : 'Answers to all your questions about FoodTracks: compatibility for bakeries, snack bars, ice cream shops, cafés and market stalls, pricing, management features, data security, SumUp/Stripe integrations and more.';

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

  // Multi-vertical compatibility FAQs
  const compatibilityFaqs: FAQCategory = {
    title: isFr ? 'Compatibilité avec mon commerce' : 'Compatibility with my business',
    items: isFr
      ? [
          {
            question: 'FoodTracks fonctionne-t-il pour une boulangerie ou pâtisserie ?',
            answer: 'Oui. FoodTracks est conçu pour les boulangers : prévisions de production (combien de baguettes demain ?), suivi des ingrédients, gestion des invendus et rentabilité par référence. L\'IA intègre les effets météo et saisonnalité pour affiner les quantités à préparer.',
          },
          {
            question: 'Est-ce que ça marche pour un snack ou une sandwicherie ?',
            answer: 'Oui. Vous pouvez suivre vos stocks de viandes, pains et garnitures, et recevoir chaque matin une estimation de la fréquentation pour ajuster vos achats. L\'intégration SumUp importe vos ventes automatiquement.',
          },
          {
            question: 'Je tiens un glacier — FoodTracks peut m\'aider ?',
            answer: 'Absolument. L\'IA de FoodTracks prend en compte la météo pour ajuster les prévisions de production par parfum. Moins de gaspillage en fin de journée, meilleure maîtrise des coûts matière en haute saison.',
          },
          {
            question: 'J\'ai un café ou coffee shop — est-ce adapté ?',
            answer: 'Oui, FoodTracks gère aussi bien les boissons que la pâtisserie et la restauration légère. Prévisions d\'affluence, stock de matières premières, et suivi de marge par produit, tout dans un seul tableau de bord.',
          },
          {
            question: 'Je suis marchand sur les marchés — ça peut m\'aider ?',
            answer: 'Oui. FoodTracks vous aide à décider la quantité à charger selon la météo, le marché et votre historique. Fini les rotations excessives ou les invendus à rapporter. Fonctionne sans connexion permanente, synchronisation à la fin du marché.',
          },
        ]
      : [
          {
            question: 'Does FoodTracks work for a bakery or pastry shop?',
            answer: 'Yes. FoodTracks is designed for bakers: production forecasts (how many loaves tomorrow?), ingredient tracking, waste management, and margin per product. The AI factors in weather and seasonality to fine-tune how much to prepare.',
          },
          {
            question: 'Does it work for a snack bar or sandwich shop?',
            answer: 'Yes. You can track your stocks of meats, breads, and fillings, and receive a daily footfall estimate to adjust your purchases. The SumUp integration automatically imports your sales.',
          },
          {
            question: 'I run an ice cream shop — can FoodTracks help me?',
            answer: 'Absolutely. FoodTracks AI factors in the weather to adjust production forecasts by flavour. Less end-of-day waste, better control of ingredient costs during peak season.',
          },
          {
            question: 'I have a café or coffee shop — is it a good fit?',
            answer: 'Yes, FoodTracks handles drinks, pastries, and light food equally well. Footfall forecasts, raw material stock, and margin tracking per product, all in one dashboard.',
          },
          {
            question: 'I sell at market stalls — can it help me?',
            answer: 'Yes. FoodTracks helps you decide how much to load up based on the weather, the specific market, and your history. No more over-stocking or leftover produce to carry back. Works without a permanent connection, syncing at the end of market day.',
          },
        ],
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

  const categories = [generalFaqs, compatibilityFaqs, pricingFaqs];
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

          {/* ─── End CTA ─── */}
          <div className="mt-14 rounded-2xl p-8 text-center" style={{ backgroundColor: '#0D0905' }}>
            <h2 className="text-2xl font-bold text-white mb-3">
              {isFr
                ? 'Prêt à optimiser votre commerce ?'
                : 'Ready to optimise your shop?'}
            </h2>
            <p className="text-base mb-6" style={{ color: '#B8B0A8' }}>
              {isFr
                ? 'Boulangerie, food truck, snack, glacier, café ou marché — essayez FoodTracks 14 jours gratuitement.'
                : 'Bakery, food truck, snack bar, ice cream shop, café or market stall — try FoodTracks free for 14 days.'}
            </p>
            <Link
              href={`/${locale}/register?utm_source=faq&utm_medium=cta-end`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#F97316' }}
              data-track-component="faq-cta-end"
            >
              {isFr ? 'Essai gratuit 14 jours' : 'Start free 14-day trial'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
