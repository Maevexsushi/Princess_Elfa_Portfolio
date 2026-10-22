"use client";

import { ViewTransition, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, TrendingUp, X } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { normalizeTech } from "@/lib/insights";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkillIcon, techIconKey } from "@/components/ui/SkillIcon";

type StatusFilter = "all" | "in-progress" | "completed";

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

function matches(p: Project, terms: string[]) {
  const haystack = `${p.title} ${p.tagline} ${p.description} ${p.technologies.join(" ")}`.toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

/** Search across titles, descriptions and stacks, and filter by status. */
export function ProjectsExplorer() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const counts = useMemo(
    () => ({
      all: projects.length,
      "in-progress": projects.filter((p) => p.status === "in-progress").length,
      completed: projects.filter((p) => p.status !== "in-progress").length,
    }),
    [],
  );

  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return projects.filter((p) => {
      if (status === "in-progress" && p.status !== "in-progress") return false;
      if (status === "completed" && p.status === "in-progress") return false;
      return matches(p, terms);
    });
  }, [query, status]);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="panel rise flex flex-col gap-3 p-2 sm:flex-row sm:items-center" style={{ "--d": "60ms" } as React.CSSProperties}>
        <label className="relative flex flex-1 items-center">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or technology — try “Supabase”"
            className="h-9 w-full rounded-lg bg-bg pr-9 pl-9 text-[13px] text-ink placeholder:text-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md text-ink-3 hover:bg-bg-raised hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </button>
          )}
        </label>

        <div role="group" aria-label="Filter by status" className="flex w-fit rounded-lg bg-bg p-0.5">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={status === f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] whitespace-nowrap transition-colors",
                status === f.value ? "bg-surface font-medium text-ink ring-1 ring-rule" : "text-ink-3 hover:text-ink",
              )}
            >
              {f.label}
              <span className="eyebrow text-ink-3 tabular-nums">{counts[f.value]}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"} shown
      </p>

      {results.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-medium text-ink">No projects match.</p>
          <p className="text-[13px] text-ink-3">Try another technology, or clear the filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
            className="mt-3 rounded-full border border-rule-strong px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-bg-raised"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 lg:gap-4">
          {results.map((p, i) => (
            <li key={p.slug} className="rise" style={{ "--d": `${80 + i * 60}ms` } as React.CSSProperties}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * One project as a card. The title link is stretched over the whole card, so
 * anywhere opens the case study; the source and live links sit above it.
 */
function ProjectCard({ project: p }: { project: Project }) {
  const stack = [...new Set(p.technologies.map(normalizeTech))];
  const hasRepo = p.githubUrl && p.githubUrl !== "#";
  const hasLive = p.liveUrl && p.liveUrl !== "#";
  const external = "relative z-10 inline-flex items-center gap-1 text-ink-3 transition-colors hover:text-ink";

  return (
    <article className="panel group relative flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-300 ease-out-quint hover:-translate-y-0.5 hover:border-rule-strong">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-rule bg-bg-raised">
        <ViewTransition name={`project-${p.slug}`} share="project-image">
          <div className="absolute inset-0">
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top grayscale transition-[filter,transform] duration-700 ease-out-quint group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          </div>
        </ViewTransition>
        {/* A backing so the badge reads over any screenshot */}
        <span className="absolute top-3 left-3 rounded-full bg-surface/90 backdrop-blur-sm">
          <StatusBadge project={p} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div>
          <p className="eyebrow text-ink-3">{p.tagline}</p>
          <h2 className="heading mt-1.5 text-xl text-ink">
            <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0">
              {p.title}
            </Link>
          </h2>
        </div>

        <p className="line-clamp-3 text-[13px] leading-relaxed text-ink-2">{p.description}</p>

        {p.impact && (
          <p className="flex items-start gap-2 text-[13px] font-medium text-ink">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={2} aria-hidden />
            {p.impact}
          </p>
        )}

        <ul aria-label="Stack" className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {stack.slice(0, 5).map((t) => {
            const icon = techIconKey(t);
            return (
              <li
                key={t}
                className="flex items-center gap-1.5 rounded-md border border-rule bg-bg px-2 py-0.5 text-xs text-ink-2"
              >
                {icon && <SkillIcon name={icon} branded className="h-3 w-3" />}
                {t}
              </li>
            );
          })}
          {stack.length > 5 && (
            <li className="px-1 py-0.5 text-xs text-ink-3" title={stack.slice(5).join(", ")}>
              +{stack.length - 5}
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-rule pt-3.5 text-[13px] font-medium">
          <span className="inline-flex items-center gap-1.5 text-ink">
            Case study
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
          </span>
          <span className="flex items-center gap-4">
            {hasRepo && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={external} aria-label={`${p.title} source code`}>
                Source
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </a>
            )}
            {hasLive && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={external} aria-label={`${p.title} live site`}>
                Live
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
