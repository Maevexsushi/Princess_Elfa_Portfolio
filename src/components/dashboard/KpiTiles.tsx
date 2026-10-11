import { projects } from "@/data/projects";
import { stats } from "@/data/stats";
import { riseDelay } from "@/components/ui/Panel";

/**
 * Four headline figures. The first is counted from the projects list; the
 * rest come from stats.ts, each with the role or project it's sourced from.
 */
export function KpiTiles() {
  const live = projects.filter((p) => p.status === "in-progress").length;
  const tiles = [
    {
      label: "Projects",
      value: String(projects.length),
      source: live ? `${live} in progress` : "All completed",
    },
    ...stats.slice(0, 3).map((s) => ({ label: s.label, value: s.value, source: s.source })),
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {tiles.map((tile, i) => (
        <div
          key={tile.label}
          className="panel rise flex flex-col gap-1 p-4"
          style={riseDelay(120 + i * 50)}
        >
          {/* Two lines reserved, so every figure sits on the same baseline */}
          <dt className="order-1 min-h-[2.5em] text-[13px] leading-snug text-ink-2">{tile.label}</dt>
          <dd className="heading order-2 mt-2 text-[1.75rem] leading-none text-ink tabular-nums">
            {tile.value}
          </dd>
          <dd className="eyebrow order-3 mt-1.5 text-ink-3">{tile.source}</dd>
        </div>
      ))}
    </dl>
  );
}
