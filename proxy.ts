import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optimistic check only: it bounces requests with no session cookie early. Every page and
// route handler still verifies the session against the database (lib/session.ts).
const PUBLIC_PATHS = new Set(["/login", "/api/login"]);
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (isApi && !SAFE_METHODS.has(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 });
    }
  }

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  if (!request.cookies.get("ampy_session")) {
    return isApi
      ? NextResponse.json({ error: "Sign in to continue" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
