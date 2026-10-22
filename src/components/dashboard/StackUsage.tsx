import { projects } from "@/data/projects";
import { techUsage } from "@/lib/insights";
import { SkillIcon, techIconKey } from "@/components/ui/SkillIcon";

/**
 * How many of my projects each technology appears in — counted from the
 * projects list, so it can't drift from the work it describes.
 */
export function StackUsage({ limit, withIcons = false }: { limit?: number; withIcons?: boolean }) {
  const usage = techUsage();
  const rows = limit ? usage.slice(0, limit) : usage;
  const total = projects.length;

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ul className="flex flex-col gap-2.5">
        {rows.map((t, i) => (
          <li
            key={t.name}
            className={`grid items-center gap-3 text-[13px] ${
              withIcons ? "grid-cols-[minmax(0,10rem)_1fr_2.25rem]" : "grid-cols-[minmax(0,8.5rem)_1fr_2.25rem]"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2 text-ink" title={t.name}>
              {withIcons && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {techIconKey(t.name) && (
                    <SkillIcon name={techIconKey(t.name)!} branded className="h-3.5 w-3.5" />
                  )}
                </span>
              )}
              <span className="truncate">{t.name}</span>
            </span>
            <span
              className="relative h-2 overflow-hidden rounded-full bg-bg-raised"
              title={`Used in: ${t.projects.join(", ")}`}
            >
              <span
                className="grow absolute inset-y-0 left-0 rounded-full bg-ink"
                style={
                  {
                    width: `${(t.count / total) * 100}%`,
                    "--d": `${200 + i * 40}ms`,
                  } as React.CSSProperties
                }
              />
            </span>
            <span className="text-right text-ink-3 tabular-nums">
              {t.count}/{total}
            </span>
          </li>
        ))}
      </ul>
      <p className="eyebrow mt-auto pt-2 text-ink-3">
        {usage.length} technologies across {total} projects
      </p>
    </div>
  );
}
