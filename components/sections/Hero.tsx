"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowDown } from "lucide-react";
import type { HeroCopy, Identity } from "@/lib/types";

interface HeroProps {
  reveal: boolean;
  identity: Identity;
  hero: HeroCopy;
  /** e.g. "2 days ago" — the thesis of the whole site, rendered live. */
  lastEvolvedText: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.5, 0.3, 1] as const } },
};

export default function Hero({ reveal, identity, hero, lastEvolvedText }: HeroProps) {
  const scrollToMissions = () => {
    document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" });
  };

  const [first, ...rest] = identity.name.toUpperCase().split(" ");
  const last = rest.join(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate={reveal ? "show" : "hidden"}
        className="relative z-10 flex max-w-3xl flex-col items-center"
      >
        <motion.p
          variants={item}
          className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cyan-primary sm:text-xs"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 font-syne text-6xl font-extrabold leading-[0.95] tracking-tight text-text-primary sm:text-7xl md:text-8xl"
        >
          {first}
          <br />
          <span className="gradient-text">{last}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 font-syne text-lg font-bold text-cyan-primary sm:text-xl"
        >
          {identity.role}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 font-jakarta text-xl font-medium text-text-primary/90 sm:text-2xl"
        >
          {hero.sub}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 max-w-lg font-jakarta text-base leading-relaxed text-text-muted"
        >
          {hero.body}
        </motion.p>

        <motion.div variants={item} className="mt-9">
          <button
            onClick={scrollToMissions}
            className="group inline-flex items-center gap-2 rounded-lg bg-cyan-primary px-6 py-3 font-jakarta font-semibold text-space-black transition-all duration-200 hover:scale-105 hover:shadow-glow-cyan-strong"
          >
            See My Work
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </motion.div>

        {/* The machine-voice stamp — this single live line is the site's thesis. */}
        <motion.p
          variants={item}
          className="mt-8 font-mono text-xs tracking-wide text-text-muted"
        >
          <span className="text-cyan-primary">◈</span> Last evolved:{" "}
          <span className="text-text-primary">{lastEvolvedText}</span> — autonomously
        </motion.p>

        {/* Easter egg: fires the floating AnthemPlayer. Barney energy stays. */}
        <motion.button
          variants={item}
          onClick={() => window.dispatchEvent(new Event("play-anthem"))}
          className="mt-4 font-jakarta text-xs text-text-muted/70 transition-colors duration-200 hover:text-cyan-primary"
        >
          🎵 I have a theme song
        </motion.button>
      </motion.div>

      <motion.button
        onClick={scrollToMissions}
        aria-label="Scroll to work"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          scroll
        </span>
        <ChevronDown className="h-5 w-5 animate-gentle-bounce text-cyan-primary" />
      </motion.button>
    </section>
  );
}
