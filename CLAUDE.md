# CLAUDE.md — SPARK CORE v2 | Shaurya Verma's Living Portfolio
# Replaces v1 entirely. This file is the constitution. Read fully before any work.

## PRIME DIRECTIVE
One-breath pitch: **A portfolio that evolves itself.** Projects are absorbed live from GitHub,
described intelligently by Groq, controlled by Shaurya from a hidden cockpit — and the site
visibly proves it's alive. Aesthetic: "Energon Observatory" — Transformers-Prime-inspired
machine glow meets real deep-space photography. Barney Stinson energy: every section SELLS.

**THE DESIGN LAW: "Nothing is hardcoded that can be lived."**
Every project, status, skill, ledger entry, and claim renders from a live source
(GitHub repos + `content/manifest.json`) — never typed into component code.
If you find yourself hardcoding content into a .tsx file, you are violating the law. Stop.

Taste bar: a designer at an award-winning studio asks "who built this?" First output = final
output. No AI-slop. It must run, delight, and survive a recruiter's 30-second scan.

## COMMANDS
```bash
npm run dev          # local dev
npm run build        # MUST pass with 0 errors before any commit
npm run typecheck    # tsc --noEmit — 0 errors, always
npx playwright test  # screenshot + invariant suite (the Referee)
```

## ARCHITECTURE (≤10 lines)
- Next.js 14 App Router + TypeScript + Tailwind + Framer Motion. Existing repo, enhanced in place → same Vercel URL.
- `content/manifest.json` = single source of truth (identity, skills, project overrides, ledger, vision). NO database.
- `lib/github.ts`: server-side fetch of Shaurya's repos (PAT from env). Projects = repos with `spark` topic OR a `portfolio.json` at root, merged with manifest overrides. `next: { revalidate: 3600 }`.
- Manifest itself is fetched at runtime from GitHub contents API with `revalidate: 60` → edits go live in ~1 min, no redeploy.
- `app/api/cortex/route.ts`: admin-triggered. README → Groq → case-study JSON → committed to `content/projects/<slug>.json` via GitHub contents API. Generated once, versioned forever.
- `app/forge/`: hidden admin cockpit. `ADMIN_PASSWORD` → signed httpOnly session cookie. Every save = a commit to manifest.json through the GitHub API. GitHub IS the database.
- `app/api/evolve/route.ts`: secret-protected POST endpoint (future SIFARISH seam) — appends skills/ledger entries to manifest.
- All secrets server-side only: `GITHUB_TOKEN`, `GROQ_API_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `EVOLVE_SECRET`.

## THE VERIFIER (definition of done — nothing is "done" because you say so)
1. `npm run build` + `npm run typecheck` green, zero console errors in prod build.
2. Playwright screenshots at 1440px AND 375px for EVERY section + /forge, visually reviewed by you (Law 9: never trust unseen visuals — v1 shipped a half-cropped head because nobody looked).
3. Referee tests green: manifest-schema validation, project merge logic, auth (wrong password rejected, cookie required on all /forge + write APIs), evolve endpoint rejects bad secret, site renders with empty inspiration folder and with GitHub API mocked as DOWN (graceful fallback to last cached data).
4. SIMULATION_LOG.md shows a panel pass with zero severity-high friction (see Simulation Gate).
5. Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on production build.

## SIMULATION GATE (mandatory before ship)
Run the ghost-user panel from the session prompt (recruiter, senior skeptic, mobile-on-4G,
designer, Shaurya-as-admin-on-phone, chaos user). Walk each flow think-aloud, log
persona → step → friction → severity in SIMULATION_LOG.md. 4-of-6 hitting the same wall =
real signal, fix it. Re-run after fixes. Sim output is directional, not proof of love — say so in the log.

## LOOP RULES
- One item at a time from PROGRESS.md. Fix → verify → check off → next. Never batch.
- All gates re-run after every workstream, not just at the end. Green is the resting state.
- 2 failed attempts on the same path → stop correcting, restart that task fresh with what you learned.
- Same error twice with same fix attempted → change strategy or escalate to Shaurya. Retrying identically is spinning.
- Escalation gates (pause and ask Shaurya): deleting existing sections' data, adding any new paid dependency, changing the Vercel project/domain linkage, anything touching the live URL.
- Resume protocol: PROGRESS.md always holds "one next action." Resume line: "read PROGRESS.md and continue."

## DESIGN DNA — "ENERGON OBSERVATORY" (≤8 lines)
1. Palette: gunmetal blacks (#0A0E14/#111823), Energon cyan #00E5FF as the ONLY glow, violet #8B5CF6 sparingly, warm amber ONLY for "IN THE FORGE" badges. Real NASA/JWST imagery (public domain) as space texture — never gradient blobs.
2. Type: Syne (display) + Plus Jakarta Sans (body) + JetBrains Mono (machine voice). Type IS personality.
3. Motion language: "transformation" — sections assemble like plating locking in; panels slide + snap with a subtle glow-seam. One orchestrated hero moment > scattered effects. `prefers-reduced-motion` kills all of it.
4. Signature element: the **Evolution Ledger** + "Last evolved: X ago — autonomously" stamp. Spend the boldness there; keep everything around it disciplined.
5. Shaurya's own inspiration images live in `/public/inspiration/` with captions from the manifest; the section renders gracefully (and beautifully) whether the folder has 0 or 10 images. Never fetch imagery from the web yourself; NASA textures are provided/linked via runbook.
6. Banned: purple-blue gradient cards, emoji-as-design-system, glassmorphism-everywhere, progress bars for skills, stock photos, lorem ipsum, Three.js.
7. Photo rule: `object-cover` + explicit `object-position` tuned via screenshot until the full head is visible at all breakpoints. This is a named v1 regression — test it.
8. Squint test on every section screenshot: if it could be any generic AI site, redo it.

## THE BOOK OF LAWS (project-relevant subset — non-negotiable)
- **Form is the promise (L1):** the site doesn't CLAIM to be self-evolving — the ledger, the timestamp, and the live absorb SHOW it.
- **Complexity budget (L2):** /forge must be operable by Shaurya from a phone in under 60 seconds per edit. If a control needs explanation, redesign it.
- **Structural impossibility (L3):** viewers can never reach /forge actions — enforce auth in middleware + on every write route, not just the UI. An unauthenticated write must be impossible, not hidden.
- **Causal legibility (L4):** after every admin save, show exactly what changed and when it will be live ("Committed ✓ — live in ~60s").
- **Cut what nobody consumes (L5):** resume download is DEAD. Contact says: "This site is my resume — it updates itself."
- **Evidence over aspiration:** only repos marked SHIPPED with a live URL get the flagship treatment. In-progress work wears the amber IN THE FORGE badge with pride. Never fake a status.
- **Secrets in the shell (L11):** no token in any file, ever. `.env.local` is gitignored; Vercel env settings for prod.
- **Verify volatile facts live (L12):** GitHub API shapes, Groq model names, Next.js ISR APIs — search/check docs before relying.

## COMPACT POLICY
When compacting context, preserve: modified-file list, current test status, PROGRESS.md next action, and open friction items from SIMULATION_LOG.md.

## DECISIONS LOG (append-only, one line each)
- 2026-07-10: No Supabase. GitHub-as-database — manifest.json commits via contents API. (Simplicity > infra.)
- 2026-07-10: Manifest read at runtime (revalidate 60) so admin edits go live without redeploy.
- 2026-07-10: Groq case studies generated once on absorb, committed to repo — never per-visit.
- 2026-07-10: Resume download removed; site is the resume. Masters-abroad node removed from Vision.
- 2026-07-10: Krishi Mitra demoted to IN THE FORGE until shipped; SIFARISH is flagship (65/65 green, live).
- 2026-07-10: Inspiration imagery is Shaurya-supplied in /public/inspiration/; site never fetches web images.
- 2026-07-11: Project detection additionally includes repos listed in manifest.projects — Shaurya controls everything from /forge without touching GitHub topics (his explicit ask).
- 2026-07-11: Provided classic PAT used for now; swap to fine-grained (Contents R/W + Metadata) and rotate the classic one — it was pasted in chat.
- 2026-07-11: Repo = SHV27/spark-core (public), pushed from the existing local project; Vercel project unchanged.

## SELF-AUDIT
If you (Claude) keep violating a rule in this file, the file is too long — flag it to Shaurya for pruning.
