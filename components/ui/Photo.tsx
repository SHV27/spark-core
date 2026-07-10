"use client";

import Image from "next/image";
import { useState } from "react";

// TODO: Copy photo.jpg to /public/
// Council: render a styled "SV" monogram placeholder when photo.jpg is absent
// (onError fallback) rather than letting a broken <img> ship — the build and the
// layout must both survive a missing asset. The cyan-glow frame is shared by
// both states so the section looks intentional either way.
export default function Photo() {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border lg:rotate-2"
      style={{
        borderColor: "rgba(0, 229, 255, 0.3)",
        boxShadow: "0 0 40px var(--glow-cyan)",
      }}
    >
      {/* Corner accents for a framed, instrument-panel feel */}
      <span className="absolute left-3 top-3 z-20 h-5 w-5 border-l-2 border-t-2 border-cyan-primary/60" />
      <span className="absolute bottom-3 right-3 z-20 h-5 w-5 border-b-2 border-r-2 border-violet-accent/60" />

      {!errored ? (
        <Image
          src="/photo.jpg"
          alt="Shaurya Verma"
          fill
          sizes="(max-width: 1024px) 100vw, 384px"
          className="object-cover"
          onError={() => setErrored(true)}
          priority={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-space-card to-space-deep">
          <span className="gradient-text font-syne text-7xl font-extrabold tracking-tight">
            SV
          </span>
          <span className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-text-muted">
            Shaurya Verma
          </span>
        </div>
      )}
    </div>
  );
}
