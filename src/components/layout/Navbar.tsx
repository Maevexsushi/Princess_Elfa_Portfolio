"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, FileDown } from "lucide-react";
import { navLinks } from "@/data/nav";
import { siteConfig } from "@/data/siteConfig";
import { buttonClass } from "@/components/ui/button";

/**
 * Solid white bar, no transparency and no scroll listener. The hard 2px rule
 * against the blue hero below is the transition — a blurred glass header would
 * soften exactly the edge this design wants to keep sharp.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-background">
      <nav
        className="container-page flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-extrabold text-white"
          >
            PME
          </span>
          <span className="sr-only">{siteConfig.name} — home</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-foreground-soft transition-all duration-200 hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex">
          <a
            href={siteConfig.resumeUrl}
            download
            className={buttonClass({ variant: "primary", size: "md" })}
          >
            <FileDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Resume
          </a>
        </div>

        {/* Mobile control */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-foreground transition-all duration-200 hover:bg-muted-strong md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t-2 border-border bg-background md:hidden"
        >
          <ul className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-4 py-3 text-base font-semibold text-foreground-soft transition-colors duration-200 hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-3">
              <a
                href={siteConfig.resumeUrl}
                download
                onClick={() => setOpen(false)}
                className={buttonClass({ className: "w-full" })}
              >
                <FileDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
