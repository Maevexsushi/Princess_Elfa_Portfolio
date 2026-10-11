"use client";

import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/cn";

export function TableOfContents({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const active = useActiveSection(items.map((i) => i.id));

  return (
    <nav aria-label="On this page" className="flex flex-col gap-4">
      <p className="eyebrow text-ink-3">On this page</p>
      <ol className="flex flex-col border-l border-rule">
        {items.map((item, i) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors duration-300",
                  current
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-3 hover:text-ink",
                )}
              >
                <span className="eyebrow pt-[3px] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
