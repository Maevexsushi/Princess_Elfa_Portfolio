import { siteConfig } from "@/data/siteConfig";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-mono text-sm font-semibold">
            <span className="text-accent">{"<"}</span>
            {siteConfig.name}
            <span className="text-accent">{" />"}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {siteConfig.title} · {siteConfig.location}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:items-end">
          <SocialLinks />
          <p className="font-mono text-xs text-muted-2">
            © 2026 {siteConfig.name}. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
