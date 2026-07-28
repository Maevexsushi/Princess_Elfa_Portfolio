import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Uppercase micro-label. Replaces the monospace eyebrows, taglines and meta
 * rows the previous design used — in a single-typeface system the label voice
 * comes from case, weight and tracking instead of a second family.
 */
export const labelClass =
  "text-xs font-semibold uppercase tracking-wider";

export function Label({
  as: Tag = "span",
  className,
  children,
}: {
  as?: "span" | "p" | "div" | "dt";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn(labelClass, className)}>{children}</Tag>;
}
