import { NextRequest, NextResponse } from "next/server";

/**
 * Protected route prefixes.
 * Requests to these paths require an authenticated session.
 */
const PROTECTED_PATHS = ["/dashboard", "/admin"];

/**
 * Session cookie name.
 * In a real app this would be validated (e.g. JWT verification).
 */
const SESSION_COOKIE = "session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

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
