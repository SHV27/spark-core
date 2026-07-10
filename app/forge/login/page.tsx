"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgeLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/forge/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/forge");
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "access denied");
      }
    } catch {
      setError("network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-space-black px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border-subtle bg-space-deep/80 p-8 shadow-glow-cyan"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cyan-primary">
          ◈ Spark Core
        </p>
        <h1 className="mt-2 font-syne text-2xl font-bold text-text-primary">
          The Forge
        </h1>
        <p className="mt-1 font-mono text-xs text-text-muted">
          maintenance bay — authorized personnel only
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="access code"
          autoFocus
          className="mt-6 w-full rounded-lg border border-border-subtle bg-space-black px-4 py-3 font-mono text-sm text-text-primary outline-none transition-colors focus:border-cyan-primary"
        />
        {error && (
          <p className="mt-3 font-mono text-xs text-red-400">✗ {error}</p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full rounded-lg bg-cyan-primary py-3 font-jakarta font-semibold text-space-black transition-all hover:shadow-glow-cyan-strong disabled:opacity-40"
        >
          {busy ? "verifying…" : "Enter the Forge"}
        </button>
      </form>
    </main>
  );
}
