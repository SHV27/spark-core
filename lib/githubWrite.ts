import "server-only";
import { CONTENT_REPO, OWNER } from "./github";
import { Manifest, isManifest } from "./types";

const API = "https://api.github.com";

function writeHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not configured");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/** Contents-API commit: get current sha (if any) → PUT new content. */
export async function commitFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const url = `${API}/repos/${OWNER}/${CONTENT_REPO}/contents/${path}`;

  let sha: string | undefined;
  const current = await fetch(url, { headers: writeHeaders(), cache: "no-store" });
  if (current.ok) {
    sha = ((await current.json()) as { sha: string }).sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: writeHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub commit failed (${res.status}): ${await res.text()}`);
  }
}

/** Latest committed manifest, bypassing all caches — writers must never
 *  read a stale copy or they would clobber newer commits. */
export async function readManifestFresh(): Promise<Manifest> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${CONTENT_REPO}/contents/content/manifest.json`,
    {
      headers: { ...writeHeaders(), Accept: "application/vnd.github.raw+json" },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`manifest read failed (${res.status})`);
  const parsed: unknown = JSON.parse(await res.text());
  if (!isManifest(parsed)) throw new Error("manifest failed schema validation");
  return parsed;
}

export async function commitManifest(m: Manifest, message: string): Promise<void> {
  if (!isManifest(m)) throw new Error("refusing to commit invalid manifest");
  await commitFile("content/manifest.json", JSON.stringify(m, null, 2) + "\n", message);
}
