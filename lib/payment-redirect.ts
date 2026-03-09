// Payment redirect — opens payment/pricing links in external browser
// This prevents Apple's 30% in-app purchase commission

import { Capacitor } from '@capacitor/core';

const PAYMENT_PATTERNS = [
  '/pricing',
  '/api/stripe',
  'checkout.stripe.com',
  'buy.stripe.com',
];

/**
 * Check if a URL is a payment-related link
 */
function isPaymentUrl(url: string): boolean {
  return PAYMENT_PATTERNS.some((pattern) => url.includes(pattern));
}

/**
 * Intercept clicks on payment links and open in external browser
 * Only active on native platforms (iOS/Android)
 */
export function setupPaymentInterceptor() {
  if (!Capacitor.isNativePlatform()) return;

  document.addEventListener('click', async (e) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Build full URL
    const fullUrl = href.startsWith('http') ? href : `https://foodtracks.io${href}`;

    if (isPaymentUrl(fullUrl)) {
      e.preventDefault();
      e.stopPropagation();
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url: fullUrl });
    }
  }, true);
}
