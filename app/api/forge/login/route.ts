import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, session } from "@/lib/session";

export const dynamic = "force-dynamic";

// Best-effort per-instance rate limit (serverless instances don't share memory,
// but each instance still throttles a hammering client — see Decisions log).
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const admin = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!admin || !secret) {
    return NextResponse.json({ error: "forge not configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && now < a.resetAt && a.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "too many attempts — try again later" },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    /* malformed body → fails compare below */
  }

  if (!password || !constantTimeEqual(password, admin)) {
    const cur = a && now < a.resetAt ? a : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    attempts.set(ip, cur);
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(session.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.MAX_AGE_S,
  });
  return res;
}
