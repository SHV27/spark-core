"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import StatCard from "../ui/StatCard";
import Photo from "../ui/Photo";

const paragraphs = [
  "I grew up in Rupnagar, Punjab — a small city where my father taught physics and showed me that understanding how things work is the beginning of everything.",
  "That curiosity compounded. 98.6% in 10th grade. A National NTSE Scholarship. And now a deep obsession with the field that's rewriting what computers can do.",
  "At TIET, I'm not studying machine learning — I'm building with it. My projects fuse MRI scans with clinical data to detect Alzheimer's before doctors can see it. They classify galaxies from telescope data. They help farmers make smarter decisions with soil and climate intelligence.",
  "I believe the best engineers aren't the ones who know every framework. They're the ones who can look at a hard problem, understand its structure, and build something that solves it cleanly.",
  "That's what I'm here to do.",
];

export default function Lore() {
  return (
    <section id="lore" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <SectionHeader eyebrow="The Lore" title="Not just another engineer." />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`font-jakarta leading-relaxed ${
                  i === paragraphs.length - 1
                    ? "font-syne text-lg font-semibold text-text-primary"
                    : "text-text-muted"
                }`}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Right: photo */}
          <div className="flex justify-center lg:justify-end">
            <Photo />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-border-subtle pt-12 sm:grid-cols-3">
          <StatCard value="3" label="Projects" sublabel="Active" />
          <StatCard value="3" label="ML Frameworks" sublabel="Mastered" />
          <StatCard value="2021" label="NTSE Scholar" sublabel="National Rank" />
        </div>
      </motion.div>
    </section>
  );
}
