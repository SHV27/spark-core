"use client";

import { motion } from "framer-motion";
import type { LedgerEntry } from "@/lib/types";
import SectionHeader from "../ui/SectionHeader";

interface EvolutionLedgerProps {
  ledger: LedgerEntry[];
}

// THE SIGNATURE SECTION — the boldness budget lives here.
// A starship maintenance log: dated machine entries, cyan tick glyphs,
// scanline texture, newest first. It doesn't claim the site evolves — it IS
// the evidence (Law 1: form is the promise).

const typeGlyph: Record<LedgerEntry["type"], { glyph: string; color: string; label: string }> = {
  absorb: { glyph: "⚡", color: "text-cyan-primary", label: "ABSORB" },
  skill: { glyph: "◆", color: "text-violet-accent", label: "SKILL" },
  milestone: { glyph: "◈", color: "text-text-primary", label: "MILESTONE" },
};

export default function EvolutionLedger({ ledger }: EvolutionLedgerProps) {
  const entries = [...ledger].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section id="ledger" className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:py-28">
      <SectionHeader
        eyebrow="Evolution Ledger"
        title="This site updates itself. Here's the proof."
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative mt-12 overflow-hidden rounded-2xl border border-border-subtle bg-[#05080F]"
      >
        {/* Scanline texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,229,255,0.028) 0px, rgba(0,229,255,0.028) 1px, transparent 1px, transparent 3px)",
          }}
        />
        {/* Terminal title bar */}
        <div className="relative flex items-center gap-2 border-b border-border-subtle px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-primary/70" />
          <span className="font-mono text-xs text-text-muted">
            spark-core :: evolution.log — {entries.length} entries
          </span>
          <span className="ml-auto hidden font-mono text-[0.65rem] uppercase tracking-wider text-cyan-primary/70 sm:block">
            ● recording
          </span>
        </div>

        {/* Log body */}
        <div className="relative max-h-[480px] overflow-y-auto px-5 py-5 sm:px-7">
          <ol className="space-y-0">
            {entries.map((e, i) => {
              const t = typeGlyph[e.type] ?? typeGlyph.milestone;
              return (
                <motion.li
                  key={`${e.date}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                  className="group relative flex gap-4 border-l border-border-subtle py-3 pl-5"
                >
                  {/* Tick on the rail */}
                  <span
                    className={`absolute -left-[5px] top-[1.15rem] h-2.5 w-2.5 rounded-full border border-space-black ${
                      e.type === "absorb"
                        ? "bg-cyan-primary shadow-glow-cyan"
                        : e.type === "skill"
                          ? "bg-violet-accent"
                          : "bg-text-muted/60"
                    }`}
                  />
                  <div className="min-w-[5.5rem] pt-0.5 font-mono text-[0.68rem] text-text-muted/80">
                    {e.date}
                  </div>
                  <div className="min-w-0">
                    <span className={`mr-2 font-mono text-[0.65rem] ${t.color}`}>
                      {t.glyph} {t.label}
                    </span>
                    <span className="font-mono text-sm leading-relaxed text-text-primary/90">
                      {e.entry}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          {/* Blinking cursor — the log is alive, not archived */}
          <div className="flex items-center gap-2 border-l border-border-subtle py-3 pl-5">
            <span className="font-mono text-xs text-cyan-primary">&gt;</span>
            <span className="h-3.5 w-2 animate-blink bg-cyan-primary" aria-hidden />
            <span className="font-mono text-[0.68rem] text-text-muted/60">
              awaiting next evolution
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
