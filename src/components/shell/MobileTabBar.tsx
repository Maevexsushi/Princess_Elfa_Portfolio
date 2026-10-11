"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, isActive } from "@/data/nav";
import { cn } from "@/lib/cn";
import { NavIcon } from "./NavIcon";

/** On phones and tablets the sidebar becomes an app-style tab bar. */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {navLinks.map((link) => {
          const current = isActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-colors",
                  current ? "text-ink" : "text-ink-3 hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    current && "bg-bg-raised",
                  )}
                >
                  <NavIcon name={link.icon} className="h-[18px] w-[18px]" />
                </span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
