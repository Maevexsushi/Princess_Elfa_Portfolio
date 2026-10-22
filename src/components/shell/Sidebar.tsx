"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileDown, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { navLinks, isActive } from "@/data/nav";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { toggleSidebar } from "@/lib/theme";
import { cn } from "@/lib/cn";
import { openCommandPalette } from "@/components/ui/CommandPalette";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ShortcutHint } from "@/components/ui/ShortcutHint";
import { LocalTime } from "@/components/ui/LocalTime";
import { NavIcon } from "./NavIcon";

const iconButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 hover:bg-bg-raised hover:text-ink";

/**
 * The desktop sidebar. Folds to an icon rail with `[` or its toggle; the
 * folded state is an attribute on <html> (see lib/theme.ts), so every
 * `collapsed:` style switches at once and the choice survives a reload
 * without a flash.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-w)] flex-col border-r border-rule bg-surface transition-[width] duration-300 ease-out-quint lg:flex"
    >
      {/* Identity */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-rule px-3 collapsed:justify-center collapsed:px-0">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, overview`}
          className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-bg-raised"
        >
          <Image
            src="/profilepic.jpg"
            alt=""
            fill
            sizes="32px"
            className="object-cover object-[50%_25%] grayscale"
          />
        </Link>
        <div className="min-w-0 flex-1 collapsed:hidden">
          <p className="truncate text-[13px] font-semibold text-ink">{siteConfig.shortName}</p>
          <p className="truncate text-xs text-ink-3">Portfolio</p>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          title="Collapse sidebar  [ "
          className={cn(iconButton, "collapsed:hidden")}
        >
          <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-4 collapsed:px-2">
        <button
          type="button"
          onClick={openCommandPalette}
          title="Search"
          className="flex h-9 items-center gap-2 rounded-lg border border-rule bg-bg px-2.5 text-[13px] text-ink-3 transition-colors duration-200 hover:border-rule-strong hover:text-ink collapsed:justify-center collapsed:px-0"
        >
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="flex-1 text-left collapsed:hidden">Search</span>
          <ShortcutHint className="eyebrow rounded border border-rule px-1 text-[10px] collapsed:hidden" />
        </button>

        <nav aria-label="Main navigation" className="flex flex-col gap-0.5">
          <p className="eyebrow mb-1.5 px-2.5 text-ink-3 collapsed:hidden">Menu</p>
          {navLinks.map((link) => {
            const current = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                title={link.label}
                className={cn(
                  "group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors duration-150 collapsed:justify-center collapsed:px-0",
                  current
                    ? "bg-bg-raised font-medium text-ink"
                    : "text-ink-2 hover:bg-bg-raised/70 hover:text-ink",
                )}
              >
                <NavIcon name={link.icon} className="h-4 w-4 shrink-0" />
                <span className="flex-1 collapsed:hidden">{link.label}</span>
                {link.href === "/projects" && (
                  <span className="eyebrow rounded bg-bg px-1.5 text-ink-3 tabular-nums group-hover:hidden collapsed:hidden">
                    {projects.length}
                  </span>
                )}
                <kbd
                  aria-hidden
                  className="eyebrow hidden text-[10px] text-ink-3 group-hover:inline collapsed:hidden"
                >
                  G {link.key.toUpperCase()}
                </kbd>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-0.5 collapsed:hidden">
          <p className="eyebrow mb-1.5 px-2.5 text-ink-3">Projects</p>
          {projects.map((p) => {
            const href = `/projects/${p.slug}`;
            const current = pathname === href;
            return (
              <Link
                key={p.slug}
                href={href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors duration-150",
                  current ? "bg-bg-raised text-ink" : "text-ink-2 hover:bg-bg-raised/70 hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative h-1.5 w-1.5 shrink-0 rounded-full",
                    p.status === "in-progress"
                      ? "pulse-dot bg-ink text-ink"
                      : "border border-ink-3",
                  )}
                />
                <span className="truncate">{p.title}</span>
                {p.status === "in-progress" && <span className="sr-only">(in progress)</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Status and controls */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-rule p-3 collapsed:items-center collapsed:px-2">
        <div className="flex items-center gap-2.5 rounded-lg bg-bg px-3 py-2.5 collapsed:hidden">
          <span aria-hidden className="pulse-dot relative h-2 w-2 shrink-0 rounded-full bg-ink text-ink" />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink">Open to work</p>
            <p className="truncate text-xs text-ink-3">Freelance · Full-time</p>
          </div>
        </div>
        <span
          aria-hidden
          title="Open to work"
          className="pulse-dot relative hidden h-2 w-2 rounded-full bg-ink text-ink collapsed:block"
        />

        <div className="flex items-center gap-1 collapsed:flex-col">
          <ThemeToggle className="h-8 w-8 rounded-lg" />
          <a
            href={siteConfig.resumeUrl}
            download={siteConfig.resumeFileName}
            aria-label="Download résumé"
            title="Download résumé"
            className={iconButton}
          >
            <FileDown className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </a>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar  [ "
            className={cn(iconButton, "hidden collapsed:flex")}
          >
            <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
          <LocalTime className="eyebrow ml-auto text-ink-3 tabular-nums collapsed:hidden" />
        </div>
      </div>
    </aside>
  );
}
