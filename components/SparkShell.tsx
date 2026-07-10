"use client";

import { useState } from "react";
import type { Manifest, Project } from "@/lib/types";
import NeuralBackground from "./ui/NeuralBackground";
import TerminalBoot from "./ui/TerminalBoot";
import AnthemPlayer from "./ui/AnthemPlayer";
import Hero from "./sections/Hero";
import Origin from "./sections/Origin";
import Arsenal from "./sections/Arsenal";
import Missions from "./sections/Missions";
import EvolutionLedger from "./sections/EvolutionLedger";
import TheVision from "./sections/TheVision";
import Contact from "./sections/Contact";

interface SparkShellProps {
  manifest: Manifest;
  projects: Project[];
  lastEvolvedText: string;
  bootLines: string[];
}

export default function SparkShell({
  manifest,
  projects,
  lastEvolvedText,
  bootLines,
}: SparkShellProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <TerminalBoot lines={bootLines} onDone={() => setRevealed(true)} />
      <NeuralBackground />

      <main className="relative">
        <Hero
          reveal={revealed}
          identity={manifest.identity}
          hero={manifest.hero}
          lastEvolvedText={lastEvolvedText}
        />
        <Origin origin={manifest.origin} />
        <Arsenal skills={manifest.skills} />
        <Missions projects={projects} />
        <EvolutionLedger ledger={manifest.ledger} />
        <TheVision manifesto={manifest.vision.manifesto} />
        <Contact contact={manifest.contact} identity={manifest.identity} />
      </main>

      <AnthemPlayer />
    </>
  );
}
