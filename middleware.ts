import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-edge";
import { hasValidOrigin } from "@/lib/origin";

// Routes under /admin that must stay reachable while logged out.
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  if (!pathname.startsWith("/admin")) {
    return response;
  }

  // Every /admin response is kept out of search indexes, defense-in-depth
  // alongside robots.ts (crawlers don't always respect robots.txt).
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  // CSRF defense-in-depth on top of Next.js Server Action protections.
  if (!hasValidOrigin(request.method, request.headers)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session && !isPublicAdminPath) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in and sitting on the login page: send them to the dashboard.
  if (session && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
