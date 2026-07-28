import { cn } from "@/lib/cn";
import { labelClass } from "./Label";

/** Squared-off block, not a pill — pills are reserved for status tags. */
const toneClass = {
  /** On a white surface. */
  onLight: "bg-muted text-foreground-soft",
  /** On a gray-100 block, where a gray-100 badge would disappear. */
  onMuted: "bg-background text-foreground-soft",
  onDark: "bg-ink-faint text-on-ink",
} as const;

export function TechBadge({
  label,
  tone = "onLight",
}: {
  label: string;
  tone?: keyof typeof toneClass;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1.5",
        labelClass,
        toneClass[tone],
      )}
    >
      {label}
    </span>
  );
}
