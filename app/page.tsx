"use client";

import { useState } from "react";
import NeuralBackground from "../components/ui/NeuralBackground";
import TerminalBoot from "../components/ui/TerminalBoot";
import AnthemPlayer from "../components/ui/AnthemPlayer";
import Hero from "../components/sections/Hero";
import Lore from "../components/sections/Lore";
import Arsenal from "../components/sections/Arsenal";
import Missions from "../components/sections/Missions";
import LLMLab from "../components/sections/LLMLab";
import BattleRecord from "../components/sections/BattleRecord";
import TheVision from "../components/sections/TheVision";
import Contact from "../components/sections/Contact";

export default function Home() {
  // `revealed` flips once the boot sequence resolves (played, skipped, or
  // already-seen-this-session). The hero gates its entrance animation on it so
  // content never pops in behind the terminal overlay.
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <TerminalBoot onDone={() => setRevealed(true)} />
      <NeuralBackground />

      <main className="relative">
        <Hero reveal={revealed} />
        <Lore />
        <Arsenal />
        <Missions />
        <LLMLab />
        <BattleRecord />
        <TheVision />
        <Contact />
      </main>

      {/* Floating anthem player — above all content, reachable from anywhere. */}
      <AnthemPlayer />
    </>
  );
}
