import { cn } from "@/lib/cn";
import type { ProjectStatus } from "@/lib/types";

const statusLabel: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
};

/** Rounded pill — the shape the design system reserves for status tags. */
export function StatusPill({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink",
        className,
      )}
    >
      <span aria-hidden className="h-2 w-2 rounded-full bg-ink" />
      {statusLabel[status]}
    </span>
  );
}
