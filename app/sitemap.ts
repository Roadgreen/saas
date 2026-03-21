import type { MetadataRoute } from 'next';
import { blogArticles } from '@/lib/blog/articles';

const BASE_URL = 'https://foodtracks.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['fr', 'en'];

  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; lastModified: string }[] = [
    { path: '',                  changeFrequency: 'weekly',  priority: 1.0, lastModified: '2026-03-15' },
    { path: '/pricing',          changeFrequency: 'monthly', priority: 0.9, lastModified: '2026-03-10' },
    { path: '/comment-ca-marche', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-01' },
    { path: '/blog',             changeFrequency: 'weekly',  priority: 0.8, lastModified: '2026-03-15' },
    { path: '/faq',              changeFrequency: 'monthly', priority: 0.7, lastModified: '2026-02-15' },
    { path: '/guides',           changeFrequency: 'monthly', priority: 0.7, lastModified: '2026-02-15' },
    { path: '/support',          changeFrequency: 'monthly', priority: 0.5, lastModified: '2026-02-01' },
    { path: '/security',         changeFrequency: 'yearly',  priority: 0.4, lastModified: '2025-12-01' },
    { path: '/fonctionnalites/integration-sumup', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-18' },
    { path: '/fonctionnalites/gestion-stock', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/fonctionnalites/predictions-ventes', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/fonctionnalites/scan-factures', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/ville/paris',       changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/ville/lyon',        changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/ville/bordeaux',    changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/ville/marseille',   changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/ville/nantes',      changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/ville/toulouse',     changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/ville/strasbourg',   changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/ville/lille',        changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/ville/nice',         changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/guides/gestion-food-truck', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/guides/seuil-rentabilite-food-truck', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/guides/food-truck-reglementation-france', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-19' },
    { path: '/guides/ouvrir-food-truck-auto-entrepreneur', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-20' },
    { path: '/comparatif/inpulse-vs-foodtracks',   changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/comparatif/marketman-vs-foodtracks', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/comparatif/melba-vs-foodtracks',     changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-20' },
    { path: '/food-truck-management-software', changeFrequency: 'monthly', priority: 0.8, lastModified: '2026-03-15' },
    { path: '/privacy',          changeFrequency: 'yearly',  priority: 0.3, lastModified: '2025-12-01' },
    { path: '/terms',            changeFrequency: 'yearly',  priority: 0.3, lastModified: '2025-12-01' },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(route.lastModified),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${route.path}`,
            en: `${BASE_URL}/en${route.path}`,
            'x-default': `${BASE_URL}/fr${route.path}`,
          },
        },
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
        priority: 0.7,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr/blog/${article.slug}`,
            en: `${BASE_URL}/en/blog/${article.slug}`,
            'x-default': `${BASE_URL}/fr/blog/${article.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
