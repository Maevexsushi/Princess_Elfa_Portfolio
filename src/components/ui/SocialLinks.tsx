import type { ComponentType } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { socialLinks } from "@/data/social";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
};

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((link) => {
        const Icon = iconMap[link.icon] ?? FaEnvelope;
        const external = link.icon !== "email";
        return (
          <li key={link.label}>
            <a
              href={link.href}
              aria-label={link.label}
              title={link.label}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
