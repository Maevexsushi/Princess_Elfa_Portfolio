import { cn } from "@/lib/cn";

/**
 * Button styling as a class factory rather than a component: call sites mix
 * `<Link>`, `<a download>` and `<button type="submit">`, and a function keeps
 * the variants in one place without polymorphic-component gymnastics.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-ink text-bg hover:bg-ink/80",
  secondary:
    "border border-rule-strong text-ink hover:border-ink hover:bg-bg-raised",
  ghost: "text-ink-2 hover:bg-bg-raised hover:text-ink",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-[15px]",
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
    "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,transform] duration-300 ease-out-quint active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-60",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}
