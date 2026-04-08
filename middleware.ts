import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { auth } from '@/lib/auth';
import { locales, defaultLocale } from './i18n/config';

// Create the next-intl middleware for public routes
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes with auth protection
  if (pathname.startsWith('/admin')) {
    const session = await auth();
    const isLoginPage = pathname === '/admin/login';

    // If not authenticated and not on login page, redirect to login
    if (!session?.user && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      // Store the original URL to redirect back after login
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated and on login page, redirect to admin dashboard
    if (session?.user && isLoginPage) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
      const redirectUrl = new URL(callbackUrl || '/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Allow the request to proceed for authenticated admin routes
    return NextResponse.next();
  }

  // For non-admin routes, use next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all routes except static files and api routes
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - Next.js internals (_next)
    // - Static files (files with extensions)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
