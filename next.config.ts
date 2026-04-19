import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async headers() {
    // Baseline security headers — applied site-wide. We keep CSP out of
    // this list for now (requires auditing every inline script + 3rd-party
    // embed like Stripe/SumUp before enabling without breakage).
    const securityHeaders = [
      // Prevent MIME sniffing (defends against some XSS)
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Block rendering of the site inside iframes on other origins (clickjacking)
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // Send the origin on cross-origin navigation, full URL same-origin
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Force HTTPS for 2 years + submit to preload lists
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // Disable features we don't use; keep camera (invoice scan) and
      // geolocation (location tracking) available to same-origin code only.
      {
        key: 'Permissions-Policy',
        value: [
          'camera=(self)',
          'microphone=()',
          'geolocation=(self)',
          'payment=(self)',
          'usb=()',
          'magnetometer=()',
          'gyroscope=()',
          'accelerometer=()',
          'interest-cohort=()',
        ].join(', '),
      },
      // Isolation hint — opt into cross-origin-isolated rendering where possible
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ];

    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'X-Robots-Tag', value: 'all' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'X-Robots-Tag', value: 'all' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
