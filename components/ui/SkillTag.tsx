"use client";

interface SkillTagProps {
  label: string;
  /** Larger, more prominent pill — used for the Focus Areas group. */
  prominent?: boolean;
  /** Cyan-tinted variant for the highlighted LLM group. */
  highlighted?: boolean;
}

// Individual skill chip. Council: chose hover state of border→cyan glow + tiny
// lift over a fill change, because a fill on every pill turns the Arsenal into a
// wall of color; a quiet border that energizes on hover reads more "engineered."
export default function SkillTag({
  label,
  prominent = false,
  highlighted = false,
}: SkillTagProps) {
  const base =
    "inline-flex items-center rounded-full border font-jakarta font-medium transition-all duration-200 cursor-default select-none";
  const size = prominent ? "px-4 py-2 text-sm sm:text-base" : "px-3.5 py-1.5 text-sm";
  const palette = highlighted
    ? "border-cyan-primary/40 bg-cyan-primary/10 text-text-primary hover:border-cyan-primary hover:shadow-glow-cyan"
    : "border-border-subtle bg-space-card/60 text-text-muted hover:border-cyan-primary hover:text-text-primary hover:shadow-glow-cyan";

  return (
    <span
      className={`${base} ${size} ${palette} hover:-translate-y-0.5`}
    >
      {label}
    </span>
  );
}
