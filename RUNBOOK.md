# SPARK CORE — RUNBOOK
# Do these steps in order. ~20 minutes of your time, then Claude Code takes over.

## 1 · Put the project on GitHub (portfolio becomes a project — same URL preserved)
```bash
cd shaurya-portfolio
git init   # if not already a repo
git add -A && git commit -m "v1 baseline before SPARK CORE"
# Create an empty repo on github.com/SHV27 named: spark-core (public)
git remote add origin https://github.com/SHV27/spark-core.git
git push -u origin main
```
Then in the Vercel dashboard → your EXISTING portfolio project → Settings → Git →
**Connect the SHV27/spark-core repo**. This keeps `shaurya-portfolio-eta.vercel.app` exactly
as it is (your LinkedIn link stays alive) while every push now auto-deploys.

## 2 · Keys (your job, as ordered) — ALL go in Vercel → Settings → Environment Variables, and in a local `.env.local` (gitignored). Never in any committed file.

| Env var | Where to get it |
|---|---|
| `GITHUB_TOKEN` | github.com → Settings → Developer settings → Fine-grained personal access token. Repository access: **All repositories** (or select your public ones + spark-core). Permissions: **Contents: Read and write** (write is needed ONLY so /forge can commit manifest.json to spark-core), **Metadata: Read**. Expiry: 1 year. |
| `GROQ_API_KEY` | You already have it (console.groq.com). Free tier is enough — case studies generate once per project, not per visit. |
| `ADMIN_PASSWORD` | You invent it. Long. Not used anywhere else. This is the only door into /forge. |
| `SESSION_SECRET` | Random 64+ chars: `openssl rand -hex 32` |
| `EVOLVE_SECRET` | Same command, different value. This is the future SIFARISH → portfolio handshake. |

Anti-fool check: all five are server-side only — none is ever prefixed `NEXT_PUBLIC_`.

## 3 · Your assets
- `/public/inspiration/` — drop your childhood-inspiration images here yourself (any names,
  jpg/png). One honest studio note, said once: images of copyrighted characters are yours to
  choose to upload, but they can be a takedown/professionalism risk on a public hiring site —
  the safest killer combo is your own photos/sketches + the NASA deep-space imagery the build
  pulls in (genuinely public domain). Either way, the site is built to look intentional with
  0 or 10 images, and captions are editable from /forge.
- `/public/photo.jpg` — already there. The build FIXES the head-crop with screenshot proof.
- `anthem.mp3` stays. Barney would approve.

## 4 · Launch the session
```bash
# from the repo root:
# 1. Replace the old CLAUDE.md with the new one (repo root)
# 2. Make sure .env.local has all five vars
export $(cat .env.local | xargs)   # or just let Next.js read .env.local
claude   # then paste SESSION_1_PROMPT.md in full
```
If the session hits a limit or breaks: reopen and say — **"read PROGRESS.md and continue."**

## 5 · How you use SPARK CORE after it ships (your daily reality)
- **Add a project to the portfolio:** add the `spark` topic to that repo on GitHub (or a
  `portfolio.json` at its root). It appears within the hour. Open `/forge` → hit ⚡ Absorb →
  Groq writes its case study. Done. Zero portfolio code touched.
- **Control what the world sees:** `/forge` (your password) → toggle visible, set
  SHIPPED / IN THE FORGE, pin order, edit skills + ledger + manifesto. Every save commits to
  GitHub and is live in ~60 seconds. Works from your phone.
- **When SIFARISH SaaS matures:** it POSTs new skills to `/api/evolve` with the
  `EVOLVE_SECRET` — the portfolio absorbs them automatically. The seam is documented in the
  repo README.
- **Ship KrishiMitra someday →** flip its badge to SHIPPED in /forge, add the live URL. The
  amber turns cyan. Evidence over aspiration, always.

## 6 · Amplifier menu (optional, later — not dependencies)
- Custom domain (shauryaverma.dev via Cloudflare Registrar) — add it to the same Vercel
  project ALONGSIDE the existing URL so the LinkedIn link never dies.
- A GitHub Action that pings `/api/evolve` with a ledger entry on every release you publish.
- Plausible/Vercel Analytics to see recruiter traffic after your LinkedIn post.
