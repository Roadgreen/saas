import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat, Shield, Lock, Server, Eye, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Sécurité des données — FoodTracks' : 'Data Security — FoodTracks';
  const description = isFr
    ? 'Découvrez comment FoodTracks protège vos données : chiffrement, hébergement européen, conformité RGPD.'
    : 'Learn how FoodTracks protects your data: encryption, European hosting, GDPR compliance.';
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/security`,
      languages: { fr: `${BASE_URL}/fr/security`, en: `${BASE_URL}/en/security` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/security`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE_URL}/og-image.png`] },
  };
}

const SECURITY_FEATURES_FR = [
  {
    icon: Lock,
    title: 'Chiffrement de bout en bout',
    desc: 'Toutes les communications sont chiffrées via HTTPS/TLS 1.3. Vos mots de passe sont hashés avec bcrypt — même nous ne pouvons pas les lire.',
  },
  {
    icon: Server,
    title: 'Hébergement 100% européen',
    desc: 'Vos données sont stockées sur des serveurs européens (Supabase EU, Vercel). Aucun transfert de données hors UE.',
  },
  {
    icon: Shield,
    title: 'Conformité RGPD',
    desc: 'Droit d\'accès, de rectification et de suppression de vos données à tout moment. Aucune donnée vendue à des tiers.',
  },
  {
    icon: Eye,
    title: 'Zéro tracking publicitaire',
    desc: 'Aucun cookie de tracking, aucun pixel espion, aucune revente de données. Seuls les cookies essentiels au fonctionnement sont utilisés.',
  },
  {
    icon: RefreshCw,
    title: 'Sauvegardes automatiques',
    desc: 'Vos données sont sauvegardées automatiquement plusieurs fois par jour avec redondance géographique.',
  },
  {
    icon: CheckCircle2,
    title: 'Accès sécurisé',
    desc: 'Authentification sécurisée par email avec vérification. Sessions protégées avec tokens JWT signés.',
  },
];

const SECURITY_FEATURES_EN = [
  {
    icon: Lock,
    title: 'End-to-end encryption',
    desc: 'All communications are encrypted via HTTPS/TLS 1.3. Your passwords are hashed with bcrypt — even we can\'t read them.',
  },
  {
    icon: Server,
    title: '100% European hosting',
    desc: 'Your data is stored on European servers (Supabase EU, Vercel). No data transfers outside the EU.',
  },
  {
    icon: Shield,
    title: 'GDPR compliant',
    desc: 'Right to access, rectify, and delete your data at any time. No data sold to third parties.',
  },
  {
    icon: Eye,
    title: 'Zero ad tracking',
    desc: 'No tracking cookies, no spy pixels, no data resale. Only essential cookies for the service to function.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic backups',
    desc: 'Your data is automatically backed up multiple times per day with geographic redundancy.',
  },
  {
    icon: CheckCircle2,
    title: 'Secure access',
    desc: 'Secure email authentication with verification. Sessions protected with signed JWT tokens.',
  },
];

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const features = isFr ? SECURITY_FEATURES_FR : SECURITY_FEATURES_EN;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Sécurité' : 'Security', item: `${BASE_URL}/${locale}/security` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {isFr ? 'Vos données sont en sécurité' : 'Your data is safe'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isFr
              ? 'La sécurité de vos données est notre priorité absolue. Voici comment nous protégeons les informations de votre food truck.'
              : 'The security of your data is our top priority. Here\'s how we protect your food truck information.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all">
                <Icon className="h-6 w-6 text-orange-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        <section className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">
            {isFr ? 'Notre engagement' : 'Our commitment'}
          </h2>
          <ul className="space-y-3">
            {(isFr ? [
              'Aucune revente de données personnelles ou commerciales',
              'Suppression complète de vos données sur simple demande',
              'Transparence totale sur les données collectées',
              'Mises à jour de sécurité régulières',
              'Monitoring 24/7 de nos infrastructures',
            ] : [
              'No resale of personal or commercial data',
              'Complete deletion of your data on request',
              'Full transparency on collected data',
              'Regular security updates',
              '24/7 infrastructure monitoring',
            ]).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {isFr
              ? 'Une question sur la sécurité de vos données ?'
              : 'Questions about the security of your data?'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFr ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
            <a
              href="mailto:contact@foodtracks.io"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {isFr ? 'Contactez-nous' : 'Contact us'}
            </a>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
