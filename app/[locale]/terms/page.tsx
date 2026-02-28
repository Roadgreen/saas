import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? "Conditions Générales d'Utilisation" : 'Terms of Service';
  const description = isFr
    ? "Conditions générales d'utilisation de FoodTracks. Règles d'utilisation du service."
    : 'FoodTracks terms of service. Rules for using the platform.';
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${locale}/terms` },
    openGraph: {
      title: `${title} | FoodTracks`,
      description,
      url: `${BASE_URL}/${locale}/terms`,
      siteName: 'FoodTracks',
      type: 'website',
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
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
          {isFr ? "Conditions Générales d'Utilisation" : 'Terms of Service'}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {isFr ? 'Dernière mise à jour : 22 février 2026' : 'Last updated: February 22, 2026'}
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? "1. Objet" : '1. Purpose'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Les présentes CGU définissent les conditions d'utilisation de la plateforme FoodTracks accessible à l'adresse foodtracks.io. En créant un compte, vous acceptez ces conditions."
                : 'These Terms of Service define the conditions of use for the FoodTracks platform accessible at foodtracks.io. By creating an account, you accept these terms.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '2. Description du service' : '2. Service Description'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "FoodTracks est un outil de gestion de stock et de prédiction de ventes pour les food trucks et restaurants. Le service propose une gestion d'inventaire, des prédictions par IA, et une analyse de rentabilité."
                : 'FoodTracks is a stock management and sales prediction tool for food trucks and restaurants. The service offers inventory management, AI predictions, and profitability analytics.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '3. Inscription et compte' : '3. Registration & Account'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Vous devez fournir une adresse email valide et un mot de passe sécurisé. Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée depuis votre compte."
                : 'You must provide a valid email address and a secure password. You are responsible for keeping your credentials confidential and for any activity carried out from your account.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '4. Abonnements et paiement' : '4. Subscriptions & Payment'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "FoodTracks propose un plan gratuit et des plans payants (Pro, Entreprise). Les paiements sont traités par Stripe. Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres."
                : 'FoodTracks offers a free plan and paid plans (Pro, Enterprise). Payments are processed by Stripe. You can cancel your subscription at any time from your settings.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '5. Propriété intellectuelle' : '5. Intellectual Property'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Le contenu, le code et le design de FoodTracks sont la propriété exclusive de l'éditeur. Vous conservez la pleine propriété de vos données (produits, recettes, ventes)."
                : 'The content, code, and design of FoodTracks are the exclusive property of the publisher. You retain full ownership of your data (products, recipes, sales).'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '6. Limitation de responsabilité' : '6. Limitation of Liability'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr
                ? "Les prédictions IA sont fournies à titre indicatif. FoodTracks ne saurait être tenu responsable des décisions commerciales prises sur la base de ces prédictions."
                : 'AI predictions are provided for informational purposes only. FoodTracks shall not be held liable for business decisions made based on these predictions.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              {isFr ? '7. Contact' : '7. Contact'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isFr ? 'Pour toute question : ' : 'For any questions: '}
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
