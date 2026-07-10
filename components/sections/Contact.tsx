"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { Identity } from "@/lib/types";
import SectionHeader from "../ui/SectionHeader";

interface ContactProps {
  contact: { email: string; linkedin: string; github: string };
  identity: Identity;
}

export default function Contact({ contact, identity }: ContactProps) {
  const links: Array<{ icon: LucideIcon; label: string; value: string; href: string; external: boolean }> = [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, external: false },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: contact.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: contact.linkedin,
      external: true,
    },
    {
      icon: Github,
      label: "GitHub",
      value: contact.github.replace(/^https?:\/\/(www\.)?/, ""),
      href: contact.github,
      external: true,
    },
  ];

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="Contact" title="Let's build something." />

      <div className="mt-10 space-y-3">
        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-space-deep/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-cyan-primary/50 hover:shadow-glow-cyan sm:p-5"
            >
              <span className="rounded-lg border border-cyan-primary/30 bg-cyan-primary/10 p-2.5 text-cyan-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[0.7rem] uppercase tracking-wider text-text-muted">
                  {link.label}
                </p>
                <p className="truncate font-jakarta text-base font-medium text-text-primary sm:text-lg">
                  {link.value}
                </p>
              </div>
              <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-primary" />
            </motion.a>
          );
        })}
      </div>

      {/* Law 5: the resume download is dead. */}
      <p className="mt-10 font-mono text-sm text-text-muted">
        <span className="text-cyan-primary">◈</span> This site is my resume. It
        updates itself.
      </p>

      <footer className="mt-20 border-t border-border-subtle pt-8 text-center">
        <p className="font-jakarta text-sm text-text-muted">
          {identity.name} · {identity.location}
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted/70">
          SPARK CORE — self-evolving · Next.js · GitHub-as-database · Groq cortex
        </p>
      </footer>
    </section>
  );
}
