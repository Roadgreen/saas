'use client';

/**
 * ConsentManager — Axeptio CMP loader + Walityk consent bridge
 *
 * Loads the Axeptio consent banner and relays the visitor's choices to the
 * Walityk tag (Consent Mode v2). Walityk runs in `banner` mode (deny-default):
 * it buffers every event until consent is granted, then forwards — which is
 * what Google Ads (and other ad destinations) require to receive conversions.
 *
 * How the bridge works: Axeptio has googleConsentMode enabled, so when the
 * visitor makes a choice it pushes gtag('consent','update',{...}) to the
 * dataLayer using its own vendor→Consent Mode mapping. We intercept that single
 * source of truth and forward the exact signals to Walityk. This is robust to
 * whatever vendor identifiers are configured in the Axeptio dashboard (those
 * are opaque per-project ids, so mapping them by name would be brittle).
 *
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

type Consent = 'granted' | 'denied';
const GCM_KEYS = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'] as const;
type GcmKey = (typeof GCM_KEYS)[number];

interface WalitykRuntime {
  consent: (partial: Partial<Record<GcmKey, Consent>>) => void;
}

// A dataLayer entry from gtag is an arguments-like object indexed 0,1,2…
// e.g. { 0:'consent', 1:'update', 2:{ analytics_storage:'granted', … } }.
// We only act on `update` (the visitor's explicit choice), never `default` —
// forwarding the deny-default would mark consent as explicitly denied and could
// drop buffered events before the visitor even chose.
function consentUpdateFromEntry(entry: unknown): Record<string, unknown> | null {
  if (!entry || typeof entry !== 'object') return null;
  const e = entry as Record<number, unknown>;
  if (e[0] !== 'consent' || e[1] !== 'update') return null;
  const state = e[2];
  return state && typeof state === 'object' ? (state as Record<string, unknown>) : null;
}

function relayToWalityk(state: Record<string, unknown>): void {
  try {
    const tft = (window as unknown as { __tft?: WalitykRuntime }).__tft;
    if (!tft?.consent) return;
    const partial: Partial<Record<GcmKey, Consent>> = {};
    for (const k of GCM_KEYS) {
      const v = state[k];
      if (v === 'granted' || v === 'denied') partial[k] = v;
    }
    if (Object.keys(partial).length > 0) tft.consent(partial);
  } catch {
    /* never break the app */
  }
}

export function ConsentManager() {
  useEffect(() => {
    const w = window as unknown as {
      axeptioSettings?: Record<string, unknown>;
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    // Standard Google Consent Mode plumbing, set up before Axeptio loads so its
    // consent updates land in a dataLayer whose push we intercept.
    w.dataLayer = w.dataLayer || [];
    const dl = w.dataLayer;
    if (!w.gtag) {
      w.gtag = (...args: unknown[]) => {
        dl.push(args);
      };
    }
    const originalPush = dl.push.bind(dl);
    dl.push = (...args: unknown[]): number => {
      try {
        for (const a of args) {
          const state = consentUpdateFromEntry(a);
          if (state) relayToWalityk(state);
        }
      } catch {
        /* never break the app */
      }
      return originalPush(...args);
    };

    // Configure Axeptio before its SDK loads. googleConsentMode primes the
    // deny-default and makes Axeptio emit Consent Mode v2 updates on choice.
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
