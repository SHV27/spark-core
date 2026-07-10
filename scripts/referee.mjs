// REFEREE — automated invariants. Findings are never optional.
// Static checks run always; live auth checks run when BASE_URL is set
// (e.g. BASE_URL=http://localhost:3000 node scripts/referee.mjs).

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const pass = (name) => console.log(`  ✓ ${name}`);
const fail = (name, detail = "") => {
  failures++;
  console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
};

console.log("REFEREE · static invariants");

// ── 1 · Manifest schema ──
const manifest = JSON.parse(readFileSync(join(root, "content/manifest.json"), "utf-8"));
const shape = {
  identity: "object", hero: "object", origin: "object", projects: "object",
  vision: "object", contact: "object",
};
for (const [key, type] of Object.entries(shape)) {
  typeof manifest[key] === type && manifest[key] !== null
    ? pass(`manifest.${key} is ${type}`)
    : fail(`manifest.${key} is ${type}`);
}
Array.isArray(manifest.skills) ? pass("manifest.skills is array") : fail("manifest.skills is array");
Array.isArray(manifest.ledger) ? pass("manifest.ledger is array") : fail("manifest.ledger is array");

for (const [slug, p] of Object.entries(manifest.projects)) {
  if (typeof p.visible !== "boolean") fail(`projects.${slug}.visible boolean`);
  if (!["SHIPPED", "IN_THE_FORGE"].includes(p.status)) fail(`projects.${slug}.status valid`);
}
pass("all project overrides carry boolean visible + valid status");

for (const l of manifest.ledger) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(l.date)) fail(`ledger date ${l.date} ISO`);
  if (!["absorb", "skill", "milestone"].includes(l.type)) fail(`ledger type ${l.type} valid`);
}
pass("ledger entries dated + typed");

// ── 2 · Design Law: zero personal copy hardcoded in components ──
const personalStrings = ["Rupnagar", "NTSE", "TIET", "shaurya.verma2705", "7.82", "IIT Ropar"];
import { readdirSync, statSync } from "node:fs";
const tsxFiles = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".tsx")) tsxFiles.push(p);
  }
})(join(root, "components"));
let lawBroken = false;
for (const file of tsxFiles) {
  const src = readFileSync(file, "utf-8");
  for (const s of personalStrings) {
    if (src.includes(s)) {
      lawBroken = true;
      fail(`Design Law: "${s}" hardcoded in ${file.replace(root, "")}`);
    }
  }
}
if (!lawBroken) pass("Design Law: no personal copy in components/");

// ── 3 · No resume button; no masters-abroad ──
let resumeFound = false;
for (const file of tsxFiles) {
  const src = readFileSync(file, "utf-8");
  if (/resume\.(pdf|jpg)/i.test(src) || /Download Resume/i.test(src)) {
    resumeFound = true;
    fail(`resume artifact in ${file.replace(root, "")}`);
  }
}
if (!resumeFound) pass("resume download is dead");
JSON.stringify(manifest).toLowerCase().includes("masters") || JSON.stringify(manifest).includes("Aalto")
  ? fail("masters-abroad / dated promise still in manifest")
  : pass("no masters-abroad node, no dated promises in vision");

// ── 4 · Secrets never committed ──
existsSync(join(root, ".env.local"))
  ? (readFileSync(join(root, ".gitignore"), "utf-8").includes(".env")
      ? pass(".env.local exists and is gitignored")
      : fail(".env.local NOT gitignored"))
  : pass("no .env.local (prod env only)");
for (const file of tsxFiles) {
  const src = readFileSync(file, "utf-8");
  if (/ghp_|gsk_|vcp_/.test(src)) fail(`token-like string in ${file.replace(root, "")}`);
}
pass("no token-like strings in components");

// ── 5 · Live auth invariants (needs BASE_URL + running server) ──
const base = process.env.BASE_URL;
if (base) {
  console.log(`REFEREE · live auth invariants against ${base}`);
  const expect = async (name, promise, check) => {
    try {
      const res = await promise;
      check(res) ? pass(name) : fail(name, `status ${res.status}`);
    } catch (e) {
      fail(name, e.message);
    }
  };
  await expect("GET /forge redirects to login when unauthenticated",
    fetch(`${base}/forge`, { redirect: "manual" }),
    (r) => [302, 307, 308].includes(r.status) && (r.headers.get("location") ?? "").includes("/forge/login"));
  await expect("GET /api/forge/manifest → 401 without cookie",
    fetch(`${base}/api/forge/manifest`), (r) => r.status === 401);
  await expect("PUT /api/forge/manifest → 401 without cookie",
    fetch(`${base}/api/forge/manifest`, { method: "PUT", body: "{}" }), (r) => r.status === 401);
  await expect("POST /api/cortex → 401 without cookie",
    fetch(`${base}/api/cortex`, { method: "POST", body: "{}" }), (r) => r.status === 401);
  await expect("login with wrong password → 401",
    fetch(`${base}/api/forge/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "definitely-wrong" }),
    }), (r) => r.status === 401);
  await expect("POST /api/evolve with bad secret → 401",
    fetch(`${base}/api/evolve`, {
      method: "POST",
      headers: { Authorization: "Bearer nope", "Content-Type": "application/json" },
      body: JSON.stringify({ type: "skill", tag: "x" }),
    }), (r) => r.status === 401);
  await expect("POST /api/evolve with no auth → 401",
    fetch(`${base}/api/evolve`, { method: "POST", body: "{}" }), (r) => r.status === 401);
  await expect("public / renders 200",
    fetch(`${base}/`), (r) => r.status === 200);
} else {
  console.log("REFEREE · live checks skipped (set BASE_URL to run)");
}

console.log(failures === 0 ? "\nREFEREE: ALL GREEN" : `\nREFEREE: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
