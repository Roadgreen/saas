import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  // If next-intl is redirecting or rewriting (e.g. appending a default
  // locale prefix), pass its response through untouched — but still tag
  // x-pathname so downstream readers can see the original path.
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    intlResponse.headers.set('x-pathname', request.nextUrl.pathname);
    return intlResponse;
  }

  // Otherwise forward the request with x-pathname added so server
  // components can read the current path via `headers()`. This is what
  // powers the BreadcrumbList JSON-LD and hreflang alternates in
  // app/[locale]/layout.tsx.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
    // Match all pathnames except for:
    // - api routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - Static files (images, etc.)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
