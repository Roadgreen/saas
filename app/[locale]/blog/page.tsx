import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Blog' : 'Blog';
  const description = isFr
    ? 'Conseils, guides et actualités pour optimiser la gestion des stocks de votre restaurant ou food truck.'
    : 'Tips, guides, and news to optimize inventory management for your restaurant or food truck.';
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${locale}/blog` },
    openGraph: {
      title: `${title} | FoodTracks`,
      description,
      url: `${BASE_URL}/${locale}/blog`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: `${title} | FoodTracks`, description },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const posts = [
    {
      id: 1,
      title: isFr ? "5 astuces pour réduire le gaspillage alimentaire en cuisine" : "5 Tips to Reduce Food Waste in Your Kitchen",
      excerpt: isFr
        ? "Découvrez des méthodes simples et efficaces pour minimiser les pertes et économiser."
        : "Discover simple yet effective ways to minimize waste and save money.",
      date: "2025-01-15",
      category: isFr ? "Conseils" : "Tips",
    },
    {
      id: 2,
      title: isFr ? "Comprendre les dates de péremption" : "Understanding Expiration Dates",
      excerpt: isFr
        ? "Quelle différence entre « À consommer de préférence avant » et « À consommer jusqu'au » ?"
        : "What's the difference between 'Best By', 'Use By', and 'Sell By'?",
      date: "2025-01-10",
      category: isFr ? "Éducation" : "Education",
    },
    {
      id: 3,
      title: isFr ? "Comment FoodTracks vous aide à économiser" : "How FoodTracks Helps You Save",
      excerpt: isFr
        ? "Plongée dans les fonctionnalités qui font de FoodTracks votre meilleur allié contre le gaspillage."
        : "A deep dive into the features that make FoodTracks your best ally against waste.",
      date: "2025-01-01",
      category: isFr ? "Produit" : "Product",
    },
  ];

  return (
    <div className="container mx-auto py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}`}>
          <Button variant="ghost" size="icon" aria-label={isFr ? 'Retour à l\'accueil' : 'Back to homepage'}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">FoodTracks Blog</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">{post.date} · {post.category}</div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <Button variant="link" className="px-0 text-primary">
                {isFr ? 'Lire la suite' : 'Read More'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
