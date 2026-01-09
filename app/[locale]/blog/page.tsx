import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const posts = [
    {
      id: 1,
      title: "5 Tips to Reduce Food Waste in Your Kitchen",
      excerpt: "Discover simple yet effective ways to minimize waste and save money.",
      date: "2024-05-15",
      category: "Tips",
    },
    {
      id: 2,
      title: "Understanding Expiration Dates",
      excerpt: "What's the difference between 'Best By', 'Use By', and 'Sell By'?",
      date: "2024-05-10",
      category: "Education",
    },
    {
      id: 3,
      title: "How SnapTrack Helps You Save",
      excerpt: "A deep dive into the features that make SnapTrack your best ally against waste.",
      date: "2024-05-01",
      category: "Product",
    },
  ];

  return (
    <div className="container mx-auto py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">SnapTrack Blog</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">{post.date} • {post.category}</div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <Button variant="link" className="px-0 text-primary">
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
