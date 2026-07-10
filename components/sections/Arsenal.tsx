"use client";

import { motion } from "framer-motion";
import type { SkillGroup } from "@/lib/types";
import SectionHeader from "../ui/SectionHeader";
import SkillTag from "../ui/SkillTag";

interface ArsenalProps {
  skills: SkillGroup[];
}

export default function Arsenal({ skills }: ArsenalProps) {
  return (
    <section id="arsenal" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="The Arsenal" title="Tools I think with." />

      <div className="mt-12 space-y-8">
        {skills.map((group, idx) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={
              group.highlight
                ? "relative rounded-2xl border border-cyan-primary/30 bg-cyan-primary/[0.04] p-6 shadow-glow-cyan sm:p-7"
                : ""
            }
          >
            {/* Glow seam on the highlighted panel */}
            {group.highlight && (
              <span className="absolute left-0 top-6 h-10 w-[2px] rounded-full bg-gradient-to-b from-cyan-primary to-transparent" />
            )}
            <div className="mb-4 flex items-center gap-3">
              <h3
                className={`font-mono text-xs uppercase tracking-[0.2em] ${
                  group.highlight ? "text-cyan-primary" : "text-text-muted"
                }`}
              >
                {group.group}
              </h3>
              {group.highlight && (
                <span className="rounded-full border border-cyan-primary/40 bg-cyan-primary/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-cyan-primary">
                  Differentiator
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {group.tags.map((tag) => (
                <SkillTag key={tag} label={tag} highlighted={group.highlight} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 font-mono text-[0.7rem] text-text-muted/70">
        arsenal updates via /forge — no rebuilds
      </p>
    </section>
  );
}
