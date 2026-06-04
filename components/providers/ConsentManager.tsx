'use client';

/**
 * ConsentManager — Axeptio CMP loader + Walityk consent bridge
 *
 * Loads the Axeptio consent banner and relays the visitor's choices to the
 * Walityk tag (Consent Mode v2). Walityk runs in `banner` mode (deny-default):
 * it buffers every event until consent is granted, then forwards — which is
 * what Google Ads (and other ad destinations) require to receive conversions.
 *
 * What controls each Walityk signal:
 *   analytics_storage              → GA4
 *   ad_storage / ad_user_data /
 *   ad_personalization             → Google Ads, Meta, TikTok, …
 *
 * The Axeptio clientId / cookiesVersion are public (they ship to the browser).
 * Env vars override them if ever needed.
 */

import { useEffect } from 'react';

const CLIENT_ID = process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID || '6a21640a4bdd631a654f040e';
const COOKIES_VERSION =
  process.env.NEXT_PUBLIC_AXEPTIO_COOKIES_VERSION || '61c7a52a-a4e1-41b7-ba53-52194badb410';

// Axeptio returns the visitor's choices keyed by the vendor identifiers you
// configure in the Axeptio dashboard. We accept several common identifiers so
// the bridge keeps working whichever ones you enable. Add yours here if they
// differ. Any truthy match grants the corresponding category.
const ANALYTICS_VENDORS = [
  'google_analytics',
  'google_analytics_4',
  'ga4',
  'analytics',
  'walityk',
];
const ADS_VENDORS = [
  'google_ads',
  'google_ads_remarketing',
  'adwords',
  'facebook_pixel',
  'meta_pixel',
  'meta',
  'tiktok',
  'pinterest',
  'marketing',
  'advertising',
  'ads',
];

type Consent = 'granted' | 'denied';
type Choices = Record<string, boolean>;

interface WalitykRuntime {
  consent: (partial: {
    analytics_storage?: Consent;
    ad_storage?: Consent;
    ad_user_data?: Consent;
    ad_personalization?: Consent;
  }) => void;
}

function anyGranted(choices: Choices, vendors: string[]): boolean {
  return vendors.some((v) => choices[v] === true);
}

function relayToWalityk(choices: Choices): void {
  try {
    const tft = (window as unknown as { __tft?: WalitykRuntime }).__tft;
    if (!tft?.consent) return;
    const analytics: Consent = anyGranted(choices, ANALYTICS_VENDORS) ? 'granted' : 'denied';
    const ads: Consent = anyGranted(choices, ADS_VENDORS) ? 'granted' : 'denied';
    tft.consent({
      analytics_storage: analytics,
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    });
  } catch {
    /* never break the app */
  }
}

export function ConsentManager() {
  useEffect(() => {
    if (!CLIENT_ID) return;

    const w = window as unknown as {
      axeptioSettings?: Record<string, unknown>;
      _axcb?: Array<(sdk: { on: (evt: string, cb: (choices: Choices) => void) => void }) => void>;
    };

    // Configure Axeptio before its SDK loads. googleConsentMode primes gtag's
    // Consent Mode v2 defaults to deny (harmless if no gtag is present).
    w.axeptioSettings = {
      clientId: CLIENT_ID,
      ...(COOKIES_VERSION ? { cookiesVersion: COOKIES_VERSION } : {}),
      googleConsentMode: {
        default: {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 500,
        },
      },
    };

    // Register the consent bridge. Axeptio drains _axcb once the SDK is ready,
    // then calls our callbacks again on every consent change.
    w._axcb = w._axcb || [];
    w._axcb.push((sdk) => {
      sdk.on('cookies:complete', (choices) => relayToWalityk(choices));
    });

    // Load the Axeptio SDK once.
    const SRC = 'https://static.axept.io/sdk.js';
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement('script');
      s.async = true;
      s.src = SRC;
      document.head.appendChild(s);
    }
  }, []);

  return null;
}
