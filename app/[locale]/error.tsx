'use client';

import { useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import { generateErrorRef } from '@/lib/analytics-events';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const ref = generateErrorRef();

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
        user: { id: null, email: null, businessId: null, subscriptionTier: null, role: null },
        page: {
          url: location.href,
          path: location.pathname,
          search: location.search,
          hash: location.hash,
          referrer: document.referrer,
          locale: location.pathname.split('/')[1] ?? 'en',
          title: document.title,
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
        properties: {},
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
