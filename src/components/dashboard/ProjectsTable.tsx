import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { normalizeTech } from "@/lib/insights";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * Projects as a table. Each row is one click target — the title link is
 * stretched over the row — while the source/live links stay separately
 * clickable above it.
 */
export function ProjectsTable({
  projects,
  stackLimit = 3,
  compact = false,
}: {
  projects: Project[];
  stackLimit?: number;
  /** For narrow placements: drop the impact and links columns (the row
      itself still opens the case study). */
  compact?: boolean;
}) {
  const showImpact = !compact;
  return (
    <div className="-m-4 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
        <thead>
          <tr className="eyebrow border-b border-rule text-ink-3">
            <th scope="col" className="px-4 py-2.5 font-normal">Project</th>
            <th scope="col" className="px-4 py-2.5 font-normal">Status</th>
            <th scope="col" className="hidden px-4 py-2.5 font-normal md:table-cell">Stack</th>
            {showImpact && (
              <th scope="col" className="hidden px-4 py-2.5 font-normal xl:table-cell">Impact</th>
            )}
            {!compact && (
              <th scope="col" className="px-4 py-2.5 text-right font-normal">
                <span className="sr-only">Links</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const stack = [...new Set(p.technologies.map(normalizeTech))];
            const extra = stack.length - stackLimit;
            const hasRepo = p.githubUrl && p.githubUrl !== "#";
            const hasLive = p.liveUrl && p.liveUrl !== "#";
            return (
              <tr
                key={p.slug}
                className="group relative border-b border-rule transition-colors duration-150 last:border-b-0 hover:bg-bg-raised/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md bg-bg-raised ring-1 ring-rule ring-inset">
                      <ViewTransition name={`project-${p.slug}`} share="project-image">
                        <span className="absolute inset-0">
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover object-top grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                          />
                        </span>
                      </ViewTransition>
                    </span>
                    <span className="min-w-0">
                      {/* Stretched over the whole row by its ::after */}
                      <Link
                        href={`/projects/${p.slug}`}
                        className="block truncate font-medium text-ink after:absolute after:inset-0"
                      >
                        {p.title}
                      </Link>
                      <span className="block max-w-[15rem] truncate text-ink-3">{p.tagline}</span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge project={p} />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className="flex gap-1">
                    {stack.slice(0, stackLimit).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-rule bg-bg px-1.5 py-0.5 text-xs whitespace-nowrap text-ink-2"
                      >
                        {t}
                      </span>
                    ))}
                    {extra > 0 && (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-xs text-ink-3"
                        title={stack.slice(stackLimit).join(", ")}
                      >
                        +{extra}
                      </span>
                    )}
                  </span>
                </td>
                {showImpact && (
                  <td className="hidden max-w-[15rem] px-4 py-3 text-ink-2 xl:table-cell">
                    <span className="line-clamp-2">{p.impact ?? "—"}</span>
                  </td>
                )}
                {!compact && (
                  <td className="px-4 py-3">
                    <span className="relative z-10 flex items-center justify-end gap-1">
                      {hasRepo && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.title} source code`}
                          className="rounded-md px-1.5 py-1 text-xs text-ink-3 transition-colors hover:bg-bg-raised hover:text-ink"
                        >
                          Source
                        </a>
                      )}
                      {hasLive && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.title} live site`}
                          className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-xs text-ink-3 transition-colors hover:bg-bg-raised hover:text-ink"
                        >
                          Live
                          <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden />
                        </a>
                      )}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
