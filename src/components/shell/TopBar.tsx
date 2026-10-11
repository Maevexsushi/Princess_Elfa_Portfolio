"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileDown, Search } from "lucide-react";
import { navLinks, isActive } from "@/data/nav";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { buttonClass } from "@/components/ui/button";
import { openCommandPalette } from "@/components/ui/CommandPalette";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** "Portfolio / Projects / Acadify", from the URL alone. */
function useBreadcrumbs() {
  const pathname = usePathname();
  const crumbs: { label: string; href: string }[] = [];
  const section = navLinks.find((l) => l.href !== "/" && isActive(pathname, l.href));
  crumbs.push(section ?? navLinks[0]);
  const slug = pathname.match(/^\/projects\/([^/]+)/)?.[1];
  const project = slug && projects.find((p) => p.slug === slug);
  if (project) crumbs.push({ label: project.title, href: pathname });
  return crumbs;
}

export function TopBar() {
  const crumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-rule bg-bg/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Phones and tablets: identity, since there's no sidebar */}
      <Link href="/" className="flex min-w-0 items-center gap-2.5 lg:hidden">
        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-bg-raised">
          <Image src="/profilepic.jpg" alt="" fill sizes="28px" className="object-cover object-[50%_25%] grayscale" />
        </span>
        <span className="truncate text-[13px] font-semibold text-ink">{siteConfig.shortName}</span>
      </Link>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 lg:block">
        <ol className="flex items-center gap-1.5 text-[13px]">
          <li className="text-ink-3">Portfolio</li>
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden />
                {last ? (
                  <span aria-current="page" className="truncate font-medium text-ink">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="truncate text-ink-3 transition-colors hover:text-ink">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-bg-raised hover:text-ink lg:hidden"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        </button>
        <ThemeToggle className="lg:hidden" />
        <a
          href={siteConfig.resumeUrl}
          download
          className={buttonClass({ variant: "secondary", size: "sm", className: "max-sm:hidden" })}
        >
          <FileDown className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Résumé
        </a>
        <Link href="/contact" className={buttonClass({ size: "sm" })}>
          Get in touch
        </Link>
      </div>
    </header>
  );
}
