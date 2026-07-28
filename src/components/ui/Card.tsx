import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * "Colour block" card: a solid panel with no border and no shadow. Edges are
 * defined purely by the change in background colour against the section it
 * sits in.
 *
 * `interactive` adds the group + scale treatment, so icons inside can react
 * with `group-hover:scale-110` (see `IconTile`).
 */
export type CardTone =
  | "white"
  | "muted"
  | "primary"
  | "secondary"
  | "accent"
  | "ink";

const toneClass: Record<CardTone, string> = {
  white: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  primary: "bg-primary-soft text-foreground",
  secondary: "bg-secondary-soft text-foreground",
  accent: "bg-accent-soft text-foreground",
  ink: "bg-ink-soft text-white",
};

/** Hover intensifies the block one step up the same ramp. */
const hoverToneClass: Record<CardTone, string> = {
  white: "hover:bg-muted",
  muted: "hover:bg-muted-strong",
  primary: "hover:bg-blue-100",
  secondary: "hover:bg-emerald-100",
  accent: "hover:bg-amber-100",
  ink: "hover:bg-ink-faint",
};

export function Card({
  as: Tag = "div",
  tone = "white",
  padding = "md",
  interactive = false,
  className,
  children,
}: {
  as?: "div" | "article" | "li";
  tone?: CardTone;
  padding?: "none" | "md" | "lg";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "rounded-lg",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        toneClass[tone],
        interactive &&
          cn(
            "group transition-all duration-200 hover:scale-[1.02]",
            hoverToneClass[tone],
          ),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
