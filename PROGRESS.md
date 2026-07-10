# PROGRESS.md — SPARK CORE Session 1

**Resume line:** "read PROGRESS.md and continue."
**Live URL (must never change):** https://shaurya-portfolio-eta.vercel.app

## Current workstream: WS1 — Foundation

### WS0 — Repo + meta (in progress)
- [x] Verify tokens: GitHub (SHV27 ✓, repo scope), Groq (llama-3.3-70b-versatile ✓), Vercel (project ✓)
- [ ] CLAUDE.md v2 at root (SPARK CORE constitution — SUTRADHAR file was wrong-paste, lives outside repo)
- [ ] RESEARCH.md with verified API shapes
- [ ] git init + initial commit of v1 + create GitHub repo SHV27/shaurya-portfolio + push

### WS1 — Foundation
- [ ] content/manifest.json with real initial content (identity, hero, origin, skills, projects, ledger, vision, contact)
- [ ] lib/types.ts — manifest + project schemas
- [ ] lib/github.ts — getManifest (revalidate 60, local fallback), getProjects (spark topic OR portfolio.json OR manifest-listed; manifest wins), getLastEvolved, getCaseStudy
- [ ] Referee check: merge logic script green
- [ ] Gate: npm run build green

### WS2 — Auth + Forge
- [ ] lib/session.ts HMAC cookie (edge-safe Web Crypto)
- [ ] middleware.ts protects /forge/** and write APIs
- [ ] /api/forge/login (rate-limited) + logout
- [ ] /forge cockpit: project visible/status/pin, skills, ledger, hero/vision editors, Absorb button, "Committed ✓ — live in ~60s"
- [ ] Gate: wrong password rejected; writes without cookie 401

### WS3 — Cortex + Evolve
- [ ] /api/cortex: README → Groq strict JSON → commit content/projects/<slug>.json
- [ ] /api/evolve: Bearer EVOLVE_SECRET → append skill/ledger → commit
- [ ] Gate: absorb sifarish for real; bad secret rejected

### WS4 — The experience
- [ ] Boot lines live (project count, last evolution)
- [ ] Hero: role line + ◈ Last evolved stamp, no resume button
- [ ] Origin (replaces Lore): new arc, photo full-head fix, inspiration dock (0..10 images graceful)
- [ ] Arsenal from manifest + forge footer line
- [ ] Missions from live GitHub (badges, case studies, compiling state)
- [ ] Evolution Ledger — signature section
- [ ] Vision rewrite (no masters-abroad, no dates) + Contact ("This site is my resume.")
- [ ] Gate: build green, screenshots 1440/375

### WS5 — Ship
- [ ] Vercel env: GITHUB_TOKEN, GROQ_API_KEY, ADMIN_PASSWORD, SESSION_SECRET, EVOLVE_SECRET
- [ ] Connect Vercel project to GitHub repo (git integration)
- [ ] Deploy, fetch live URL, verify unchanged
- [ ] README case-study rewrite + final print (URLs, LinkedIn draft, 100-word pitch)

## Gate status
| Gate | Status |
|---|---|
| build + typecheck | v1 green; v2 pending |
| Auth referee | pending |
| Absorb end-to-end | pending |
| Live URL verified | v1 live |

## Next action, always
Write RESEARCH.md + CLAUDE.md v2, then git init + push.
