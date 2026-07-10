"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";

interface TheVisionProps {
  manifesto: string;
}

// The declaration. No dated promises live here — a self-evolving site must
// never contain a stale date (manifesto text comes from the manifest).
export default function TheVision({ manifesto }: TheVisionProps) {
  const sentences = manifesto.split(/(?<=\.)\s+/);
  const opener = sentences[0] ?? "";
  const rest = sentences.slice(1).join(" ");

  return (
    <section id="vision" className="relative z-10 overflow-hidden px-6 py-28 sm:py-32">
      {/* Deep-space radial glow + faint starfield (CSS, zero requests) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.09) 0%, rgba(139,92,246,0.04) 40%, rgba(0,229,255,0) 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 30%, rgba(240,246,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 78% 18%, rgba(240,246,255,0.35) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 55% 72%, rgba(0,229,255,0.4) 50%, transparent 51%), radial-gradient(1px 1px at 30% 85%, rgba(240,246,255,0.3) 50%, transparent 51%), radial-gradient(1px 1px at 90% 60%, rgba(139,92,246,0.4) 50%, transparent 51%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="The Vision" title="The engineer who directs." align="center" />

        {/* The typographic moment: the opening claim lands like a title card. */}
        <motion.p
          initial={{ opacity: 0, y: 24, letterSpacing: "0.06em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0em" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.6, 0.2, 1] }}
          className="mx-auto mt-14 text-center font-syne text-2xl font-bold leading-snug text-text-primary sm:text-3xl"
        >
          {opener}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-center font-jakarta text-base leading-relaxed text-text-muted sm:text-lg"
        >
          {rest}
        </motion.p>
      </div>
    </section>
  );
}
