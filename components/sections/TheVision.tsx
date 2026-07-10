"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";

const manifesto = [
  "The AI landscape in 2026 demands engineers who can build RAG pipelines, work with vector databases, design agentic systems, and ship real products fast.",
  "I'm building exactly that — this summer.",
  "I'm not waiting for a classroom. I'm not doing a generic internship to check a box. I'm spending two months going deep on the skills that actually matter for the roles I want — and building the projects to prove it.",
  "By October 2026, I'll have shipped RAG-powered applications, worked with production vector databases, and built LLM-native systems that solve real problems for real users.",
  "If you're building something at the frontier of AI, this is the kind of engineer you want.",
];

interface TimelineNode {
  label: string;
  items: string[];
  highlighted?: boolean;
}

const nodes: TimelineNode[] = [
  {
    label: "Summer 2026",
    items: [
      "RAG systems & vector databases (Pinecone, ChromaDB, Qdrant)",
      "LangChain · LlamaIndex · Agentic workflows",
      "Claude Code & AI-native development paradigms",
      "2–3 deployed, public projects on GitHub",
    ],
  },
  {
    label: "October 2026",
    highlighted: true,
    items: [
      "AI/ML internship at an AI-first startup",
      "Full-stack LLM application — deployed, live, used",
      "GitHub portfolio that demonstrates real depth",
    ],
  },
  {
    label: "2027 & Beyond",
    items: [
      "Deep work at an AI-first startup",
      "Masters abroad (Germany / Finland Aalto)",
      "Building AI systems at the frontier",
    ],
  },
];

export default function TheVision() {
  return (
    <section id="vision" className="relative z-10 overflow-hidden px-6 py-28 sm:py-32">
      {/* Subtle radial glow to make this section feel like a declaration */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.08) 0%, rgba(0,229,255,0) 60%)",
        }}
      />

      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="The Vision" title="Where I'm going." align="center" />

        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-center">
          {manifesto.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={
                i === 1
                  ? "font-syne text-xl font-bold text-text-primary sm:text-2xl"
                  : i === manifesto.length - 1
                    ? "gradient-text font-syne text-lg font-bold sm:text-xl"
                    : "font-jakarta text-base leading-relaxed text-text-muted sm:text-lg"
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {nodes.map((node, idx) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className={`relative rounded-2xl border p-6 backdrop-blur-sm ${
                node.highlighted
                  ? "border-cyan-primary/60 bg-cyan-primary/[0.05] shadow-glow-cyan-strong"
                  : "border-border-subtle bg-space-deep/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    node.highlighted ? "bg-cyan-primary" : "bg-violet-accent/70"
                  }`}
                />
                <h3
                  className={`font-syne text-lg font-bold ${
                    node.highlighted ? "text-cyan-primary" : "text-text-primary"
                  }`}
                >
                  {node.label}
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {node.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 font-jakarta text-sm leading-relaxed text-text-muted"
                  >
                    <span className="text-cyan-primary/70" aria-hidden>
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
