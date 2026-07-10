// SPARK CORE data contracts. The manifest is the single source of truth for
// everything a human wrote; GitHub is the source of truth for everything code did.

export interface Identity {
  name: string;
  role: string;
  location: string;
}

export interface HeroCopy {
  eyebrow: string;
  sub: string;
  body: string;
}

export interface Inspiration {
  img: string;
  caption: string;
}

export interface OriginCopy {
  paragraphs: string[];
  inspirations: Inspiration[];
}

export interface SkillGroup {
  group: string;
  highlight: boolean;
  tags: string[];
}

export type ProjectStatus = "SHIPPED" | "IN_THE_FORGE";
export type Accent = "cyan" | "violet";

export interface ProjectOverride {
  title?: string;
  visible: boolean;
  status: ProjectStatus;
  pin?: number;
  liveUrl?: string;
  accent?: Accent;
  tagline?: string;
}

export type LedgerType = "absorb" | "skill" | "milestone";

export interface LedgerEntry {
  date: string; // ISO yyyy-mm-dd
  type: LedgerType;
  entry: string;
}

export interface Manifest {
  identity: Identity;
  hero: HeroCopy;
  origin: OriginCopy;
  skills: SkillGroup[];
  projects: Record<string, ProjectOverride>;
  ledger: LedgerEntry[];
  vision: { manifesto: string };
  contact: { email: string; linkedin: string; github: string };
}

export interface CaseStudy {
  problem: string;
  approach: string;
  architecture: string[];
  oneLiner: string;
}

/** A repo after merging live GitHub data with manifest overrides. */
export interface Project {
  slug: string;
  title: string;
  description: string;
  language: string | null;
  topics: string[];
  stars: number;
  pushedAt: string; // ISO datetime
  repoUrl: string;
  liveUrl: string | null;
  status: ProjectStatus;
  accent: Accent;
  pin: number | null;
  tagline: string;
  caseStudy: CaseStudy | null;
}

export function isManifest(x: unknown): x is Manifest {
  if (!x || typeof x !== "object") return false;
  const m = x as Record<string, unknown>;
  return (
    typeof m.identity === "object" &&
    typeof m.hero === "object" &&
    typeof m.origin === "object" &&
    Array.isArray(m.skills) &&
    typeof m.projects === "object" &&
    Array.isArray(m.ledger) &&
    typeof m.vision === "object" &&
    typeof m.contact === "object"
  );
}

export function isCaseStudy(x: unknown): x is CaseStudy {
  if (!x || typeof x !== "object") return false;
  const c = x as Record<string, unknown>;
  return (
    typeof c.problem === "string" &&
    typeof c.approach === "string" &&
    Array.isArray(c.architecture) &&
    c.architecture.every((a) => typeof a === "string") &&
    typeof c.oneLiner === "string"
  );
}
