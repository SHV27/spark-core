"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import SkillTag from "../ui/SkillTag";

interface SkillGroup {
  label: string;
  tags: string[];
  highlighted?: boolean;
  prominent?: boolean;
}

const groups: SkillGroup[] = [
  {
    label: "Deep Learning & Vision",
    tags: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "OpenCV",
      "CNN Architecture",
      "Transfer Learning",
      "ResNet",
    ],
  },
  {
    label: "Machine Learning",
    tags: [
      "scikit-learn",
      "XGBoost",
      "Random Forest",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
    ],
  },
  {
    label: "LLM & AI-Native Development",
    highlighted: true,
    tags: [
      "Claude API",
      "Prompt Engineering",
      "LLM Pipelines",
      "HuggingFace",
      "Structured Output Generation",
    ],
  },
  {
    label: "Languages & Tools",
    tags: [
      "Python",
      "C",
      "C++",
      "Git",
      "Jupyter",
      "Google Colab",
      "LaTeX",
      "Flask",
      "Arduino",
    ],
  },
  {
    label: "Focus Areas",
    prominent: true,
    tags: [
      "Computer Vision",
      "Deep Learning",
      "NLP",
      "Predictive Analytics",
      "AI-Native Engineering",
    ],
  },
];

export default function Arsenal() {
  return (
    <section id="arsenal" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="The Arsenal" title="Tools I think with." />

      <div className="mt-12 space-y-8">
        {groups.map((group, idx) => {
          const isHighlight = group.highlighted;
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={
                isHighlight
                  ? "rounded-2xl border border-cyan-primary/30 bg-cyan-primary/[0.04] p-6 shadow-glow-cyan sm:p-7"
                  : ""
              }
            >
              <div className="mb-4 flex items-center gap-3">
                <h3
                  className={`font-mono text-xs uppercase tracking-[0.2em] ${
                    isHighlight ? "text-cyan-primary" : "text-text-muted"
                  }`}
                >
                  {group.label}
                </h3>
                {isHighlight && (
                  <span className="rounded-full border border-cyan-primary/40 bg-cyan-primary/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-cyan-primary">
                    Differentiator
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.tags.map((tag) => (
                  <SkillTag
                    key={tag}
                    label={tag}
                    prominent={group.prominent}
                    highlighted={isHighlight}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
