import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { session, verifySessionToken } from "./session";

/** Route-level re-check of the middleware gate (Law 3: defense in depth). */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(session.COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token, process.env.SESSION_SECRET);
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return null;
}
