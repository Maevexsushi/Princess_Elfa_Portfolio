import { cn } from "@/lib/cn";

/**
 * List with solid square markers. Previously implemented twice — once in the
 * experience timeline and again inside the case-study page.
 */
const markerClass = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  white: "bg-white",
} as const;

export function BulletList({
  items,
  marker = "primary",
  className,
  itemClassName,
}: {
  items: string[];
  marker?: keyof typeof markerClass;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => (
        <li key={item} className={cn("flex gap-3 leading-relaxed", itemClassName)}>
          <span
            aria-hidden
            className={cn("mt-2 h-2 w-2 shrink-0 rounded-sm", markerClass[marker])}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
