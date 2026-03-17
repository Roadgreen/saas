import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat, HelpCircle, Mail, MessageCircle, Clock, BookOpen, FileQuestion, ArrowLeft } from 'lucide-react';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Support — FoodTracks' : 'Support — FoodTracks';
  const description = isFr
    ? 'Besoin d\'aide avec FoodTracks ? Contactez notre équipe support ou consultez notre FAQ.'
    : 'Need help with FoodTracks? Contact our support team or check our FAQ.';
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/support`,
      languages: { fr: `${BASE_URL}/fr/support`, en: `${BASE_URL}/en/support` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/support`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE_URL}/og-image.png`] },
  };
}

const FAQ_FR = [
  {
    q: 'FoodTracks est-il gratuit ?',
    a: 'FoodTracks propose un essai gratuit de 14 jours. Ensuite, choisissez le plan qui correspond à vos besoins.',
  },
  {
    q: 'Comment scanner mes produits ?',
    a: 'Utilisez l\'appareil photo de votre téléphone directement dans l\'app pour scanner les codes-barres ou QR codes de vos aliments.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Oui, toutes vos données sont chiffrées et hébergées sur des serveurs européens. Nous sommes conformes au RGPD.',
  },
  {
    q: 'Comment fonctionnent les prédictions IA ?',
    a: 'L\'IA analyse votre historique de ventes, le jour de la semaine, la météo et votre emplacement pour prédire la quantité optimale à préparer.',
  },
  {
    q: 'Puis-je connecter mon terminal SumUp ?',
    a: 'Oui ! FoodTracks s\'intègre nativement avec SumUp pour importer automatiquement vos ventes.',
  },
  {
    q: 'Comment annuler mon abonnement ?',
    a: 'Vous pouvez annuler à tout moment depuis votre espace client. Aucun engagement, aucun frais caché.',
  },
];

const FAQ_EN = [
  {
    q: 'Is FoodTracks free?',
    a: 'FoodTracks offers a 14-day free trial. Then choose the plan that fits your needs.',
  },
  {
    q: 'How do I scan my products?',
    a: 'Use your phone camera directly in the app to scan barcodes or QR codes of your products.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes, all your data is encrypted and hosted on European servers. We are fully GDPR compliant.',
  },
  {
    q: 'How do AI predictions work?',
    a: 'AI analyzes your sales history, day of the week, weather, and your location to predict the optimal quantity to prepare.',
  },
  {
    q: 'Can I connect my SumUp terminal?',
    a: 'Yes! FoodTracks natively integrates with SumUp to automatically import your sales.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from your account settings. No commitment, no hidden fees.',
  },
];

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const faq = isFr ? FAQ_FR : FAQ_EN;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Support', item: `${BASE_URL}/${locale}/support` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-lg">FoodTracks</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          {isFr ? 'Retour à l\'accueil' : 'Back to home'}
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-6">
            <HelpCircle className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {isFr ? 'Comment pouvons-nous vous aider ?' : 'How can we help you?'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isFr
              ? 'Notre équipe est là pour vous accompagner dans la gestion de votre food truck.'
              : 'Our team is here to help you manage your food truck.'}
          </p>
        </div>

        {/* Contact options */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <a
            href="mailto:contact@foodtracks.io"
            className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all text-center group"
          >
            <Mail className="h-8 w-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">{isFr ? 'Email' : 'Email'}</h3>
            <p className="text-sm text-gray-500">contact@foodtracks.io</p>
            <p className="text-xs text-gray-400 mt-2">
              {isFr ? 'Réponse sous 24h' : 'Reply within 24h'}
            </p>
          </a>

          <div className="p-6 rounded-xl border border-gray-100 text-center">
            <MessageCircle className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{isFr ? 'Chat en ligne' : 'Live chat'}</h3>
            <p className="text-sm text-gray-500">
              {isFr ? 'Bientôt disponible' : 'Coming soon'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {isFr ? 'Assistance en direct' : 'Live assistance'}
            </p>
          </div>

          <Link
            href={`/${locale}/guides`}
            className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all text-center group"
          >
            <BookOpen className="h-8 w-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">{isFr ? 'Guides' : 'Guides'}</h3>
            <p className="text-sm text-gray-500">
              {isFr ? 'Tutoriels pas à pas' : 'Step-by-step tutorials'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {isFr ? 'Autonomie totale' : 'Full autonomy'}
            </p>
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <FileQuestion className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">
              {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
            </h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="group rounded-xl border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-medium pr-4">{item.q}</span>
                  <span className="text-orange-500 text-xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Response time */}
        <div className="bg-orange-50 rounded-2xl p-8 text-center mb-8">
          <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">
            {isFr ? 'Temps de réponse moyen : moins de 24h' : 'Average response time: under 24h'}
          </h3>
          <p className="text-gray-600 text-sm">
            {isFr
              ? 'Notre équipe répond du lundi au vendredi, de 9h à 18h (heure de Paris).'
              : 'Our team responds Monday to Friday, 9am to 6pm (Paris time).'}
          </p>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isFr ? 'Retour à l\'accueil' : 'Back to home'}
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}
