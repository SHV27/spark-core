import { NextRequest, NextResponse } from "next/server";
import { session, verifySessionToken } from "./lib/session";

// Law 3 — structural impossibility: every /forge page and every write API is
// gated HERE, and each write route re-checks on its own (defense in depth).
// /api/evolve is NOT cookie-gated — it authenticates via Bearer EVOLVE_SECRET
// inside the route (machine-to-machine seam).

const PUBLIC_FORGE_PATHS = new Set(["/forge/login", "/api/forge/login"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_FORGE_PATHS.has(pathname)) return NextResponse.next();

  const token = req.cookies.get(session.COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token, process.env.SESSION_SECRET);
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const login = req.nextUrl.clone();
  login.pathname = "/forge/login";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/forge/:path*", "/forge", "/api/forge/:path*", "/api/cortex"],
};
