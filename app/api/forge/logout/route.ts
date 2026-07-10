import { NextResponse } from "next/server";
import { session } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(session.COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
