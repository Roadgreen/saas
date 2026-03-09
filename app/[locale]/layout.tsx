import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { NativeProvider } from "@/components/providers/NativeProvider";

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
    sameAs: [],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FoodTracks',
    url: BASE_URL,
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
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
    featureList: locale === 'fr'
      ? 'Prédictions IA, Suivi de stock en temps réel, Scan de factures, Intégration SumUp, Analyse des marges, Multi-emplacements'
      : 'AI Predictions, Real-time stock tracking, Invoice scanning, SumUp integration, Margin analytics, Multi-location',
    screenshot: `${BASE_URL}/dashboardfr.jpg`,
  };

  const speakableJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: locale === 'fr' ? 'FoodTracks — Gestion de stock pour food trucks' : 'FoodTracks — Inventory management for food trucks',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.hero-description'],
    },
    url: `${BASE_URL}/${locale}`,
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'FoodTracks',
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f97316" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt — AI-readable site summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs-full.txt — Complete AI reference" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
        />
      </head>
      <body className={`${poppins.className} ${jakarta.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <NativeProvider>
              <AnalyticsProvider locale={locale}>
                {children}
                <Toaster />
              </AnalyticsProvider>
            </NativeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
