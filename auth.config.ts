import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Extract the path without the locale prefix (e.g. /en/dashboard -> /dashboard)
            const pathSegments = nextUrl.pathname.split('/');
            const pathWithoutLocale =
                pathSegments.length > 2
                    ? '/' + pathSegments.slice(2).join('/')
                    : nextUrl.pathname;

            const isOnDashboard = pathWithoutLocale.startsWith('/dashboard');
            const isOnLogin = pathWithoutLocale === '/login';
            const isOnRegister = pathWithoutLocale === '/register';

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && (isOnLogin || isOnRegister)) {
                // Preserve the locale prefix when redirecting
                const locale = pathSegments[1] || 'en';
                return Response.redirect(new URL(`/${locale}/dashboard`, nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
