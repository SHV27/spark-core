"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowDown, Download } from "lucide-react";

interface HeroProps {
  /** Gates the entrance animation until the boot sequence has finished. */
  reveal: boolean;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.5, 0.3, 1] as const } },
};

export default function Hero({ reveal }: HeroProps) {
  const scrollToMissions = () => {
    document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" });
  };

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
          B.Tech CSE · TIET Patiala · NTSE National Scholar
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 font-syne text-6xl font-extrabold leading-[0.95] tracking-tight text-text-primary sm:text-7xl md:text-8xl"
        >
          SHAURYA
          <br />
          <span className="gradient-text">VERMA</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 font-jakarta text-xl font-medium text-text-primary/90 sm:text-2xl"
        >
          I build intelligent systems that learn, reason, and solve.
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 max-w-lg font-jakarta text-base leading-relaxed text-text-muted"
        >
          Third-year CS student specializing in deep learning, computer vision,
          and LLM-powered systems. I don&apos;t just use AI — I think in AI.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={scrollToMissions}
            className="group inline-flex items-center gap-2 rounded-lg bg-cyan-primary px-6 py-3 font-jakarta font-semibold text-space-black transition-all duration-200 hover:scale-105 hover:shadow-glow-cyan-strong"
          >
            See My Work
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>

          <a
            href="/resume.jpg"
            download="Shaurya_Verma_Resume.jpg"
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-primary px-6 py-3 font-jakarta font-semibold text-cyan-primary transition-all duration-200 hover:bg-cyan-primary/10"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </motion.div>

        {/* Easter egg: a quiet little discovery — fires the floating AnthemPlayer. */}
        <motion.button
          variants={item}
          onClick={() => window.dispatchEvent(new Event("play-anthem"))}
          className="mt-6 font-jakarta text-xs text-text-muted/70 transition-colors duration-200 hover:text-cyan-primary"
        >
          🎵 I have a theme song
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
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
