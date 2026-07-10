"use client";

import { useEffect, useRef } from "react";

// Neural Constellation — a from-scratch canvas particle field that merges
// Shaurya's astronomy interest (drifting stars) with the AI/neural-net metaphor
// (proximity links that "fire" near the cursor). No library.
//
// Council: chose plain Canvas 2D + requestAnimationFrame over a particle library
// or Three.js, because (a) the brief forbids a library here, (b) ~80 points with
// O(n²) proximity checks is trivially cheap, and (c) it keeps the bundle tiny.

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
}

const PARTICLE_COUNT = 80;
const MOUSE_RADIUS = 150;
const LINK_RADIUS = 130;

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let rafId = 0;
    let running = true;

    const seedParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacity: 0.4 + Math.random() * 0.2,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) seedParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Proximity to mouse → brighten
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const distM = Math.hypot(dxm, dym);
        const near = distM < MOUSE_RADIUS;
        const boost = near ? 1 - distM / MOUSE_RADIUS : 0;
        const alpha = Math.min(1, p.opacity + boost * 0.5);
        const radius = near ? 1.4 + boost * 1.6 : 1.3;

        // Star glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        if (near) {
          ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.shadowBlur = 8 * boost;
          ctx.shadowColor = "rgba(0, 229, 255, 0.6)";
        } else {
          ctx.fillStyle = `rgba(240, 246, 255, ${alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connections — only between particles that are themselves near the mouse,
        // so links form like a network "activating" under the cursor.
        if (near) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dxq = q.x - mouse.x;
            const dyq = q.y - mouse.y;
            if (Math.hypot(dxq, dyq) > MOUSE_RADIUS) continue;
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d = Math.hypot(dx, dy);
            if (d < LINK_RADIUS) {
              const lineAlpha = (1 - d / LINK_RADIUS) * 0.22 * boost;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      if (running) rafId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Pause rendering when the tab is hidden to save battery/CPU.
    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!prefersReducedMotion) {
        running = true;
        rafId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseout", handleLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    if (prefersReducedMotion) {
      // Render a single static frame — stars present, no motion.
      draw();
      running = false;
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseout", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
