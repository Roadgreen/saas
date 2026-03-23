import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { NativeProvider } from "@/components/providers/NativeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    title: "FoodTracks — Food Truck Management Software | Inventory, Sales & AI Predictions",
    description: "The #1 food truck management app. AI-powered sales predictions, real-time inventory tracking, invoice scanning and margin analytics. Free plan available — no credit card required.",
    keywords: [
      "food truck management",
      "food truck management software",
      "food truck inventory management",
      "restaurant inventory management",
      "food truck stock tracking",
      "restaurant management software",
      "food truck app",
      "food waste reduction",
      "AI sales predictions food truck",
      "restaurant analytics",
      "inventory tracking app",
      "food truck POS",
      "mobile restaurant software",
    ],
  },
  fr: {
    title: "FoodTracks — Logiciel de Gestion Food Truck | Stock, Ventes & Prédictions IA",
    description: "L'application n°1 de gestion de food truck. Prédictions IA, suivi de stock en temps réel, scan de factures et analyse des marges. Plan gratuit disponible — sans carte bancaire.",
    keywords: [
      "gestion food truck",
      "logiciel gestion food truck",
      "gestion des stocks restaurant",
      "logiciel food truck",
      "application food truck",
      "inventaire restaurant logiciel",
      "suivi des stocks restauration",
      "application gestion restaurant",
      "réduction gaspillage alimentaire",
      "prédictions ventes restaurant",
      "gestion restaurant ambulant",
      "caisse food truck",
      "logiciel restaurant mobile",
    ],
  },
};

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] ?? metaByLocale.fr;
  const url = `${BASE_URL}/${locale}`;
  return {
    title: {
      default: meta.title,
      template: '%s | FoodTracks',
    },
    description: meta.description,
    keywords: meta.keywords,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: locale === 'fr' ? 'FoodTracks — Gestion de stock pour food trucks et restaurants' : 'FoodTracks — Inventory management for food trucks and restaurants' }],
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

  /* ─── Dynamic hreflang: derive current path from middleware header ─── */
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || `/${locale}`;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '';
  const hrefFr = `${BASE_URL}/fr${pathWithoutLocale}`;
  const hrefEn = `${BASE_URL}/en${pathWithoutLocale}`;

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
    sameAs: [
      'https://www.instagram.com/foodtracks.io',
      'https://www.facebook.com/profile.php?id=61576498498498',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    foundingDate: '2025',
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
    applicationSubCategory: locale === 'fr' ? 'Gestion de stock restaurant' : 'Restaurant Inventory Management',
    operatingSystem: 'Web, Android, iOS',
    url: BASE_URL,
    description: locale === 'fr'
      ? 'Logiciel de gestion de stock intelligent pour food trucks et restaurants. Prédictions IA, suivi en temps réel, scan de factures et analyse des marges.'
      : 'Smart inventory management software for food trucks and restaurants. AI predictions, real-time tracking, invoice scanning and margin analytics.',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        name: 'Free',
        description: locale === 'fr' ? '1 emplacement, fonctionnalités de base' : '1 location, basic features',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${locale}/pricing`,
      },
      {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'EUR',
        name: 'Pro',
        description: locale === 'fr' ? 'Emplacements illimités, IA, analyses avancées' : 'Unlimited locations, AI, advanced analytics',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2027-12-31',
        url: `${BASE_URL}/${locale}/pricing`,
      },
    ],
    featureList: locale === 'fr'
      ? 'Prédictions IA, Suivi de stock en temps réel, Scan de factures, Intégration SumUp, Analyse des marges, Multi-emplacements, Alertes péremption, Export comptable'
      : 'AI Predictions, Real-time stock tracking, Invoice scanning, SumUp integration, Margin analytics, Multi-location, Expiry alerts, Accounting export',
    screenshot: `${BASE_URL}/dashboardfr.jpg`,
    softwareVersion: '2.0',
    datePublished: '2025-01-01',
    creator: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
    },
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'FoodTracks',
    description: locale === 'fr'
      ? 'FoodTracks aide les food trucks et restaurants ambulants à gérer leur stock, prédire leurs ventes et optimiser leurs marges grâce à l\'intelligence artificielle.'
      : 'FoodTracks helps food trucks and mobile restaurants manage inventory, predict sales and optimize margins with artificial intelligence.',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/dashboardfr.jpg`,
    telephone: '',
    email: 'contact@foodtracks.io',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    priceRange: locale === 'fr' ? 'Gratuit - 29€/mois' : 'Free - €29/mo',
    servesCuisine: locale === 'fr' ? 'Service aux food trucks et restaurants' : 'Service for food trucks and restaurants',
    areaServed: [
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Canada' },
    ],
    sameAs: [
      'https://www.instagram.com/foodtracks.io',
      'https://www.facebook.com/profile.php?id=61576498498498',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
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

  // Extract landing page FAQ from messages for FAQPage JSON-LD
  const landingMessages = (messages as Record<string, unknown>)?.Landing as Record<string, unknown> | undefined;
  const faqMessages = landingMessages?.faq as Record<string, unknown> | undefined;
  const landingFaqJsonLd = faqMessages ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const q = faqMessages[`q${i}`] as { question?: string; answer?: string } | undefined;
        return q?.question && q?.answer ? {
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        } : null;
      })
      .filter(Boolean),
  } : null;

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {landingFaqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(landingFaqJsonLd) }}
          />
        )}
        <link rel="alternate" hrefLang="fr" href={hrefFr} />
        <link rel="alternate" hrefLang="en" href={hrefEn} />
        <link rel="alternate" hrefLang="x-default" href={hrefFr} />
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
