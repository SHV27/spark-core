"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import type { Project } from "@/lib/types";
import SectionHeader from "../ui/SectionHeader";

interface MissionsProps {
  projects: Project[];
}

export default function Missions({ projects }: MissionsProps) {
  return (
    <section id="missions" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="Missions" title="Absorbed from GitHub." />
      <p className="mt-6 max-w-2xl font-jakarta text-base leading-relaxed text-text-muted">
        These cards assemble themselves from live repository data. New work
        appears here on its own — that&apos;s the point.
      </p>

      <div className="mt-12 space-y-8">
        {projects.length === 0 ? (
          // Invariant: the app never blanks. GitHub down → honest machine state.
          <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center">
            <p className="font-mono text-sm text-text-muted">
              ◈ uplink to GitHub interrupted — mission data will re-materialize
              shortly. The core is unharmed.
            </p>
          </div>
        ) : (
          projects.map((p, idx) => <MissionCard key={p.slug} project={p} index={idx} />)
        )}
      </div>
    </section>
  );
}

function MissionCard({ project: p, index }: { project: Project; index: number }) {
  const accentText = p.accent === "cyan" ? "text-cyan-primary" : "text-violet-accent";
  const borderHover =
    p.accent === "cyan" ? "hover:border-cyan-primary/50" : "hover:border-violet-accent/50";
  const rail =
    p.accent === "cyan"
      ? "from-cyan-primary/80 to-cyan-primary/0"
      : "from-violet-accent/80 to-violet-accent/0";
  const glow = p.accent === "cyan" ? "hover:shadow-glow-cyan" : "hover:shadow-glow-violet";
  const number = String(index + 1).padStart(2, "0");

  const stack = [p.language, ...p.topics].filter(Boolean).slice(0, 6) as string[];
  const pushedDate = new Date(p.pushedAt).toISOString().slice(0, 10);

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl border border-border-subtle bg-space-deep/70 p-6 backdrop-blur-sm transition-all duration-300 sm:p-8 md:p-10 ${borderHover} ${glow}`}
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.6, 0.25, 1] }}
    >
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${rail}`} aria-hidden />
      <span
        className="pointer-events-none absolute -right-2 -top-6 select-none font-syne text-[7rem] font-extrabold leading-none text-white/[0.03] sm:text-[9rem]"
        aria-hidden
      >
        {number}
      </span>

      {/* Header */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className={`font-mono text-sm font-medium ${accentText}`}>{number}</span>
          <div>
            <h3 className="font-syne text-xl font-bold leading-tight text-text-primary sm:text-2xl">
              {p.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {p.status === "SHIPPED" ? (
                <span className="rounded-full border border-cyan-primary/50 bg-cyan-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-cyan-primary">
                  ▸ Shipped
                </span>
              ) : (
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-amber-300">
                  ⚒ In the Forge
                </span>
              )}
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-cyan-primary px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-space-black transition-transform hover:scale-105"
                >
                  Live <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:max-w-[40%] sm:justify-end">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border-subtle bg-space-card/60 px-2.5 py-1 font-mono text-[0.7rem] text-text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Tagline */}
      {p.tagline && (
        <p className="relative mt-5 max-w-3xl font-jakarta text-sm leading-relaxed text-text-primary/85">
          {p.tagline}
        </p>
      )}

      {/* Case study (Groq-compiled) or the compiling state */}
      {p.caseStudy ? (
        <div className="relative mt-7 grid gap-6 md:grid-cols-3">
          <CaseBlock heading="The Problem" body={p.caseStudy.problem} />
          <CaseBlock heading="The Approach" body={p.caseStudy.approach} />
          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              The Architecture
            </h4>
            <ul className="mt-3 space-y-2">
              {p.caseStudy.architecture.map((b) => (
                <li key={b} className="flex gap-2 font-jakarta text-sm leading-relaxed text-text-muted">
                  <span className={accentText} aria-hidden>→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="relative mt-6 font-mono text-xs text-text-muted/80">
          <span className="inline-block animate-pulse">◈</span> case study
          compiling in the cortex… (absorbed on command, not on a timer)
        </p>
      )}

      {/* Footer metadata — real numbers, small mono voice */}
      <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-subtle pt-5 font-mono text-xs text-text-muted">
        <a
          href={p.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-primary"
        >
          <Github className="h-4 w-4" /> {p.slug}
        </a>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> {p.stars}
        </span>
        <span>last push {pushedDate}</span>
        {p.caseStudy?.oneLiner && (
          <span className="w-full text-text-primary/70 sm:w-auto sm:flex-1 sm:text-right">
            &ldquo;{p.caseStudy.oneLiner}&rdquo;
          </span>
        )}
      </div>
    </motion.article>
  );
}

function CaseBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h4 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
        {heading}
      </h4>
      <p className="mt-3 font-jakarta text-sm leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}
