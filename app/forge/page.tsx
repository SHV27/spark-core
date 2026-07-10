"use client";

// THE FORGE — Shaurya's cockpit. Mobile-first: every control thumb-reachable,
// every save = one commit, causal feedback always ("Committed ✓ — live in ~60s").

import { useCallback, useEffect, useState } from "react";
import type { Manifest, ProjectOverride } from "@/lib/types";

interface RepoInfo {
  name: string;
  description: string;
  pushedAt: string;
  language: string | null;
}

type Tab = "projects" | "skills" | "ledger" | "voice";

const emptyOverride = (): ProjectOverride => ({
  visible: true,
  status: "IN_THE_FORGE",
  liveUrl: "",
  accent: "cyan",
  tagline: "",
});

export default function Forge() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [tab, setTab] = useState<Tab>("projects");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [absorbing, setAbsorbing] = useState<string>("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/forge/manifest")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? r.statusText);
        return r.json();
      })
      .then((d: { manifest: Manifest; repos: RepoInfo[] }) => {
        setManifest(d.manifest);
        setRepos(d.repos);
      })
      .catch((e: Error) => setLoadError(e.message));
  }, []);

  const save = useCallback(async (m: Manifest) => {
    setBusy(true);
    setStatus("committing…");
    try {
      const res = await fetch("/api/forge/manifest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manifest: m }),
      });
      if (res.ok) {
        setStatus("Committed ✓ — live in ~60s");
      } else {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus(`✗ ${d.error ?? "commit failed"}`);
      }
    } catch {
      setStatus("✗ network error");
    } finally {
      setBusy(false);
    }
  }, []);

  const absorb = useCallback(async (slug: string) => {
    setAbsorbing(slug);
    setStatus(`cortex compiling ${slug}…`);
    try {
      const res = await fetch("/api/cortex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus(res.ok ? `⚡ absorbed ${slug} ✓ — live in ~60s` : `✗ ${d.error ?? "absorb failed"}`);
    } catch {
      setStatus("✗ network error");
    } finally {
      setAbsorbing("");
    }
  }, []);

  if (loadError) {
    return (
      <Bay>
        <p className="font-mono text-sm text-red-400">✗ {loadError}</p>
      </Bay>
    );
  }
  if (!manifest) {
    return (
      <Bay>
        <p className="animate-pulse font-mono text-sm text-cyan-primary">
          ◈ powering up the maintenance bay…
        </p>
      </Bay>
    );
  }

  const listedSlugs = Object.keys(manifest.projects);
  const unlisted = repos.filter((r) => !listedSlugs.includes(r.name) && r.name !== "spark-core");

  return (
    <Bay>
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cyan-primary">
            ◈ Spark Core
          </p>
          <h1 className="font-syne text-2xl font-bold text-text-primary">The Forge</h1>
        </div>
        <button
          onClick={() => fetch("/api/forge/logout", { method: "POST" }).then(() => (window.location.href = "/"))}
          className="rounded-lg border border-border-subtle px-3 py-1.5 font-mono text-xs text-text-muted hover:border-cyan-primary hover:text-text-primary"
        >
          power down
        </button>
      </header>

      {/* Status strip — causal feedback, always visible */}
      <div
        aria-live="polite"
        className={`mt-4 min-h-[2.4rem] rounded-lg border px-4 py-2 font-mono text-xs ${
          status.startsWith("✗")
            ? "border-red-400/40 bg-red-400/5 text-red-300"
            : status
              ? "border-cyan-primary/40 bg-cyan-primary/5 text-cyan-primary"
              : "border-border-subtle text-text-muted"
        }`}
      >
        {status || "systems nominal — edits commit to GitHub, live in ~60s"}
      </div>

      {/* Tabs */}
      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(["projects", "skills", "ledger", "voice"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              tab === t
                ? "border-cyan-primary bg-cyan-primary/10 text-cyan-primary"
                : "border-border-subtle text-text-muted hover:text-text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* ── PROJECTS ── */}
      {tab === "projects" && (
        <section className="mt-6 space-y-4">
          {listedSlugs.map((slug) => {
            const p = manifest.projects[slug];
            return (
              <div key={slug} className="rounded-xl border border-border-subtle bg-space-deep/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-syne text-base font-bold text-text-primary">
                    {p.title ?? slug}
                    <span className="ml-2 font-mono text-[0.65rem] text-text-muted">{slug}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => absorb(slug)}
                      disabled={absorbing !== ""}
                      className="rounded-full border border-violet-accent/50 bg-violet-accent/10 px-3 py-1 font-mono text-[0.7rem] text-violet-accent transition-colors hover:border-violet-accent disabled:opacity-40"
                    >
                      {absorbing === slug ? "compiling…" : "⚡ Absorb"}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Toggle
                    label={p.visible ? "visible" : "hidden"}
                    on={p.visible}
                    onClick={() =>
                      setManifest({
                        ...manifest,
                        projects: { ...manifest.projects, [slug]: { ...p, visible: !p.visible } },
                      })
                    }
                  />
                  <Toggle
                    label={p.status === "SHIPPED" ? "SHIPPED" : "IN THE FORGE"}
                    on={p.status === "SHIPPED"}
                    amber={p.status !== "SHIPPED"}
                    onClick={() =>
                      setManifest({
                        ...manifest,
                        projects: {
                          ...manifest.projects,
                          [slug]: { ...p, status: p.status === "SHIPPED" ? "IN_THE_FORGE" : "SHIPPED" },
                        },
                      })
                    }
                  />
                  <input
                    type="number"
                    value={p.pin ?? ""}
                    placeholder="pin #"
                    onChange={(e) =>
                      setManifest({
                        ...manifest,
                        projects: {
                          ...manifest.projects,
                          [slug]: { ...p, pin: e.target.value === "" ? undefined : Number(e.target.value) },
                        },
                      })
                    }
                    className="rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-cyan-primary"
                  />
                  <select
                    value={p.accent ?? "cyan"}
                    onChange={(e) =>
                      setManifest({
                        ...manifest,
                        projects: {
                          ...manifest.projects,
                          [slug]: { ...p, accent: e.target.value as "cyan" | "violet" },
                        },
                      })
                    }
                    className="rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-cyan-primary"
                  >
                    <option value="cyan">cyan</option>
                    <option value="violet">violet</option>
                  </select>
                </div>

                <input
                  value={p.liveUrl ?? ""}
                  placeholder="live URL (empty = none)"
                  onChange={(e) =>
                    setManifest({
                      ...manifest,
                      projects: { ...manifest.projects, [slug]: { ...p, liveUrl: e.target.value } },
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-cyan-primary"
                />
                <textarea
                  value={p.tagline ?? ""}
                  placeholder="tagline"
                  rows={2}
                  onChange={(e) =>
                    setManifest({
                      ...manifest,
                      projects: { ...manifest.projects, [slug]: { ...p, tagline: e.target.value } },
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-jakarta text-xs text-text-primary outline-none focus:border-cyan-primary"
                />
              </div>
            );
          })}

          {unlisted.length > 0 && (
            <div className="rounded-xl border border-dashed border-border-subtle p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
                docked, not yet adopted
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {unlisted.map((r) => (
                  <button
                    key={r.name}
                    onClick={() =>
                      setManifest({
                        ...manifest,
                        projects: { ...manifest.projects, [r.name]: { ...emptyOverride(), tagline: r.description } },
                      })
                    }
                    className="rounded-full border border-border-subtle px-3 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-cyan-primary hover:text-cyan-primary"
                  >
                    + {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── SKILLS ── */}
      {tab === "skills" && (
        <section className="mt-6 space-y-4">
          {manifest.skills.map((g, gi) => (
            <div key={g.group} className="rounded-xl border border-border-subtle bg-space-deep/70 p-4">
              <p className={`font-mono text-xs uppercase tracking-wider ${g.highlight ? "text-cyan-primary" : "text-text-muted"}`}>
                {g.group}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.tags.map((t, ti) => (
                  <span key={t} className="group flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1 font-jakarta text-xs text-text-primary">
                    {t}
                    <button
                      aria-label={`remove ${t}`}
                      onClick={() => {
                        const skills = manifest.skills.map((sg, i) =>
                          i === gi ? { ...sg, tags: sg.tags.filter((_, j) => j !== ti) } : sg
                        );
                        setManifest({ ...manifest, skills });
                      }}
                      className="text-text-muted hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <AddTag
                  onAdd={(tag) => {
                    const skills = manifest.skills.map((sg, i) =>
                      i === gi && !sg.tags.includes(tag) ? { ...sg, tags: [...sg.tags, tag] } : sg
                    );
                    setManifest({ ...manifest, skills });
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── LEDGER ── */}
      {tab === "ledger" && (
        <section className="mt-6 space-y-3">
          <LedgerAdd
            onAdd={(entry) =>
              setManifest({
                ...manifest,
                ledger: [
                  { date: new Date().toISOString().slice(0, 10), type: "milestone", entry },
                  ...manifest.ledger,
                ],
              })
            }
          />
          {manifest.ledger.map((l, i) => (
            <div key={`${l.date}-${i}`} className="flex items-start gap-3 rounded-lg border border-border-subtle bg-space-deep/70 p-3">
              <span className="font-mono text-[0.65rem] text-cyan-primary">◈</span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[0.65rem] text-text-muted">
                  {l.date} · {l.type}
                </p>
                <p className="font-jakarta text-sm text-text-primary">{l.entry}</p>
              </div>
              <button
                aria-label="delete entry"
                onClick={() =>
                  setManifest({ ...manifest, ledger: manifest.ledger.filter((_, j) => j !== i) })
                }
                className="font-mono text-text-muted hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </section>
      )}

      {/* ── VOICE (hero + vision) ── */}
      {tab === "voice" && (
        <section className="mt-6 space-y-4">
          {(
            [
              ["hero eyebrow", manifest.hero.eyebrow, (v: string) => setManifest({ ...manifest, hero: { ...manifest.hero, eyebrow: v } })],
              ["hero line", manifest.hero.sub, (v: string) => setManifest({ ...manifest, hero: { ...manifest.hero, sub: v } })],
              ["hero body", manifest.hero.body, (v: string) => setManifest({ ...manifest, hero: { ...manifest.hero, body: v } })],
            ] as Array<[string, string, (v: string) => void]>
          ).map(([label, value, set]) => (
            <label key={label} className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">{label}</span>
              <textarea
                value={value}
                rows={2}
                onChange={(e) => set(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-jakarta text-sm text-text-primary outline-none focus:border-cyan-primary"
              />
            </label>
          ))}
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">vision manifesto</span>
            <textarea
              value={manifest.vision.manifesto}
              rows={6}
              onChange={(e) => setManifest({ ...manifest, vision: { manifesto: e.target.value } })}
              className="mt-1.5 w-full rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-jakarta text-sm text-text-primary outline-none focus:border-cyan-primary"
            />
          </label>
        </section>
      )}

      {/* Commit bar — sticky, thumb-reachable */}
      <div className="sticky bottom-4 mt-8">
        <button
          onClick={() => save(manifest)}
          disabled={busy}
          className="w-full rounded-xl bg-cyan-primary py-3.5 font-jakarta font-bold text-space-black shadow-glow-cyan-strong transition-transform hover:scale-[1.01] disabled:opacity-40"
        >
          {busy ? "committing…" : "Commit to GitHub"}
        </button>
      </div>
    </Bay>
  );
}

function Bay({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100svh] bg-space-black px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">{children}</div>
    </main>
  );
}

function Toggle({
  label,
  on,
  amber = false,
  onClick,
}: {
  label: string;
  on: boolean;
  amber?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
        amber
          ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
          : on
            ? "border-cyan-primary/60 bg-cyan-primary/10 text-cyan-primary"
            : "border-border-subtle text-text-muted"
      }`}
    >
      {label}
    </button>
  );
}

function AddTag({ onAdd }: { onAdd: (tag: string) => void }) {
  const [v, setV] = useState("");
  return (
    <span className="flex items-center gap-1">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim()) {
            onAdd(v.trim());
            setV("");
          }
        }}
        placeholder="+ add"
        className="w-24 rounded-full border border-dashed border-border-subtle bg-transparent px-3 py-1 font-jakarta text-xs text-text-primary outline-none focus:border-cyan-primary"
      />
    </span>
  );
}

function LedgerAdd({ onAdd }: { onAdd: (entry: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim()) {
            onAdd(v.trim());
            setV("");
          }
        }}
        placeholder="new ledger entry…"
        className="flex-1 rounded-lg border border-border-subtle bg-space-black px-3 py-2 font-jakarta text-sm text-text-primary outline-none focus:border-cyan-primary"
      />
      <button
        onClick={() => {
          if (v.trim()) {
            onAdd(v.trim());
            setV("");
          }
        }}
        className="rounded-lg border border-cyan-primary/50 px-4 font-mono text-xs text-cyan-primary hover:bg-cyan-primary/10"
      >
        add
      </button>
    </div>
  );
}
