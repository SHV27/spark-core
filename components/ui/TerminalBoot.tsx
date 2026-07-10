"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Terminal Boot Sequence — typewriter boot log that plays once per session,
// then dissolves to reveal the hero. Council: gate on sessionStorage (not
// localStorage) so the theatre replays for a genuinely new visit but never
// nags within a session, and always render a SKIP for repeat/impatient users.

const CHAR_MS = 18;
const LINE_PAUSE_MS = 150;

interface TerminalBootProps {
  /** Boot log lines — computed server-side from LIVE data (Design Law). */
  lines: string[];
  onDone: () => void;
}

export default function TerminalBoot({ lines: LINES, onDone }: TerminalBootProps) {
  const [visible, setVisible] = useState(true);
  const [rendered, setRendered] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem("bootPlayed", "1");
    } catch {
      /* sessionStorage may be unavailable — fail open */
    }
    setVisible(false);
    // Allow exit animation to play before unmounting/revealing hero.
    setTimeout(onDone, 600);
  };

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem("bootPlayed") === "1";
    } catch {
      alreadyPlayed = false;
    }

    if (alreadyPlayed || prefersReducedMotion) {
      finishedRef.current = true;
      setVisible(false);
      onDone();
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const typeLine = (lineIdx: number) => {
      if (cancelled) return;
      if (lineIdx >= LINES.length) {
        setDone(true);
        timers.push(setTimeout(finish, 650));
        return;
      }
      const text = LINES[lineIdx];
      let charIdx = 0;

      const typeChar = () => {
        if (cancelled) return;
        charIdx++;
        setCurrentLine(text.slice(0, charIdx));
        if (charIdx < text.length) {
          timers.push(setTimeout(typeChar, CHAR_MS));
        } else {
          setRendered((prev) => [...prev, text]);
          setCurrentLine("");
          timers.push(setTimeout(() => typeLine(lineIdx + 1), LINE_PAUSE_MS));
        }
      };
      typeChar();
    };

    timers.push(setTimeout(() => typeLine(0), 300));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-space-black px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border-subtle bg-[#05080F] shadow-glow-cyan"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
              <span className="ml-2 font-mono text-xs text-text-muted">
                spark-core: ~/boot
              </span>
              <button
                onClick={finish}
                className="ml-auto font-mono text-[0.7rem] uppercase tracking-wider text-text-muted transition-colors hover:text-cyan-primary"
                aria-label="Skip boot sequence"
              >
                Skip
              </button>
            </div>

            {/* Log body */}
            <div className="min-h-[180px] px-5 py-5 font-mono text-sm leading-relaxed text-cyan-primary sm:text-base">
              {rendered.map((line) => (
                <div key={line}>{line}</div>
              ))}
              {!done && (
                <div>
                  {currentLine}
                  <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-cyan-primary" />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
