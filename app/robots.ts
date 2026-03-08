import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/settings/', '/verify-email/', '/login/', '/register/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/fr/blog/', '/en/blog/'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/fr/blog/', '/en/blog/'],
      },
    ],
    sitemap: 'https://foodtracks.io/sitemap.xml',
  };
}
