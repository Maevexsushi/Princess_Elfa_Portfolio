import { cn } from "@/lib/cn";
import { labelClass } from "./Label";

/**
 * The eyebrow's colour lives in a solid marker bar, not in the text — so the
 * label itself always inherits the section's full-contrast foreground instead
 * of picking a hue that has to be re-checked against every block colour.
 */
const toneClass = {
  light: { bar: "bg-primary", description: "text-foreground-soft" },
  dark: { bar: "bg-accent", description: "text-on-ink" },
  color: { bar: "bg-ink", description: "text-ink-soft" },
} as const;

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = "light",
  align = "center",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: keyof typeof toneClass;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  const { bar, description: descriptionClass } = toneClass[tone];

  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        centered ? "mx-auto items-center text-center" : "items-start text-left",
      )}
    >
      <span className={cn("flex items-center gap-3", labelClass)}>
        <span aria-hidden className={cn("h-1 w-8 rounded-sm", bar)} />
        {eyebrow}
      </span>
      <h2 id={id} className="text-display-sm font-extrabold leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className={cn("text-lg leading-relaxed", descriptionClass)}>
          {description}
        </p>
      )}
    </div>
  );
}
