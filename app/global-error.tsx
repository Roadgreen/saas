'use client';

import { useEffect, useRef } from 'react';

/** Generates an error reference without importing from lib (avoids module issues in global-error) */
function makeRef() {
  return `ERR_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Read a cookie value safely (no imports — global-error has no providers) */
function getCookie(name: string): string | null {
  try {
    const match = document.cookie.split('; ').find((r) => r.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  } catch { return null; }
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorRefRef = useRef<string>('');

  useEffect(() => {
    const ref = makeRef();
    errorRefRef.current = ref;

    // Resolve anonymous identity from cookies
    const anonymousId = getCookie('ft_uid') ?? null;
    let firstLandingPage = null;
    try {
      const raw = getCookie('ft_first_landing');
      if (raw) firstLandingPage = JSON.parse(raw);
    } catch { /* corrupted cookie */ }

    // Track critical error to MongoDB analytics
    // Uses raw fetch — no providers available in global-error boundary
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
          message: error.message ?? 'Unknown critical error',
          stack: error.stack ?? null,
          type: 'runtime',
          component: 'GlobalErrorBoundary',
          severity: 'critical',
          digest: error.digest ?? null,
        },
      }),
    }).catch(() => {});

    console.error(`[${ref}] GlobalError:`, error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', backgroundColor: '#fafafa' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111', marginBottom: '1rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            {errorRefRef.current && (
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace', marginBottom: '1rem', userSelect: 'all' }}>
                Ref: {errorRefRef.current}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                backgroundColor: '#f97316',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
