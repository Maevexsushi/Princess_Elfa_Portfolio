import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * What I'm building right now, with its real progress: one tick per unit of
 * the roadmap (sprints, for Acadify), filled up to where the work has got to.
 */
export function NowPanel() {
  const project = projects.find((p) => p.status === "in-progress" && p.progress);
  if (!project?.progress) return null;
  const { value, total, unit } = project.progress;
  const percent = Math.round((value / total) * 100);

  return (
    <Panel
      title="Now building"
      labelledBy="now-heading"
      action={<StatusBadge project={project} />}
      className="rise"
      style={riseDelay(320)}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Link
          href={`/projects/${project.slug}`}
          className="group flex min-w-0 items-center gap-3.5 sm:w-64 sm:shrink-0"
        >
          <span className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-bg-raised ring-1 ring-rule ring-inset">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="72px"
              className="object-cover object-top grayscale transition-[filter] duration-500 group-hover:grayscale-0"
            />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 font-medium text-ink">
              <span className="link-draw">{project.title}</span>
              <ArrowRight className="h-3.5 w-3.5 text-ink-3" strokeWidth={2} aria-hidden />
            </span>
            <span className="block truncate text-[13px] text-ink-3">{project.tagline}</span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="text-ink-2">
              <span className="font-medium text-ink tabular-nums">{value}</span> of {total} {unit}
            </span>
            <span className="heading text-lg text-ink tabular-nums">{percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-label={`${project.title} roadmap progress`}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={value}
            aria-valuetext={`${value} of ${total} ${unit}`}
            className="flex h-6 gap-[2px]"
          >
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={`flex-1 rounded-[1px] ${i < value ? "bg-ink" : "bg-bg-raised"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
