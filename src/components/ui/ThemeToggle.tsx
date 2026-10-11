"use client";

import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * Both icons are always rendered and CSS picks one from `data-theme`, so the
 * server and client agree on the markup whatever theme the visitor has.
 */
export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle colour theme"
      title="Toggle theme"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-bg-raised hover:text-ink",
        className,
      )}
    >
      <Moon className="only-light h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      <Sun className="only-dark h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
