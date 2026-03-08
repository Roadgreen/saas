import type { MetadataRoute } from 'next';
import { blogArticles } from '@/lib/blog/articles';

const BASE_URL = 'https://foodtracks.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['fr', 'en'];

  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '',          changeFrequency: 'weekly',  priority: 1.0 },
    { path: '/pricing',  changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog',     changeFrequency: 'weekly',  priority: 0.7 },
    { path: '/privacy',  changeFrequency: 'yearly',  priority: 0.3 },
    { path: '/terms',    changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  // Blog articles
  for (const locale of locales) {
    for (const article of blogArticles) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
