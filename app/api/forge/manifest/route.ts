import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { commitManifest, readManifestFresh } from "@/lib/githubWrite";
import { isManifest } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Cockpit read: freshest manifest + the full repo roster so /forge can offer
 *  any repo for adoption without Shaurya touching GitHub. */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const manifest = await readManifestFresh();
    const reposRes = await fetch(
      "https://api.github.com/users/SHV27/repos?per_page=100&sort=pushed",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );
    const repos = reposRes.ok
      ? ((await reposRes.json()) as Array<Record<string, unknown>>).map((r) => ({
          name: r.name as string,
          description: (r.description as string | null) ?? "",
          pushedAt: r.pushed_at as string,
          language: (r.language as string | null) ?? null,
        }))
      : [];
    return NextResponse.json({ manifest, repos });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "read failed" },
      { status: 502 }
    );
  }
}

/** Cockpit save: whole-manifest commit. One save = one commit. */
export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const manifest = (body as { manifest?: unknown }).manifest;
  if (!isManifest(manifest)) {
    return NextResponse.json({ error: "manifest failed schema validation" }, { status: 400 });
  }

  try {
    await commitManifest(manifest, "forge: manifest updated via cockpit");
    return NextResponse.json({ ok: true, liveInSeconds: 60 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "commit failed" },
      { status: 502 }
    );
  }
}
