"use client";

import { ViewTransition, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { normalizeTech } from "@/lib/insights";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProjectsTable } from "./ProjectsTable";

type StatusFilter = "all" | "in-progress" | "completed";
type View = "table" | "grid";

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

function matches(p: Project, terms: string[]) {
  const haystack = `${p.title} ${p.tagline} ${p.description} ${p.technologies.join(" ")}`.toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

/** Search across titles, descriptions and stacks; filter by status; pick a view. */
export function ProjectsExplorer() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [view, setView] = useState<View>("table");

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

        <div className="flex items-center justify-between gap-2">
          <div role="group" aria-label="Filter by status" className="flex rounded-lg bg-bg p-0.5">
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

          <div role="group" aria-label="View" className="flex rounded-lg bg-bg p-0.5">
            {(
              [
                { value: "table", label: "Table", Icon: List },
                { value: "grid", label: "Grid", Icon: LayoutGrid },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                aria-label={`${label} view`}
                title={`${label} view`}
                onClick={() => setView(value)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  view === value ? "bg-surface text-ink ring-1 ring-rule" : "text-ink-3 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            ))}
          </div>
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
      ) : view === "table" ? (
        <section aria-label="Projects" className="panel rise p-4" style={{ "--d": "120ms" } as React.CSSProperties}>
          <ProjectsTable projects={results} stackLimit={4} />
        </section>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((p, i) => (
            <li key={p.slug} className="rise" style={{ "--d": `${80 + i * 50}ms` } as React.CSSProperties}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const stack = [...new Set(p.technologies.map(normalizeTech))];
  return (
    <article className="panel group relative flex h-full flex-col overflow-hidden transition-colors hover:border-rule-strong">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-rule bg-bg-raised">
        <ViewTransition name={`project-${p.slug}`} share="project-image">
          <div className="absolute inset-0">
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover object-top grayscale transition-[filter,transform] duration-700 ease-out-quint group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          </div>
        </ViewTransition>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-medium text-ink">
              <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0">
                {p.title}
              </Link>
            </h2>
            <p className="truncate text-[13px] text-ink-3">{p.tagline}</p>
          </div>
          <StatusBadge project={p} />
        </div>
        <p className="line-clamp-3 text-[13px] leading-relaxed text-ink-2">{p.description}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {stack.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md border border-rule bg-bg px-1.5 py-0.5 text-xs text-ink-2">
              {t}
            </span>
          ))}
          {stack.length > 4 && (
            <span className="px-1.5 py-0.5 text-xs text-ink-3">+{stack.length - 4}</span>
          )}
        </div>
      </div>
    </article>
  );
}
