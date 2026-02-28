import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Politique de Confidentialité' : 'Privacy Policy';
  const description = isFr
    ? 'Politique de confidentialité de FoodTracks. Comment nous protégeons vos données personnelles.'
    : 'FoodTracks privacy policy. How we protect your personal data.';
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${locale}/privacy` },
    openGraph: {
      title: `${title} | FoodTracks`,
      description,
      url: `${BASE_URL}/${locale}/privacy`,
      siteName: 'FoodTracks',
      type: 'website',
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-lg">FoodTracks</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">
          {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {isFr ? 'Dernière mise à jour : 22 février 2026' : 'Last updated: February 22, 2026'}
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '1. Données collectées' : '1. Data We Collect'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Nous collectons les données suivantes : adresse email, nom d'établissement, données de stock et de ventes que vous saisissez, et données de géolocalisation (si vous l'autorisez). Nous ne vendons jamais vos données à des tiers."
                : 'We collect the following data: email address, business name, stock and sales data you enter, and geolocation data (if you allow it). We never sell your data to third parties.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '2. Utilisation des données' : '2. How We Use Your Data'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Vos données sont utilisées uniquement pour le fonctionnement du service : gestion de stock, prédictions IA, analyses de rentabilité. Les données de localisation servent à associer vos ventes à vos emplacements."
                : 'Your data is used solely to operate the service: stock management, AI predictions, and profitability analytics. Location data is used to associate your sales with your selling spots.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '3. Hébergement et sécurité' : '3. Hosting & Security'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Vos données sont hébergées sur des serveurs européens (Supabase, Vercel). Les mots de passe sont chiffrés avec bcrypt. Les connexions sont sécurisées par HTTPS."
                : 'Your data is hosted on European servers (Supabase, Vercel). Passwords are hashed with bcrypt. All connections are secured via HTTPS.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '4. Vos droits (RGPD)' : '4. Your Rights (GDPR)'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Conformément au RGPD, vous avez le droit d'accéder, modifier ou supprimer vos données à tout moment. Contactez-nous à contact@foodtracks.io pour exercer ces droits."
                : 'Under GDPR, you have the right to access, modify, or delete your data at any time. Contact us at contact@foodtracks.io to exercise these rights.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '5. Cookies' : '5. Cookies'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Nous utilisons uniquement des cookies essentiels au fonctionnement du service (session d'authentification). Aucun cookie de tracking ou publicitaire n'est utilisé."
                : 'We only use essential cookies for the service to function (authentication session). No tracking or advertising cookies are used.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '6. Contact' : '6. Contact'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? 'Pour toute question relative à vos données personnelles, contactez-nous à : '
                : 'For any questions regarding your personal data, contact us at: '}
              <a href="mailto:contact@foodtracks.io" className="text-orange-500 hover:underline">
                contact@foodtracks.io
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
