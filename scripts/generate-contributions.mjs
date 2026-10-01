// Builds src/data/contributions.json from local git history: daily commit counts and per-project totals.
// Most of the work lives in private repos (GitHub orgs, GitLab, Bitbucket) under a work email, so the
// public GitHub graph misses it. Only dates and counts are exported: no messages, hashes or code.
//
// Usage: node scripts/generate-contributions.mjs [root=~/Documents]

import { execFileSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";

const ROOT = process.argv[2] ?? join(homedir(), "Documents");
const AUTHOR = "sahil"; // case-insensitive match on author name/email
const FROM = "2023-01-01"; // professional history shown on the site

// Repo path (relative to ROOT) → label shown on the site, as [RegExp, string] pairs. First match wins;
// unmatched repos are skipped. Kept in a gitignored file because the real repo names are under NDA.
const { default: PROJECTS } = await import("./project-map.local.mjs");

function findRepos(dir, depth = 0, out = []) {
  if (depth > 4) return out;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  if (entries.includes(".git")) out.push(dir);
  for (const e of entries) {
    if (e === "node_modules" || e.startsWith(".")) continue;
    const p = join(dir, e);
    try {
      if (statSync(p).isDirectory()) findRepos(p, depth + 1, out);
    } catch {}
  }
  return out;
}

const seen = new Set(); // the same commit can exist in several clones
const days = {};
const projects = {}; // year → project → commits

for (const repo of findRepos(ROOT)) {
  const rel = relative(ROOT, repo);
  const project = PROJECTS.find(([re]) => re.test(rel))?.[1];
  if (!project) continue;
  const log = execFileSync(
    "git",
    ["-C", repo, "log", "--all", "--no-merges", "-i", `--author=${AUTHOR}`, `--since=${FROM}`, "--format=%H %ad", "--date=short"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  for (const line of log.split("\n").filter(Boolean)) {
    const [hash, date] = line.split(" ");
    if (seen.has(hash)) continue;
    seen.add(hash);
    days[date] = (days[date] ?? 0) + 1;
    const year = date.slice(0, 4);
    projects[year] ??= {};
    projects[year][project] = (projects[year][project] ?? 0) + 1;
  }
}

const sortedDays = Object.fromEntries(Object.entries(days).sort(([a], [b]) => a.localeCompare(b)));
const byYear = Object.fromEntries(
  Object.entries(projects).map(([year, counts]) => [
    year,
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, commits]) => ({ name, commits })),
  ]),
);

writeFileSync(
  new URL("../src/data/contributions.json", import.meta.url),
  JSON.stringify({ days: sortedDays, projects: byYear }, null, 0) + "\n",
);
console.log(`${seen.size} commits on ${Object.keys(days).length} days →`, Object.keys(byYear).sort().join(", "));
