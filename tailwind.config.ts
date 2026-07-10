import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "space-black": "#080C16",
        "space-deep": "#0F1629",
        "space-card": "#141C33",
        "cyan-primary": "#00E5FF",
        "violet-accent": "#8B5CF6",
        "text-primary": "#F0F6FF",
        "text-muted": "#94A3B8",
        "border-subtle": "#1E2D4F",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 40px rgba(0, 229, 255, 0.15)",
        "glow-cyan-strong": "0 0 50px rgba(0, 229, 255, 0.35)",
        "glow-violet": "0 0 40px rgba(139, 92, 246, 0.15)",
      },
      backgroundImage: {
        "cyan-violet": "linear-gradient(90deg, #00E5FF, #8B5CF6)",
      },
      keyframes: {
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
