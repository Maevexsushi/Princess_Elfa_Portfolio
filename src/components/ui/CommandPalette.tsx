"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  FileDown,
  Hash,
  Moon,
  PanelLeft,
  Search,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { navLinks } from "@/data/nav";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { socialLinks } from "@/data/social";
import { toggleSidebar, toggleTheme } from "@/lib/theme";
import { openAskAI } from "./AskAI";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";
import { ShortcutHint } from "./ShortcutHint";

export const PALETTE_EVENT = "app:palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(PALETTE_EVENT));
}

type Command = {
  id: string;
  group: "Go to" | "Projects" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  keywords?: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  run: () => void;
};

/**
 * ⌘K / Ctrl+K (or "/") opens a searchable list of everything the site can do.
 *
 * Built on a native <dialog> opened with showModal(), which provides the
 * focus trap, the inert background, Escape-to-close and the top layer for
 * free. The input and list follow the ARIA combobox pattern: focus stays in
 * the input and the highlighted option is announced via aria-activedescendant.
 */
export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  const commands = useMemo<Command[]>(() => {
    const external = (href: string) => () =>
      window.open(href, "_blank", "noopener,noreferrer");
    const github = socialLinks.find((l) => l.icon === "github");
    const linkedin = socialLinks.find((l) => l.icon === "linkedin");

    return [
      ...navLinks.map<Command>((link) => ({
        id: `nav-${link.key}`,
        group: "Go to",
        label: link.label,
        hint: `G ${link.key.toUpperCase()}`,
        icon: Hash,
        run: () => router.push(link.href),
      })),
      ...projects.map<Command>((p) => ({
        id: `project-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.tagline,
        keywords: p.technologies.join(" "),
        icon: ArrowUpRight,
        run: () => router.push(`/projects/${p.slug}`),
      })),
      {
        id: "ask-ai",
        group: "Actions",
        label: "Ask AI about Princess",
        hint: "G A",
        keywords: "chat assistant question bot",
        icon: Sparkles,
        run: openAskAI,
      },
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: siteConfig.email,
        keywords: "contact mail",
        icon: Copy,
        run: () => copyText(siteConfig.email, "Email address copied"),
      },
      {
        id: "resume",
        group: "Actions",
        label: "Download résumé",
        hint: "PDF",
        keywords: "resume cv",
        icon: FileDown,
        run: () => {
          const a = document.createElement("a");
          a.href = siteConfig.resumeUrl;
          a.download = siteConfig.resumeFileName;
          a.click();
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        keywords: "dark mode appearance",
        icon: Moon,
        run: toggleTheme,
      },
      {
        id: "sidebar",
        group: "Actions",
        label: "Fold / unfold the sidebar",
        hint: "[",
        keywords: "collapse expand menu",
        icon: PanelLeft,
        run: toggleSidebar,
      },
      ...(github
        ? [
            {
              id: "github",
              group: "Elsewhere" as const,
              label: "GitHub",
              hint: github.href.replace("https://", ""),
              icon: FaGithub,
              run: external(github.href),
            },
          ]
        : []),
      ...(linkedin
        ? [
            {
              id: "linkedin",
              group: "Elsewhere" as const,
              label: "LinkedIn",
              icon: FaLinkedin,
              run: external(linkedin.href),
            },
          ]
        : []),
    ];
  }, [router]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return commands;
    return commands.filter((c) => {
      const haystack =
        `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [commands, query]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActiveIndex(0);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, open);
    };
  }, [open, close]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function run(command: Command | undefined) {
    if (!command) return;
    close();
    command.run();
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(results.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[activeIndex]);
    }
  }

  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command menu"
      className="palette m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl border border-rule-strong bg-surface p-0 text-ink"
      onClick={(e) => {
        // A click on the dialog element itself is a click on the backdrop.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex items-center gap-3 border-b border-rule px-4">
        <Search className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={2} aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Search pages, projects, actions…"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results.length ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full bg-transparent text-[15px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <kbd className="eyebrow hidden rounded border border-rule px-1.5 py-0.5 text-ink-3 sm:block">
          Esc
        </kbd>
      </div>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label="Commands"
        className="max-h-[min(24rem,60vh)] overflow-y-auto p-2"
      >
        {results.length === 0 && (
          <li className="px-3 py-10 text-center text-sm text-ink-3">
            Nothing matches &ldquo;{query}&rdquo;.
          </li>
        )}
        {results.map((command, index) => {
          const showGroup = index === 0 || results[index - 1].group !== command.group;
          const active = index === activeIndex;
          const Icon = command.icon;
          return (
            <li key={command.id} role="presentation">
              {showGroup && (
                <p aria-hidden className="eyebrow px-3 pt-3 pb-1.5 text-ink-3">
                  {command.group}
                </p>
              )}
              <div
                id={optionId(index)}
                role="option"
                aria-selected={active}
                data-index={index}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => run(command)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-100",
                  active ? "bg-bg-raised text-ink" : "text-ink-2",
                )}
              >
                <Icon
                  className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-ink-3")}
                  strokeWidth={2}
                />
                <span className="font-medium">{command.label}</span>
                {command.hint && (
                  <span className="min-w-0 truncate text-ink-3">{command.hint}</span>
                )}
                {active && (
                  <CornerDownLeft
                    className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-3"
                    strokeWidth={2}
                    aria-hidden
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="eyebrow flex items-center gap-4 border-t border-rule px-4 py-2.5 text-ink-3">
        <span>↑↓ Navigate</span>
        <span>↵ Open</span>
        <span className="ml-auto hidden items-center gap-1 sm:flex">
          <ShortcutHint /> to toggle
        </span>
      </div>
    </dialog>
  );
}
