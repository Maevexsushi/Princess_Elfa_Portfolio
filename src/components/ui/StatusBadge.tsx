import type { Project } from "@/lib/types";
import { statusLabel } from "@/lib/insights";
import { cn } from "@/lib/cn";

/** Solid pulsing dot for work under way, a hollow ring for finished work. */
export function StatusBadge({ project, className }: { project: Project; className?: string }) {
  const live = project.status === "in-progress";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        live ? "border-ink/80 bg-ink text-bg" : "border-rule-strong text-ink-2",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative h-1.5 w-1.5 rounded-full",
          live ? "pulse-dot bg-bg text-bg" : "border border-ink-3",
        )}
      />
      {statusLabel(project)}
    </span>
  );
}
