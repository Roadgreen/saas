'use client';

import { useEffect, useRef } from 'react';
import { ChefHat } from 'lucide-react';
import { generateErrorRef } from '@/lib/analytics-events';

/** Read a cookie value safely */
function getCookie(name: string): string | null {
  try {
    const match = document.cookie.split('; ').find((r) => r.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  } catch { return null; }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorRefRef = useRef<string>('');

  useEffect(() => {
    const ref = generateErrorRef();
    errorRefRef.current = ref;

    // Resolve anonymous identity from cookies (same as AnalyticsProvider)
    const anonymousId = getCookie('ft_uid') ?? null;
    let firstLandingPage = null;
    try {
      const raw = getCookie('ft_first_landing');
      if (raw) firstLandingPage = JSON.parse(raw);
    } catch { /* corrupted cookie */ }

    // Track runtime error to MongoDB analytics
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'error',
        sessionId: (() => {
          try { return sessionStorage.getItem('ft_session_id') ?? 'unknown'; } catch { return 'unknown'; }
        })(),
        pageViewId: (() => {
          try { return sessionStorage.getItem('ft_page_view_id') ?? 'error'; } catch { return 'error'; }
        })(),
        user: {
          id: null, email: null, businessId: null,
          subscriptionTier: null, role: null,
          anonymousId,
          firstLandingPage,
        },
        page: {
          url: location.href,
          path: location.pathname,
          search: location.search,
          hash: location.hash,
          referrer: document.referrer,
          locale: location.pathname.split('/')[1] ?? 'en',
          title: document.title,
          utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null,
        },
        device: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenWidth: screen.width,
          screenHeight: screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          isMobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
          platform: navigator.platform ?? 'unknown',
        },
        properties: {
          errorName: error.name ?? 'Error',
        },
        error: {
          ref,
          message: error.message ?? 'Unknown error',
          stack: error.stack ?? null,
          type: 'runtime',
          component: null,
          severity: 'high',
          digest: error.digest ?? null,
        },
      }),
    }).catch(() => {});

    // Log with reference for easy server-log filtering
    console.error(`[${ref}]`, error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 px-4">
        <ChefHat className="h-16 w-16 mx-auto text-orange-500" />
        <h2 className="text-3xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        {errorRefRef.current && (
          <p className="text-xs text-gray-400 font-mono select-all">
            Ref: {errorRefRef.current}
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-xl font-bold px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
