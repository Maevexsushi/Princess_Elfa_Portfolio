import { cn } from "@/lib/cn";

/**
 * Button styling as a class factory rather than a component.
 *
 * Call sites are a mix of `<Link>`, `<a download>` and `<button type="submit">`,
 * so a function avoids polymorphic-component gymnastics while still keeping the
 * variants in one place.
 *
 * Feedback is scale + colour, never depth: `hover:scale-105` with a 200ms
 * transition, and no shadow anywhere.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  /** Solid white — for use on the blue, amber and ink blocks. */
  | "inverse"
  /** White outline that fills on hover — for use on the blue and ink blocks. */
  | "outlineInverse";

export type ButtonSize = "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-strong",
  secondary: "bg-muted text-foreground hover:bg-muted-strong",
  outline:
    "border-4 border-primary text-primary hover:bg-primary hover:text-white",
  inverse: "bg-white text-primary-strong hover:bg-primary-soft",
  outlineInverse:
    "border-4 border-white text-white hover:bg-white hover:text-primary-strong",
};

const sizeClass: Record<ButtonSize, string> = {
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "lg",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 hover:scale-105 active:scale-100",
    "disabled:pointer-events-none disabled:opacity-60",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}
