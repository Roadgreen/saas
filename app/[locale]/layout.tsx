import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const metaByLocale: Record<string, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "FoodTracks — Smart Inventory Management for Food Trucks & Restaurants",
    description: "AI-powered sales predictions, real-time stock tracking, and margin analytics for food trucks and restaurants. Free to start.",
    keywords: [
      "restaurant inventory management",
      "food truck stock tracking",
      "restaurant management software",
      "food waste reduction",
      "AI sales predictions",
      "restaurant analytics",
      "inventory tracking app",
    ],
  },
  fr: {
    title: "FoodTracks — Gestion de stock intelligente pour food trucks & restaurants",
    description: "Prédictions IA, suivi de stock en temps réel et analyse des marges pour food trucks et restaurants. Gratuit pour commencer.",
    keywords: [
      "gestion des stocks restaurant",
      "inventaire restaurant logiciel",
      "suivi des stocks restauration",
      "application gestion restaurant",
      "réduction gaspillage alimentaire",
      "prédictions ventes restaurant",
      "logiciel food truck",
    ],
  },
};

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] ?? metaByLocale.fr;
  const url = `${BASE_URL}/${locale}`;
  const altLocale = locale === 'fr' ? 'en' : 'fr';
  return {
    title: {
      default: meta.title,
      template: '%s | FoodTracks',
    },
    description: meta.description,
    keywords: meta.keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: { [altLocale]: `${BASE_URL}/${altLocale}` },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks — Restaurant inventory management' }],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FoodTracks',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: locale === 'fr'
      ? "Logiciel de gestion des stocks et d'inventaire pour food trucks et restaurants."
      : 'Inventory management software for food trucks and restaurants.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@foodtracks.io',
      contactType: 'customer service',
    },
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FoodTracks',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: BASE_URL,
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        name: 'Free',
        description: locale === 'fr' ? '1 emplacement, fonctionnalités de base' : '1 location, basic features',
      },
      {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'EUR',
        name: 'Pro',
        description: locale === 'fr' ? 'Emplacements illimités, IA, analyses avancées' : 'Unlimited locations, AI, advanced analytics',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body className={`${poppins.className} ${jakarta.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <AnalyticsProvider locale={locale}>
              {children}
              <Toaster />
            </AnalyticsProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
