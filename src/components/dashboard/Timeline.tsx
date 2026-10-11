import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { monthIndex } from "@/lib/insights";

type Row = {
  key: string;
  label: string;
  sub: string;
  period: string;
  start: string;
  end: string;
  kind: "work" | "education";
};

/**
 * Work and study on one axis, as a Gantt chart. The window opens at the
 * earliest period that overlaps the degree, so the overlap between studying,
 * freelancing and interning — the real story here — is what fills the width.
 */
export function Timeline() {
  const degree = education[0];
  const rows: Row[] = [
    {
      key: degree.institution,
      label: "BS Information Technology",
      sub: "Bulacan State University",
      period: degree.period,
      start: degree.start,
      end: degree.end,
      kind: "education",
    },
    ...experience.map<Row>((e) => ({
      key: `${e.role}-${e.start}`,
      label: e.role,
      sub: e.organization.replace(/\s*\(.*\)$/, "").replace("Department of Environment and Natural Resources", "DENR"),
      period: e.period,
      start: e.start,
      end: e.end,
      kind: "work",
    })),
  ];

  const firstYear = Math.min(...rows.map((r) => Number(r.start.slice(0, 4))));
  const lastYear = Math.max(...rows.map((r) => Number(r.end.slice(0, 4)))) + 1;
  const from = firstYear * 12;
  const span = lastYear * 12 - from;
  const years = Array.from({ length: lastYear - firstYear }, (_, i) => firstYear + i);
  const pct = (ym: string) => ((monthIndex(ym) - from) / span) * 100;

  return (
    <figure className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <div className="min-w-[36rem]">
          {/* Year axis */}
          <div className="grid grid-cols-[11rem_1fr] gap-4">
            <span />
            <div className="eyebrow relative h-5 text-ink-3">
              {years.map((y) => (
                <span
                  key={y}
                  className="absolute top-0 -translate-x-px border-l border-rule pl-1.5"
                  style={{ left: `${((y * 12 - from) / span) * 100}%` }}
                >
                  {y}
                </span>
              ))}
            </div>
          </div>

          <ol className="mt-1 flex flex-col">
            {rows.map((row, i) => {
              const left = pct(row.start);
              const width = Math.max(pct(row.end) - left, 1.5);
              // Too short to hold its own label: print it beside the bar.
              const outside = width < 22;
              return (
                <li key={row.key} className="grid grid-cols-[11rem_1fr] items-center gap-4 border-t border-rule py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{row.label}</p>
                    <p className="truncate text-xs text-ink-3">{row.sub}</p>
                  </div>
                  <div className="relative h-7">
                    {/* Year gridlines behind the bar */}
                    {years.map((y) => (
                      <span
                        key={y}
                        aria-hidden
                        className="absolute inset-y-0 border-l border-dashed border-rule"
                        style={{ left: `${((y * 12 - from) / span) * 100}%` }}
                      />
                    ))}
                    <span
                      className={`grow absolute inset-y-1 flex items-center overflow-hidden rounded-md px-2 ${
                        row.kind === "work"
                          ? "bg-ink text-bg"
                          : "border border-ink/70 bg-[repeating-linear-gradient(135deg,var(--bg-raised)_0_6px,transparent_6px_12px)] text-ink"
                      }`}
                      style={{ left: `${left}%`, width: `${width}%`, "--d": `${150 + i * 120}ms` } as React.CSSProperties}
                      title={`${row.label}: ${row.period}`}
                    >
                      {!outside && <span className="eyebrow truncate text-[10px]">{row.period}</span>}
                    </span>
                    {outside && (
                      <span
                        className="eyebrow absolute inset-y-0 flex items-center text-[10px] whitespace-nowrap text-ink-3"
                        style={
                          left + width > 70
                            ? { right: `${100 - left + 1}%` }
                            : { left: `${left + width + 1}%` }
                        }
                      >
                        {row.period}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-3">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-5 rounded-sm bg-ink" /> Work
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-5 rounded-sm border border-ink/70 bg-[repeating-linear-gradient(135deg,var(--bg-raised)_0_3px,transparent_3px_6px)]"
          />
          Education
        </span>
        <span className="ml-auto">School years are drawn June to June.</span>
      </figcaption>
    </figure>
  );
}
