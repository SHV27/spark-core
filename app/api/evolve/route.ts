import { NextRequest, NextResponse } from "next/server";
import { commitManifest, readManifestFresh } from "@/lib/githubWrite";

export const dynamic = "force-dynamic";

// The SIFARISH seam: machine-to-machine evolution. Bearer EVOLVE_SECRET only.
// Payloads (documented in README):
//   { "type": "skill",  "group": "LLM & AI-Native Development", "tag": "RAG" }
//   { "type": "ledger", "entry": "shipped X", "date"?: "yyyy-mm-dd" }

function authorized(req: NextRequest): boolean {
  const secret = process.env.EVOLVE_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const manifest = await readManifestFresh();

    if (body.type === "skill") {
      const group = typeof body.group === "string" ? body.group : "";
      const tag = typeof body.tag === "string" ? body.tag.trim() : "";
      if (!tag) return NextResponse.json({ error: "missing tag" }, { status: 400 });

      let target =
        manifest.skills.find((s) => s.group === group) ??
        manifest.skills.find((s) => s.highlight);
      if (!target) target = manifest.skills[0];
      if (!target) return NextResponse.json({ error: "no skill groups" }, { status: 400 });
      if (!target.tags.includes(tag)) target.tags.push(tag);

      manifest.ledger.unshift({
        date: today,
        type: "skill",
        entry: `skill acquired: ${tag}`,
      });
      await commitManifest(manifest, `evolve: skill acquired — ${tag}`);
      return NextResponse.json({ ok: true, type: "skill", tag });
    }

    if (body.type === "ledger") {
      const entry = typeof body.entry === "string" ? body.entry.trim() : "";
      if (!entry) return NextResponse.json({ error: "missing entry" }, { status: 400 });
      const date =
        typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
          ? body.date
          : today;

      manifest.ledger.unshift({ date, type: "milestone", entry });
      await commitManifest(manifest, `evolve: ledger — ${entry.slice(0, 60)}`);
      return NextResponse.json({ ok: true, type: "ledger", entry });
    }

    return NextResponse.json({ error: "unknown type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "evolve failed" },
      { status: 502 }
    );
  }
}
