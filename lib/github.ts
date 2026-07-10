import "server-only";
import localManifest from "@/content/manifest.json";
import {
  CaseStudy,
  Manifest,
  Project,
  isCaseStudy,
  isManifest,
} from "./types";

export const OWNER = "SHV27";
export const CONTENT_REPO = "spark-core";
const API = "https://api.github.com";

function headers(raw = false): HeadersInit {
  const h: Record<string, string> = {
    Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

/**
 * Manifest = the live one committed to the repo (revalidate 60 → /forge edits
 * go live in ~1 min without a redeploy). Any failure falls back to the copy
 * bundled at build time. The site NEVER white-screens.
 */
export async function getManifest(): Promise<Manifest> {
  try {
    const res = await fetch(
      `${API}/repos/${OWNER}/${CONTENT_REPO}/contents/content/manifest.json`,
      { headers: headers(true), next: { revalidate: 60 } }
    );
    if (res.ok) {
      const parsed: unknown = JSON.parse(await res.text());
      if (isManifest(parsed)) return parsed;
    }
  } catch {
    /* fall through to bundled copy */
  }
  return localManifest as unknown as Manifest;
}

interface RawRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  pushed_at: string;
  html_url: string;
  homepage: string | null;
  fork: boolean;
}

async function fetchRepos(): Promise<RawRepo[]> {
  try {
    const res = await fetch(
      `${API}/users/${OWNER}/repos?per_page=100&sort=pushed`,
      { headers: headers(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return (await res.json()) as RawRepo[];
  } catch {
    return [];
  }
}

function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * SIFARISH law: auto-pull everything, human curates, machine narrates.
 * Every public non-fork repo is a CANDIDATE; whether it ships is decided
 * ENTIRELY by manifest.projects.<name>.visible in spark-core's own manifest —
 * the source repos on GitHub stay exactly as they always were (no topics,
 * no marker files). A repo not yet listed in the manifest is hidden until
 * Shaurya explicitly promotes it from /forge.
 */
export async function getProjects(manifest?: Manifest): Promise<Project[]> {
  const m = manifest ?? (await getManifest());
  const repos = await fetchRepos();
  const overrides = m.projects ?? {};

  const projects: Project[] = [];
  for (const repo of repos) {
    if (repo.fork) continue;
    const o = overrides[repo.name];
    if (!o || o.visible !== true) continue; // hidden until promoted in /forge
    projects.push({
      slug: repo.name,
      title: o.title ?? titleFromSlug(repo.name),
      description: repo.description ?? "",
      language: repo.language,
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      repoUrl: repo.html_url,
      liveUrl: o.liveUrl || repo.homepage || null,
      status: o.status ?? "IN_THE_FORGE",
      accent: o.accent ?? "cyan",
      pin: o.pin ?? null,
      tagline: o.tagline ?? repo.description ?? "",
      caseStudy: await getCaseStudy(repo.name),
    });
  }

  projects.sort((a, b) => {
    if (a.pin !== null && b.pin !== null) return a.pin - b.pin;
    if (a.pin !== null) return -1;
    if (b.pin !== null) return 1;
    return b.pushedAt.localeCompare(a.pushedAt);
  });
  return projects;
}

/** Groq-compiled case study committed by /api/cortex; null until absorbed. */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const res = await fetch(
      `${API}/repos/${OWNER}/${CONTENT_REPO}/contents/content/projects/${slug}.json`,
      { headers: headers(true), next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const parsed: unknown = JSON.parse(await res.text());
    return isCaseStudy(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * "Last evolved" = the newest signal of life across everything the site
 * absorbs: project pushes and ledger entries.
 */
export function getLastEvolved(projects: Project[], manifest: Manifest): Date {
  let latest = 0;
  for (const p of projects) {
    const t = Date.parse(p.pushedAt);
    if (t > latest) latest = t;
  }
  for (const l of manifest.ledger) {
    const t = Date.parse(l.date);
    if (t > latest) latest = t;
  }
  return new Date(latest || Date.now());
}

export function relativeTime(from: Date): string {
  const s = Math.max(0, (Date.now() - from.getTime()) / 1000);
  if (s < 90) return "just now";
  const mins = Math.round(s / 60);
  if (mins < 90) return `${mins} minutes ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 36) return `${hrs} hours ago`;
  const days = Math.round(hrs / 24);
  if (days < 45) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
