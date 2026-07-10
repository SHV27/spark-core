"use client";

import { motion } from "framer-motion";
import { Award, Trophy, Star, Users, Heart, type LucideIcon } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

interface Achievement {
  icon: LucideIcon;
  color: "cyan" | "violet" | "muted";
  title: string;
  body: string;
}

const achievements: Achievement[] = [
  {
    icon: Award,
    color: "cyan",
    title: "National NTSE Scholar — 2021",
    body: "Top national rank in Science & Mathematics. Awarded to the top ~0.01% of students who appear for the National Talent Search Examination.",
  },
  {
    icon: Trophy,
    color: "cyan",
    title: "1st Place — Gen AI Hackathon, IIT Ropar",
    body: "First place at the Generative AI Hackathon hosted at IIT Ropar.",
  },
  {
    icon: Star,
    color: "violet",
    title: "EC Core Member — Saturnalia",
    body: "Core organizing committee member for TIET's annual techno-cultural festival.",
  },
  {
    icon: Users,
    color: "violet",
    title: "EC Member — Urja",
    body: "Organizing committee member for TIET's annual sports festival.",
  },
  {
    icon: Heart,
    color: "muted",
    title: "Volunteer — Bharat Vikas Parishad",
    body: "Community and social service initiatives — tree plantation, outreach programs.",
  },
];

const certs = [
  "AI Mentorship Program | Launched Global (in assoc. with IIT Kharagpur) | ID: LEDCC4828",
  "Predictive Analytics Guided Projects | TIET via LinkedIn Learning",
];

const colorMap = {
  cyan: "text-cyan-primary border-cyan-primary/30 bg-cyan-primary/10",
  violet: "text-violet-accent border-violet-accent/30 bg-violet-accent/10",
  muted: "text-text-muted border-border-subtle bg-space-card/60",
};

export default function BattleRecord() {
  return (
    <section
      id="battle-record"
      className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:py-28"
    >
      <SectionHeader eyebrow="Battle Record" title="What I've earned." />

      <div className="mt-12 space-y-4">
        {achievements.map((a, idx) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="flex items-start gap-4 rounded-xl border border-border-subtle bg-space-deep/60 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-border-subtle/80 sm:gap-5 sm:p-6"
            >
              <span
                className={`shrink-0 rounded-xl border p-3 ${colorMap[a.color]}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-syne text-base font-bold text-text-primary sm:text-lg">
                  {a.title}
                </h3>
                <p className="mt-1.5 font-jakarta text-sm leading-relaxed text-text-muted">
                  {a.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Certifications */}
      <div className="mt-14">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            Certifications
          </span>
          <span className="h-px flex-1 bg-border-subtle" />
        </div>
        <ul className="mt-5 space-y-3">
          {certs.map((c) => (
            <li
              key={c}
              className="flex items-start gap-3 font-jakarta text-sm text-text-muted"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-primary/60" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
