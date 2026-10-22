import { mainStack } from "@/data/skills";
import { SkillIcon } from "./SkillIcon";

/** The main stack as a row of logo chips — compact, for the overview. */
export function MainStackChips() {
  return (
    <ul aria-label="Main stack" className="flex flex-wrap gap-1.5">
      {mainStack.map((item) => (
        <li
          key={item.name}
          title={item.role}
          className="flex items-center gap-1.5 rounded-full border border-rule bg-bg py-1 pr-2.5 pl-2 text-[13px] text-ink"
        >
          <SkillIcon name={item.icon} branded className="h-3.5 w-3.5" />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

/** The main stack as labelled tiles — each with what it does in the stack. */
export function MainStackTiles() {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {mainStack.map((item, i) => (
        <li
          key={item.name}
          className="flex flex-col gap-3 rounded-xl border border-rule bg-bg p-3.5"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-rule bg-surface text-ink">
              <SkillIcon name={item.icon} branded className="h-5 w-5" />
            </span>
            <span className="eyebrow text-ink-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink">{item.name}</p>
            <p className="text-xs text-ink-3">{item.role}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
