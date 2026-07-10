"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";

export interface ProjectBlock {
  heading: string;
  /** Plain paragraph body. Use either `body` or `bullets`, not both. */
  body?: string;
  /** Arrow-prefixed bullet lines (architecture / models). */
  bullets?: string[];
}

export interface ProjectCardProps {
  number: string;
  title: string;
  stack: string[];
  typeBadge: string;
  accent: "cyan" | "violet";
  blocks: ProjectBlock[];
}

// Full-width mission case-study card. Council: chose a left accent rail + huge
// ghost number over a generic bordered card, so each mission reads like a docked
// dossier rather than a Tailwind feature card.
export default function ProjectCard({
  number,
  title,
  stack,
  typeBadge,
  accent,
  blocks,
}: ProjectCardProps) {
  const accentText = accent === "cyan" ? "text-cyan-primary" : "text-violet-accent";
  const accentBorderHover =
    accent === "cyan" ? "hover:border-cyan-primary/50" : "hover:border-violet-accent/50";
  const railColor =
    accent === "cyan"
      ? "from-cyan-primary/80 to-cyan-primary/0"
      : "from-violet-accent/80 to-violet-accent/0";
  const glow =
    accent === "cyan" ? "hover:shadow-glow-cyan" : "hover:shadow-glow-violet";

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl border border-border-subtle bg-space-deep/70 p-6 backdrop-blur-sm transition-all duration-300 sm:p-8 md:p-10 ${accentBorderHover} ${glow}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Accent rail */}
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${railColor}`}
        aria-hidden
      />

      {/* Ghost number watermark */}
      <span
        className="pointer-events-none absolute -right-2 -top-6 select-none font-syne text-[7rem] font-extrabold leading-none text-white/[0.03] sm:text-[9rem]"
        aria-hidden
      >
        {number}
      </span>

      {/* Header row */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className={`font-mono text-sm font-medium ${accentText}`}>
            {number}
          </span>
          <div>
            <h3 className="font-syne text-xl font-bold leading-tight text-text-primary sm:text-2xl">
              {title}
            </h3>
            <p className={`mt-1.5 font-mono text-xs uppercase tracking-wider ${accentText}`}>
              {typeBadge}
            </p>
          </div>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-[40%]">
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

      {/* Content blocks */}
      <div className="relative mt-7 grid gap-6 md:grid-cols-3">
        {blocks.map((block) => (
          <div key={block.heading}>
            <h4 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              {block.heading}
            </h4>
            {block.body && (
              <p className="mt-3 font-jakarta text-sm leading-relaxed text-text-muted">
                {block.body}
              </p>
            )}
            {block.bullets && (
              <ul className="mt-3 space-y-2">
                {block.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-2 font-jakarta text-sm leading-relaxed text-text-muted"
                  >
                    <span className={accentText} aria-hidden>
                      →
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Footer: GitHub coming soon */}
      <div className="relative mt-8 flex items-center gap-2 border-t border-border-subtle pt-5">
        <Github className="h-4 w-4 text-text-muted" />
        <span className="font-mono text-xs text-text-muted">GitHub</span>
        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[0.7rem] font-medium text-amber-300">
          Coming Soon
        </span>
      </div>
    </motion.article>
  );
}
