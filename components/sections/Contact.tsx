"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Download, ArrowUpRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

interface ContactLink {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const links: ContactLink[] = [
  {
    icon: Mail,
    label: "Email",
    value: "shaurya.verma2705@gmail.com",
    href: "mailto:shaurya.verma2705@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91-9041523296",
    href: "tel:+919041523296",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/shaurya-verma-94a607329",
    href: "https://www.linkedin.com/in/shaurya-verma-94a607329/",
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/SHV27",
    href: "https://github.com/SHV27",
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="Contact" title="Let's build something." />

      <p className="mt-8 max-w-2xl font-jakarta text-base leading-relaxed text-text-muted sm:text-lg">
        I&apos;m actively seeking AI/ML internship opportunities for my 8th
        semester (Jan 2027). If you&apos;re building something interesting with
        AI, I want to know about it.
      </p>

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

      <div className="mt-10">
        <a
          href="/resume.jpg"
          download="Shaurya_Verma_Resume.jpg"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-primary px-6 py-3 font-jakarta font-semibold text-space-black transition-all duration-200 hover:scale-105 hover:shadow-glow-cyan-strong"
        >
          <Download className="h-4 w-4" />
          Download Resume
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border-subtle pt-8 text-center">
        <p className="font-jakarta text-sm text-text-muted">
          Shaurya Verma · B.Tech CSE, TIET Patiala · 2026
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted/70">
          Built with Next.js · Deployed on Vercel
        </p>
      </footer>
    </section>
  );
}
