"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { navLinks } from "@/data/nav";
import { toggleSidebar } from "@/lib/theme";
import { openAskAI } from "@/components/ui/AskAI";

/**
 * Keyboard navigation, in the style of the tools developers live in:
 * G then O / P / E / S / U / C jumps to a page, G then A opens Ask AI, and
 * [ folds the sidebar.
 * (⌘K and / belong to the command palette.)
 */
export function Shortcuts() {
  const router = useRouter();

  useEffect(() => {
    let pendingG = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.closest("input, textarea, select, dialog[open]")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (pendingG && Date.now() - pendingG < 1200) {
        pendingG = 0;
        if (key === "a") {
          e.preventDefault();
          openAskAI();
          return;
        }
        const link = navLinks.find((l) => l.key === key);
        if (link) {
          e.preventDefault();
          router.push(link.href);
        }
        return;
      }
      if (key === "g") {
        pendingG = Date.now();
      } else if (e.key === "[" && window.matchMedia("(min-width: 1024px)").matches) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
