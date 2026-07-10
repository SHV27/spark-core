"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause } from "lucide-react";

// AnthemPlayer — a floating anthem button that expands into a mini-player with a
// REAL frequency-bar visualizer driven by the Web Audio API (AnalyserNode).
//
// Council: chose a FLOATING bottom-right player over an inline one because the
// anthem is a personality flourish, not section content — it should stay
// discoverable and controllable while the visitor scrolls the whole site, and a
// fixed corner pill reads as "now playing" hardware rather than a page element.
// It mirrors the SkillTag language (subtle border, cyan-on-hover) so it belongs.

const NUM_BARS = 14;
const SONG_TITLE = "Shaurya Verma Is Awesome";

export default function AnthemPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number>(0);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const [isPlaying, setIsPlaying] = useState(false);

  // Lazily wire the Web Audio graph on first play (must follow a user gesture so
  // the AudioContext is allowed to start). createMediaElementSource can only run
  // once per element, so guard with sourceRef.
  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return false;
    if (sourceRef.current) return true;
    try {
      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // 32 frequency bins — plenty for 14 bars
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      ctxRef.current = ctx;
      sourceRef.current = source;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(
        new ArrayBuffer(analyser.frequencyBinCount)
      );
      return true;
    } catch {
      // Analyser unavailable (older browser) — audio still plays, bars stay idle.
      return false;
    }
  }, []);

  const renderBars = useCallback(() => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (analyser && data) {
      analyser.getByteFrequencyData(data);
      const bins = data.length;
      for (let i = 0; i < NUM_BARS; i++) {
        const el = barRefs.current[i];
        if (!el) continue;
        // Sample low-mid bins where musical energy concentrates.
        const idx = Math.floor((i / NUM_BARS) * (bins * 0.7)) + 1;
        const v = data[Math.min(idx, bins - 1)] / 255; // 0..1
        const height = 12 + v * 88; // 12%..100%
        el.style.height = `${height}%`;
      }
    }
    rafRef.current = requestAnimationFrame(renderBars);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureGraph();
    // Resume context if the browser suspended it before the gesture resolved.
    if (ctxRef.current?.state === "suspended") {
      void ctxRef.current.resume();
    }
    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(renderBars);
      })
      .catch(() => {
        // Autoplay/permissions rejected — stay idle silently.
        setIsPlaying(false);
      });
  }, [ensureGraph, renderBars]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  // Hero easter-egg + any external trigger fire a window event instead of
  // prop-drilling the play handler across the tree.
  useEffect(() => {
    const handler = () => play();
    window.addEventListener("play-anthem", handler);
    return () => window.removeEventListener("play-anthem", handler);
  }, [play]);

  // Reset to idle when the track finishes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      void ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {/* HTML5 Audio element — controlled entirely via the ref, no library. */}
      <audio ref={audioRef} src="/anthem.mp3" preload="none" />

      <AnimatePresence mode="wait" initial={false}>
        {isPlaying ? (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 rounded-full border border-cyan-primary/40 bg-space-card/90 py-2 pl-4 pr-2 shadow-glow-cyan backdrop-blur-md"
          >
            {/* Real-frequency waveform */}
            <div className="flex h-7 items-end gap-[3px]" aria-hidden>
              {Array.from({ length: NUM_BARS }).map((_, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  className="w-[3px] rounded-full bg-cyan-primary"
                  style={{ height: "20%" }}
                />
              ))}
            </div>

            <div className="hidden min-w-0 flex-col sm:flex">
              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-cyan-primary">
                Now Playing
              </span>
              <span className="truncate font-jakarta text-sm font-semibold text-text-primary">
                {SONG_TITLE}
              </span>
            </div>

            <button
              onClick={pause}
              aria-label="Pause anthem"
              className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-primary text-space-black transition-transform hover:scale-105"
            >
              <Pause className="h-4 w-4" fill="currentColor" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.25 }}
            className="group relative"
          >
            {/* Tooltip */}
            <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg border border-border-subtle bg-space-deep px-3 py-1.5 font-jakarta text-xs text-text-primary opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Play My Theme 🎵
            </span>

            <button
              onClick={toggle}
              aria-label="Play my anthem"
              className="flex items-center gap-2 rounded-full border border-border-subtle bg-space-card/80 py-2.5 pl-4 pr-5 font-jakarta text-sm font-medium text-text-muted backdrop-blur-md transition-all duration-200 hover:border-cyan-primary hover:text-text-primary hover:shadow-glow-cyan"
            >
              <Music className="h-4 w-4 text-cyan-primary" />
              My Anthem
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
