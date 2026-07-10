"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  sublabel: string;
}

// Single stat: big gradient number + two-line muted caption.
export default function StatCard({ value, label, sublabel }: StatCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="gradient-text font-syne text-5xl font-extrabold tracking-tight sm:text-6xl">
        {value}
      </span>
      <span className="mt-2 font-jakarta text-sm font-semibold uppercase tracking-wider text-text-primary">
        {label}
      </span>
      <span className="mt-0.5 font-mono text-xs uppercase tracking-wider text-text-muted">
        {sublabel}
      </span>
    </motion.div>
  );
}
