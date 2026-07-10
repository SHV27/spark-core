# RESEARCH.md — verified live facts (2026-07-11)

## GitHub REST (verified with live calls)
- `GET /users/SHV27/repos?per_page=100` → 16 public repos incl. `sifarish`, `galaxy-morphology-transfer`, `PRANA-Sustainable-AI`, `sehat-saarthi`, `stellarrift`, `voidseer`, `gloaming`. Fields used: `name`, `description`, `topics` (needs no special media type anymore), `language`, `stargazers_count`, `pushed_at`, `homepage`, `html_url`.
- Token identity: SHV27 (id 140840536), scopes include `repo` → contents read/write OK.
- Contents API commit flow (confirmed shape): `GET /repos/{o}/{r}/contents/{path}` → `{ sha, content(base64) }`; `PUT` same path with `{ message, content: base64, sha? }` (sha required to update, omitted to create).
- Read with `Accept: application/vnd.github.raw+json` returns raw file body directly — used by `getManifest`.

## Groq (verified with live /models call)
- `llama-3.3-70b-versatile` present on free tier → chosen for case-study JSON (best quality/instruction-following of the listed free models; `openai/gpt-oss-120b` also present as fallback).
- OpenAI-compatible: `POST https://api.groq.com/openai/v1/chat/completions`, `response_format: { type: "json_object" }` supported → use it + defensive parse.

## Next.js 14 App Router
- Server components: `fetch(url, { next: { revalidate: 60 } })` → ISR-style per-URL cache. Used: manifest 60s, repos 3600s.
- Route handlers are dynamic when reading headers/body; our write APIs are always dynamic (`export const dynamic = "force-dynamic"`).
- `middleware.ts` at root, `config.matcher = ["/forge/:path*", "/api/forge/:path*", "/api/cortex"]`. Edge runtime → HMAC via Web Crypto (`crypto.subtle`), not node `crypto`.

## Vercel
- Project `shaurya-portfolio` on team `shv-s-projects` (team_B21vLCIcwNIzaWX26hUkmNLq), alias `shaurya-portfolio-eta.vercel.app` — verified via API with the new token.
- Git connect: attempted via `vercel git connect` / project PATCH — result logged in Decisions.

## NASA/JWST imagery
- NASA & STScI/JWST publicity images are public-domain / free-use with credit ("NASA, ESA, CSA, STScI"). Plan: 1 deep-field texture at low opacity in The Vision; credit in CREDITS.md + footer. If download is flaky, CSS starfield fallback (decision D-v2-3).

## Design decisions this session (also in CLAUDE.md Decisions)
- D-v2-1 (corrected by Shaurya mid-session): ALL public non-fork repos are candidates, fetched automatically; ONLY `manifest.projects.<name>.visible:true` ships. Unlisted repos default hidden until promoted from /forge. GitHub source repos stay completely untouched.
- D-v2-2: Forge saves commit to the repo; the public site reads the manifest from GitHub at runtime (revalidate 60) so edits go live without waiting for the CI deploy.
- D-v2-3: JWST texture optional-with-fallback; never a hard dependency.
