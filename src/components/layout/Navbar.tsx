"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, FileDown } from "lucide-react";
import { navLinks } from "@/data/nav";
import { siteConfig } from "@/data/siteConfig";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        className="container-page flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent">{"<"}</span>
          PME
          <span className="text-accent">{" />"}</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <a
            href={siteConfig.resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            <FileDown className="h-4 w-4" aria-hidden />
            Resume
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background md:hidden"
        >
          <ul className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={siteConfig.resumeUrl}
                download
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-base font-medium text-white"
              >
                <FileDown className="h-4 w-4" aria-hidden />
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
