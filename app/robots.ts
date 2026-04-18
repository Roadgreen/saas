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
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Perplexity-User',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'DuckAssistBot',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'MistralAI-User',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: ['/', '/fr/blog/', '/en/blog/'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: ['/', '/fr/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/dashboard/'],
      },
    ],
    sitemap: 'https://foodtracks.io/sitemap.xml',
  };
}
