import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { OWNER } from "@/lib/github";
import { commitFile, commitManifest, readManifestFresh } from "@/lib/githubWrite";
import { isCaseStudy } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are the Cortex of SPARK CORE, the portfolio engine of Shaurya Verma — a third-year CS student and AI engineer. You read a project's README and compile a tight, honest case study.

Respond with ONLY a JSON object, no markdown, exactly this shape:
{"problem": string, "approach": string, "architecture": string[], "oneLiner": string}

Rules:
- "problem": 1-3 sentences. The real-world problem, concrete, no hype.
- "approach": 1-3 sentences. The technical strategy actually taken.
- "architecture": 3-5 short bullet strings, each "Component: what it does".
- "oneLiner": one confident sentence a recruiter would remember.
- Ground every claim in the README. If the README is thin, stay modest — never invent metrics, users, or results.
- Voice: senior engineer, plain words, zero buzzword salad.`;

/** Admin-triggered absorb: README → Groq → content/projects/<slug>.json commit
 *  + a ledger entry. Never runs on page view. Never runs without auth. */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 503 });
  }

  let slug = "";
  try {
    const body = (await req.json()) as { slug?: unknown };
    if (typeof body.slug === "string") slug = body.slug;
  } catch {
    /* handled below */
  }
  if (!slug || !/^[A-Za-z0-9._-]+$/.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  // 1 · README
  const readmeRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${slug}/readme`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.raw+json",
      },
      cache: "no-store",
    }
  );
  if (!readmeRes.ok) {
    return NextResponse.json(
      { error: `no README found for ${slug} (${readmeRes.status})` },
      { status: 404 }
    );
  }
  const readme = (await readmeRes.text()).slice(0, 24000);

  // 2 · Groq compile (strict JSON, low temperature, defensive parse)
  const groqRes = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Repository: ${slug}\n\nREADME:\n${readme}` },
      ],
    }),
  });
  if (!groqRes.ok) {
    return NextResponse.json(
      { error: `Groq error ${groqRes.status}: ${(await groqRes.text()).slice(0, 300)}` },
      { status: 502 }
    );
  }

  let study: unknown;
  try {
    const data = (await groqRes.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const raw = data.choices[0]?.message?.content ?? "";
    study = JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim());
  } catch {
    return NextResponse.json({ error: "Groq returned unparseable JSON" }, { status: 502 });
  }
  if (!isCaseStudy(study)) {
    return NextResponse.json({ error: "case study failed schema validation" }, { status: 502 });
  }

  // 3 · Commit case study + ledger entry
  try {
    await commitFile(
      `content/projects/${slug}.json`,
      JSON.stringify(study, null, 2) + "\n",
      `cortex: absorb ${slug} — case study compiled`
    );
    const manifest = await readManifestFresh();
    const today = new Date().toISOString().slice(0, 10);
    if (!manifest.ledger.some((l) => l.type === "absorb" && l.entry.includes(slug))) {
      manifest.ledger.unshift({
        date: today,
        type: "absorb",
        entry: `absorbed ${slug} — case study compiled by Cortex`,
      });
      await commitManifest(manifest, `cortex: ledger entry — absorbed ${slug}`);
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "commit failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, slug, study, liveInSeconds: 60 });
}
