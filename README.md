# SPARK CORE — a portfolio that evolves itself

**Live:** https://shaurya-portfolio-eta.vercel.app

Most portfolios are snapshots: built once, stale the day after. SPARK CORE is a
running system. It watches my GitHub, absorbs new work, writes its own case
studies, and logs its own evolution — visibly, on the page. I don't update my
portfolio. I update my work, and the portfolio keeps up.

> **The Design Law:** *Nothing is hardcoded that can be lived.* Every project,
> skill, ledger entry, and line of personal copy renders from a live source.
> Component code contains zero personal content — a referee test enforces it.

## How it works

```
GitHub repos (SHV27/*) ──┐
                         ├─ lib/github.ts ──► Next.js server components ──► the site
content/manifest.json ───┘        ▲                                          │
   (this repo — the DB)           │ revalidate: 60s                          │
                                  │                                          │
        /forge cockpit ── commits via GitHub contents API ◄──────────────────┘
        (password + HMAC session)         ▲
                                          │
        /api/cortex: README ──► Groq (llama-3.3-70b) ──► case-study JSON ──► committed
        /api/evolve: Bearer secret ──► append skill/ledger entry ──► committed
```

- **GitHub is the database.** `content/manifest.json` in this repo holds all
  curation: which repos are visible, SHIPPED vs IN THE FORGE, pin order,
  taglines. Every save in `/forge` is a commit. Full audit history for free.
- **Every public repo is a candidate, automatically.** New repo on my GitHub →
  it appears in the cockpit on its own. Nothing ships until I flip it visible.
  The source repos are never touched — no topics, no marker files.
- **Case studies are compiled, not typed.** One tap on ⚡ Absorb: the Cortex
  reads the repo's README, Groq writes `{problem, approach, architecture,
  oneLiner}` as strict JSON, and the result is committed and versioned. Never
  regenerated per visit; grounded in the README, never invented.
- **Edits go live in ~60 seconds without a redeploy** — the site reads the
  manifest from GitHub at runtime (`revalidate: 60`). Pushes to `main` also
  auto-deploy via Vercel's git integration.
- **It never white-screens.** GitHub API down → bundled manifest fallback +
  an honest "uplink interrupted" state. No key set → the site still renders.

## The evolve seam (machine-to-machine)

External systems can teach the portfolio. `POST /api/evolve` with
`Authorization: Bearer <EVOLVE_SECRET>`:

```jsonc
{ "type": "skill",  "group": "LLM & AI-Native Development", "tag": "RAG" }
{ "type": "ledger", "entry": "shipped X", "date": "2026-07-11" } // date optional
```

Everything else is rejected. This is the seam my SIFARISH project will use to
push newly-acquired skills here automatically.

## Security model

- `/forge/**` and all write APIs sit behind `middleware.ts` (edge) **and**
  per-route re-checks: signed httpOnly HMAC-SHA256 session cookie, set only by
  the correct `ADMIN_PASSWORD` (constant-time compare, rate-limited login).
- Secrets (`GITHUB_TOKEN`, `GROQ_API_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`,
  `EVOLVE_SECRET`) exist only in env. A referee test fails the build if a
  token-like string ever lands in a component.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Groq
(`llama-3.3-70b-versatile`) · GitHub REST (contents API as the write path) ·
Vercel. No database, no CMS, no paid services.

## Run it

```bash
npm install
cp .env.example .env.local   # five vars, see RUNBOOK.md
npm run dev
npm run referee              # invariant suite (BASE_URL=... for live auth checks)
npm run build && npm run typecheck
```

---

Built by directing Claude Code — which is itself the point: I'm the engineer
who directs AI to build what one person alone never could. The full
constitution lives in [CLAUDE.md](./CLAUDE.md).
