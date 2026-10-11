import { projects } from "@/data/projects";
import type { Project } from "@/lib/types";

/**
 * Figures the dashboard derives from the content files. Nothing here is typed
 * in by hand: change a project or a role and every chart follows.
 */

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function statusLabel(project: Project) {
  return project.status === "in-progress" ? "In progress" : "Completed";
}

/**
 * "Next.js 16" and "Next.js", or "Tailwind CSS v4" and "Tailwind CSS", are
 * the same tool for the purpose of counting: drop trailing version numbers.
 */
export function normalizeTech(name: string) {
  return name.replace(/\s+v?\d+(\.\d+)*$/i, "").trim();
}

export type TechUsage = { name: string; count: number; projects: string[] };

/** How many projects each technology appears in, most-used first. */
export function techUsage(): TechUsage[] {
  const map = new Map<string, TechUsage>();
  for (const p of projects) {
    for (const raw of new Set(p.technologies.map(normalizeTech))) {
      const entry = map.get(raw) ?? { name: raw, count: 0, projects: [] };
      entry.count += 1;
      entry.projects.push(p.title);
      map.set(raw, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** "YYYY-MM" to a month index, so periods can be laid on one axis. */
export function monthIndex(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

/** The current month as "YYYY-MM" — for the "today" marker on the timeline. */
export function currentYm(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}
