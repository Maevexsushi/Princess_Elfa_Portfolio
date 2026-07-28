import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Solid circle holding an icon — the design system's standard iconography
 * treatment. Inside an interactive `Card` it picks up `group-hover:scale-110`
 * automatically.
 */
export type IconTileTone =
  | "white"
  | "muted"
  | "primary"
  | "secondary"
  | "accent"
  | "ink";

const toneClass: Record<IconTileTone, string> = {
  white: "bg-white text-primary-strong",
  muted: "bg-muted text-primary-strong",
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-ink",
  accent: "bg-accent text-ink",
  ink: "bg-ink text-white",
};

const sizeClass = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-16 w-16",
} as const;

export function IconTile({
  tone = "white",
  size = "md",
  className,
  children,
}: {
  tone?: IconTileTone;
  size?: keyof typeof sizeClass;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110",
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
