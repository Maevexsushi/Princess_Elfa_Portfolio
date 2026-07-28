import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Full-bleed colour block.
 *
 * Colour — not lines or shadows — is what separates one part of the page from
 * the next, so every section is a solid block and the page reads as a sequence
 * of flat panels. The rhythm lives at the call sites, which means re-ordering
 * the poster is a one-word change.
 *
 * `data-tone` is also what lets `globals.css` flip the focus outline to white
 * on the inverted blocks without any per-component work.
 */
export type SectionTone =
  | "white"
  | "muted"
  | "primary"
  | "secondary"
  | "accent"
  | "ink";

/** Emerald and amber only clear WCAG AA against dark ink, never white. */
const toneClass: Record<SectionTone, string> = {
  white: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  primary: "bg-primary-strong text-white",
  secondary: "bg-secondary text-foreground",
  accent: "bg-accent text-foreground",
  ink: "bg-ink text-white",
};

export function Section({
  id,
  tone = "white",
  width = "wide",
  innerGap = "gap-14",
  children,
  className,
  innerClassName,
  decoration,
  labelledBy,
}: {
  id?: string;
  tone?: SectionTone;
  /** `narrow` centres content at max-w-4xl — long-form reading measure. */
  width?: "wide" | "narrow";
  /** Vertical rhythm between direct children. */
  innerGap?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Absolutely-positioned flat shapes rendered behind the content. */
  decoration?: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cn(
        "relative overflow-hidden scroll-mt-20 py-20 sm:py-28",
        toneClass[tone],
        className,
      )}
    >
      {decoration}
      <div className="container-page relative">
        <div
          className={cn(
            "flex flex-col",
            innerGap,
            width === "narrow" && "mx-auto w-full max-w-4xl",
            innerClassName,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
