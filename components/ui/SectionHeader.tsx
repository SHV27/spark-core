"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}

// Reusable eyebrow + title + animated underline. Council: an animated underline
// that draws itself on enter (over a static border) gives each section a small
// "powering on" beat that ties into the neural/terminal motif without shouting.
export default function SectionHeader({
  eyebrow,
  title,
  align = "left",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        className="mt-3 font-syne text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.08 }}
      >
        {title}
      </motion.h2>

      <motion.div
        className={`mt-5 h-[2px] rounded-full bg-gradient-to-r from-cyan-primary to-violet-accent ${
          isCenter ? "mx-auto" : ""
        }`}
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 64, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
