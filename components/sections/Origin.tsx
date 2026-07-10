"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { OriginCopy } from "@/lib/types";
import SectionHeader from "../ui/SectionHeader";

interface OriginProps {
  origin: OriginCopy;
}

export default function Origin({ origin }: OriginProps) {
  const paragraphs = origin.paragraphs;

  return (
    <section id="origin" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <SectionHeader eyebrow="The Origin" title="Where the spark caught." />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
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

          <div className="flex justify-center lg:justify-end">
            <Photo />
          </div>
        </div>

        {/* Inspiration dock — renders whatever Shaurya drops in /public/inspiration/,
            captions from the manifest. Intentional at 0, 3, or 10 images. */}
        {origin.inspirations.length > 0 && (
          <div className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">
              inspiration dock
            </p>
            <div className="mt-5 flex gap-5 overflow-x-auto pb-3">
              {origin.inspirations.map((ins) => (
                <figure
                  key={ins.img}
                  className="group relative w-52 shrink-0 overflow-hidden border border-cyan-primary/25 bg-space-deep/70"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                  }}
                >
                  <div className="relative aspect-[4/3] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ins.img}
                      alt={ins.caption}
                      className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="border-t border-cyan-primary/20 px-3 py-2 font-mono text-[0.65rem] leading-snug text-text-muted">
                    {ins.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

// Photo rule (named v1 regression): object-cover + object-position pinned to the
// TOP of the frame so the full head is always visible at every breakpoint.
function Photo() {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border lg:rotate-2"
      style={{
        borderColor: "rgba(0, 229, 255, 0.3)",
        boxShadow: "0 0 40px var(--glow-cyan)",
      }}
    >
      <span className="absolute left-3 top-3 z-20 h-5 w-5 border-l-2 border-t-2 border-cyan-primary/60" />
      <span className="absolute bottom-3 right-3 z-20 h-5 w-5 border-b-2 border-r-2 border-violet-accent/60" />

      {!errored ? (
        <Image
          src="/photo.jpg"
          alt="Shaurya Verma"
          fill
          sizes="(max-width: 1024px) 100vw, 384px"
          className="object-cover"
          style={{ objectPosition: "50% 0%" }}
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-space-card to-space-deep">
          <span className="gradient-text font-syne text-7xl font-extrabold tracking-tight">SV</span>
        </div>
      )}
    </div>
  );
}
