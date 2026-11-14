import { type NextRequest, NextResponse } from "next/server";

/**
 * Phase 1 route protection (Next.js 16 Proxy convention).
 *
 * - Guest-only pages (/login, /register) bounce authenticated users home.
 * - Protected pages (/profile, /add-studio, /my-studios) bounce guests to /login.
 * - "/" and "/studios" remain fully public (not matched at all).
 */

// Visitors with a session must not see the auth forms again
const GUEST_ONLY_ROUTES = ["/login", "/register"];

// Requires a session cookie to access
const PROTECTED_ROUTES = ["/profile", "/add-studio", "/my-studios"];

// BetterAuth session cookie names:
// - "better-auth.session_token"        → HTTP (localhost)
// - "__Secure-better-auth.session_token" → HTTPS (production)
const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIES.some((name) =>
    request.cookies.get(name),
  );

  const { pathname } = request.nextUrl;

  // 1. Authenticated users are not allowed on guest-only routes
  if (matchesRoute(pathname, GUEST_ONLY_ROUTES)) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Guests are not allowed on protected routes
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/add-studio/:path*",
    "/my-studios/:path*",
  ],
};
