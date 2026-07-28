/**
 * Join class names, dropping anything falsy.
 *
 * Deliberately tiny: every variant set in this design system is a closed
 * lookup table, so there are no conflicting utilities to resolve and no need
 * for clsx/tailwind-merge.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
