import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A dashboard panel: an optional header row (title, then an action on the
 * right) over a padded body. Every widget on every page is one of these, so
 * the whole site shares one edge, one radius and one rhythm.
 */
export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  labelledBy,
  style,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  labelledBy?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      aria-labelledby={title ? labelledBy : undefined}
      className={cn("panel flex min-w-0 flex-col", className)}
      style={style}
    >
      {title && (
        <header className="flex min-h-12 items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
          <h2 id={labelledBy} className="text-[13px] font-medium text-ink">
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className={cn("flex flex-1 flex-col p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

/** The "View all ↗" link that sits in a panel header. */
export function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-xs font-medium text-ink-3 transition-colors duration-200 hover:text-ink"
    >
      {children}
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-300 ease-out-quint group-hover:-translate-y-px group-hover:translate-x-px"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}

/** Inline stagger for the first-paint entrance. */
export const riseDelay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
