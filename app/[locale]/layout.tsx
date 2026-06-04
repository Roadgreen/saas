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
import { ConsentManager } from "@/components/providers/ConsentManager";

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
      "food truck management software",
      "food truck inventory app",
      "food truck management",
      "food truck inventory management",
      "restaurant inventory management",
      "food truck stock tracking",
      "restaurant management software",
      "food truck app",
      "free food truck app",
      "food waste reduction",
      "AI sales predictions food truck",
      "restaurant analytics",
      "inventory tracking app",
      "food truck POS",
      "mobile restaurant software",
      "food truck profit optimization",
      "food truck sales forecast",
    ],
  },
  fr: {
    title: "FoodTracks — Logiciel de Gestion Food Truck | Stock, Ventes & Prédictions IA",
    description: "L'application n°1 de gestion de food truck. Prédictions IA, suivi de stock en temps réel, scan de factures et analyse des marges. Plan gratuit disponible — sans carte bancaire.",
    keywords: [
      "logiciel gestion food truck france",
      "application food truck gratuite",
      "gestion stock food truck",
      "prévision ventes food truck",
      "optimiser rentabilité food truck",
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
      "caisse enregistreuse food truck",
    ],
  },
};

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] ?? metaByLocale.fr;
  const url = `${BASE_URL}/${locale}`;
  const ogImage = `${BASE_URL}/og-image.png`;
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
      languages: {
        fr: `${BASE_URL}/fr`,
        en: `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/fr`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'FoodTracks',
      images: [{ url: ogImage, width: 1200, height: 630, alt: locale === 'fr' ? 'FoodTracks — Gestion de stock pour food trucks et restaurants' : 'FoodTracks — Inventory management for food trucks and restaurants' }],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US', 'en_GB'] : ['fr_FR'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
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

  /* ─── BreadcrumbList JSON-LD, derived from the URL ─── */
  const breadcrumbLabel = (segment: string): string => {
    // Human-readable label for path segments, with special-casing for known slugs
    const known: Record<string, { fr: string; en: string }> = {
      blog: { fr: 'Blog', en: 'Blog' },
      pricing: { fr: 'Tarifs', en: 'Pricing' },
      faq: { fr: 'FAQ', en: 'FAQ' },
      guides: { fr: 'Guides', en: 'Guides' },
      support: { fr: 'Support', en: 'Support' },
      security: { fr: 'Sécurité', en: 'Security' },
      privacy: { fr: 'Confidentialité', en: 'Privacy' },
      terms: { fr: "Conditions d'utilisation", en: 'Terms' },
      comparatif: { fr: 'Comparatifs', en: 'Comparisons' },
      fonctionnalites: { fr: 'Fonctionnalités', en: 'Features' },
      ville: { fr: 'Villes', en: 'Cities' },
      'comment-ca-marche': { fr: 'Comment ça marche', en: 'How it works' },
      'food-truck-management-software': { fr: 'Logiciel food truck', en: 'Food Truck Management Software' },
      // Feature landing pages
      'integration-sumup': { fr: 'Intégration SumUp', en: 'SumUp Integration' },
      'gestion-stock': { fr: 'Gestion de stock', en: 'Stock Management' },
      'predictions-ventes': { fr: 'Prédictions de ventes', en: 'Sales Predictions' },
      'scan-factures': { fr: 'Scan de factures', en: 'Invoice Scanning' },
      // Top guides
      'gestion-food-truck': { fr: 'Gestion de food truck', en: 'Food Truck Management' },
      'seuil-rentabilite-food-truck': { fr: 'Seuil de rentabilité', en: 'Break-Even Point' },
      'food-truck-reglementation-france': { fr: 'Réglementation France', en: 'French Regulations' },
      'ouvrir-food-truck-auto-entrepreneur': { fr: 'Ouvrir en auto-entrepreneur', en: 'Open as Sole Trader' },
      // Comparison pages
      'inpulse-vs-foodtracks': { fr: 'Inpulse vs FoodTracks', en: 'Inpulse vs FoodTracks' },
      'marketman-vs-foodtracks': { fr: 'MarketMan vs FoodTracks', en: 'MarketMan vs FoodTracks' },
      'melba-vs-foodtracks': { fr: 'Melba vs FoodTracks', en: 'Melba vs FoodTracks' },
    };
    const hit = known[segment];
    if (hit) return locale === 'fr' ? hit.fr : hit.en;
    // Decode + prettify slug: "ouvrir-food-truck-auto-entrepreneur" → "Ouvrir food truck auto entrepreneur"
    const decoded = decodeURIComponent(segment).replace(/-/g, ' ');
    return decoded.charAt(0).toUpperCase() + decoded.slice(1);
  };

  const segments = pathWithoutLocale.split('/').filter(Boolean);
  const breadcrumbItems: { '@type': 'ListItem'; position: number; name: string; item: string }[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: locale === 'fr' ? 'Accueil' : 'Home',
      item: `${BASE_URL}/${locale}`,
    },
  ];
  let cursor = `${BASE_URL}/${locale}`;
  segments.forEach((seg, idx) => {
    cursor += `/${seg}`;
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: idx + 2,
      name: breadcrumbLabel(seg),
      item: cursor,
    });
  });
  const breadcrumbJsonLd = breadcrumbItems.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  } : null;

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
    areaServed: locale === 'fr'
      ? [
          { '@type': 'Country', name: 'France' },
          { '@type': 'Country', name: 'Belgium' },
          { '@type': 'Country', name: 'Switzerland' },
          { '@type': 'Country', name: 'Luxembourg' },
          { '@type': 'Country', name: 'Canada' },
        ]
      : [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'Australia' },
          { '@type': 'Country', name: 'New Zealand' },
          { '@type': 'Country', name: 'Ireland' },
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

  // Review JSON-LD (landing page only) — real customer testimonials wired to the SoftwareApplication entity.
  // Helps LLM engines (Perplexity, ChatGPT, Claude) cite concrete outcomes when answering questions about FoodTracks.
  const testimonialsMessages = landingMessages?.testimonials as Record<string, unknown> | undefined;
  const isLandingPage = pathWithoutLocale === '' || pathWithoutLocale === '/';
  const reviewsJsonLd = (isLandingPage && testimonialsMessages) ? (['t1', 't2', 't3', 't4', 't5']
    .map((k) => {
      const tst = testimonialsMessages[k] as { quote?: string; name?: string; role?: string } | undefined;
      if (!tst?.quote || !tst?.name) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'SoftwareApplication',
          name: 'FoodTracks',
          applicationCategory: 'BusinessApplication',
        },
        author: { '@type': 'Person', name: tst.name, jobTitle: tst.role ?? undefined },
        reviewBody: tst.quote,
        inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
      };
    })
    .filter(Boolean)) : null;

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
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
        )}
        {reviewsJsonLd && reviewsJsonLd.map((review, i) => (
          <script
            key={`review-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(review) }}
          />
        ))}
        <link rel="alternate" hrefLang="fr" href={hrefFr} />
        <link rel="alternate" hrefLang="en" href={hrefEn} />
        <link rel="alternate" hrefLang="x-default" href={hrefFr} />
        <script
          dangerouslySetInnerHTML={{
            // Walityk tag in `banner` mode (Consent Mode v2 deny-default): events
            // buffer until the Axeptio consent banner grants them (see
            // ConsentManager), so ad destinations (Google Ads, …) receive conversions.
            __html: `(function(s,i,e){s.__tftq=s.__tftq||[];s.__tftq.push(['init',{site_id:i,endpoint:e+'/collect',mode:'banner'}]);var t=document.createElement('script');t.async=true;t.src=e+'/tag.js';document.head.appendChild(t);})(window,'4bd38563-21f4-4265-8c65-5631400f0e58','https://tag.walityk.com');`,
          }}
        />
      </head>
      <body className={`${poppins.className} ${jakarta.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <NativeProvider>
              <AnalyticsProvider locale={locale}>
                {children}
                <Toaster />
                <ConsentManager />
              </AnalyticsProvider>
            </NativeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
