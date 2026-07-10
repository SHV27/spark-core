"use client";

import { motion } from "framer-motion";
import { Network, Cpu, Terminal } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

const cards = [
  {
    icon: Network,
    title: "LLM Pipeline Design",
    body: "Multi-step LLM workflows with structured output generation, prompt chaining, and domain-specific optimization using the Claude API.",
  },
  {
    icon: Cpu,
    title: "AI-Native Development",
    body: "Building software where language models are core components, not afterthoughts. Workflow automation systems and AI-augmented productivity tooling.",
  },
  {
    icon: Terminal,
    title: "Prompt Engineering",
    body: "Advanced prompting — few-shot, chain-of-thought, structured outputs, system prompt architecture. Making models perform reliably at production quality.",
  },
];

const expandingStack = [
  "RAG Systems",
  "Vector Databases",
  "LangChain",
  "LlamaIndex",
  "LLM Fine-tuning",
  "Agentic Workflows",
];

export default function LLMLab() {
  return (
    <section id="llm-lab" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="LLM Lab" title="Where I work at the frontier." />

      <p className="mt-8 max-w-2xl font-jakarta text-lg leading-relaxed text-text-muted">
        Large language models aren&apos;t tools I use on top of my work.{" "}
        <span className="text-text-primary">
          They&apos;re the reasoning engines inside my work.
        </span>
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-2xl border border-border-subtle bg-space-deep/70 p-7 backdrop-blur-sm transition-all duration-300 hover:border-cyan-primary/50 hover:shadow-glow-cyan"
            >
              <div className="inline-flex rounded-xl border border-cyan-primary/30 bg-cyan-primary/10 p-3 text-cyan-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-syne text-lg font-bold text-text-primary">
                {card.title}
              </h3>
              <p className="mt-3 font-jakarta text-sm leading-relaxed text-text-muted">
                {card.body}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Currently building */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mt-12 rounded-2xl border border-violet-accent/30 bg-violet-accent/[0.04] p-6 sm:p-7"
      >
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-violet-accent">
          Expanding Stack — Summer 2026
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {expandingStack.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-violet-accent/40 bg-violet-accent/10 px-3.5 py-1.5 font-jakarta text-sm font-medium text-text-primary transition-all duration-200 hover:border-violet-accent hover:shadow-glow-violet"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
