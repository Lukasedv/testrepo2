import { NextRequest, NextResponse } from "next/server";

/**
 * Protected route prefixes – all sub-paths require an authenticated session.
 */
const PROTECTED_PREFIXES = ["/dashboard"];

/**
 * Protected route patterns – matched against the full pathname.
 */
const PROTECTED_PATTERNS = [
  /^\/events\/new$/,
  /^\/events\/[^/]+\/edit$/,
];

/**
 * Session cookie name.
 * In a real app this would be validated (e.g. JWT verification).
 */
const SESSION_COOKIE = "session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname));

  if (isProtected) {
    const session = request.cookies.get(SESSION_COOKIE);

    if (!session?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico   (browser favicon)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
