"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHydrated();

  const current = theme === "system" ? resolvedTheme : theme;
  const isDark = current === "dark";

  // Until hydrated, the resolved theme is unknown on the server, so keep the
  // label stable to avoid a hydration mismatch.
  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Toggle color theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5" aria-hidden />
        ) : (
          <Moon className="h-5 w-5" aria-hidden />
        )
      ) : (
        <Sun className="h-5 w-5 opacity-0" aria-hidden />
      )}
    </button>
  );
}
