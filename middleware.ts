import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Protected route paths (without locale prefix).
 * Requests to these paths require an authenticated session.
 */
const PROTECTED_PATHS = ["/dashboard"];

/**
 * Session cookie name.
 * In a real app this would be validated (e.g. JWT verification).
 */
const SESSION_COOKIE = "session_token";

/** Regex that matches the locale prefix segment (e.g. /en, /fi, /sv). */
const LOCALE_PREFIX_RE = new RegExp(
  `^\\/(${routing.locales.join("|")})`
);

/** Strip the locale prefix from a pathname, returning at least "/". */
function stripLocale(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_RE, "") || "/";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameWithoutLocale = stripLocale(pathname);

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathnameWithoutLocale.startsWith(path)
  );

  if (isProtected) {
    const session = request.cookies.get(SESSION_COOKIE);

    if (!session?.value) {
      // Preserve the locale when redirecting to the login page
      const localeMatch = pathname.match(LOCALE_PREFIX_RE);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathnameWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico   (browser favicon)
     * - public files with extensions
     * - api routes (they don't need locale routing)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


