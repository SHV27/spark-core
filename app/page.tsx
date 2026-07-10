import { getLastEvolved, getManifest, getProjects, relativeTime } from "@/lib/github";
import SparkShell from "@/components/SparkShell";

// Server component: all live data resolves here (manifest revalidate 60,
// repos 3600) and flows down as props. Components contain zero personal copy —
// THE DESIGN LAW. If GitHub is down, getManifest falls back to the bundled
// manifest and getProjects returns [] — the page always renders.
export const revalidate = 60;

export default async function Home() {
  const manifest = await getManifest();
  const projects = await getProjects(manifest);
  const lastEvolved = getLastEvolved(projects, manifest);
  const lastEvolvedText = relativeTime(lastEvolved);

  const bootLines = [
    "> SPARK CORE ONLINE",
    "> SCANNING GITHUB…",
    `> ${projects.length} PROJECT${projects.length === 1 ? "" : "S"} ABSORBED`,
    `> LAST EVOLUTION: ${lastEvolvedText.toUpperCase()}`,
    "> STATUS: SEEKING AI-FIRST TEAMS ✓",
  ];

  return (
    <SparkShell
      manifest={manifest}
      projects={projects}
      lastEvolvedText={lastEvolvedText}
      bootLines={bootLines}
    />
  );
}
