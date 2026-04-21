import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/forgot-password/verify", "/forgot-password/reset"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const hasSessionCookie = request.cookies.get("gg_session")?.value === "1";
  const hasAccessToken = Boolean(request.cookies.get("gg_access_token")?.value);
  const hasRefreshToken = Boolean(request.cookies.get("gg_refresh_token")?.value);
  const isAuthenticated = hasSessionCookie || hasAccessToken || hasRefreshToken;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
