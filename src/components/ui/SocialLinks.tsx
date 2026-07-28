import type { ComponentType } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { socialLinks } from "@/data/social";
import { cn } from "@/lib/cn";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
};

/** Solid squares — geometric, and legible on both light and colour-block sections. */
const toneClass = {
  onLight: "bg-muted text-foreground hover:bg-primary hover:text-white",
  onDark: "bg-white text-primary-strong hover:bg-accent hover:text-ink",
} as const;

export function SocialLinks({
  tone = "onLight",
  className,
}: {
  tone?: keyof typeof toneClass;
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {socialLinks.map((link) => {
        const Icon = iconMap[link.icon] ?? FaEnvelope;
        // http(s) links (incl. the Gmail compose link) open in a new tab;
        // any mailto/tel links stay in the same tab.
        const external = link.href.startsWith("http");
        return (
          <li key={link.label}>
            <a
              href={link.href}
              aria-label={link.label}
              title={link.label}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-md transition-all duration-200 hover:scale-110",
                toneClass[tone],
              )}
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
