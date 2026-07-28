import { siteConfig } from "@/data/siteConfig";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Label } from "@/components/ui/Label";

export function Footer() {
  return (
    <footer data-tone="ink" className="bg-ink text-white">
      <div className="container-page flex flex-col items-center justify-between gap-8 py-14 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-xl font-extrabold">{siteConfig.name}</p>
          <Label as="p" className="mt-2 text-on-ink-faint">
            {siteConfig.title} · {siteConfig.location}
          </Label>
        </div>
        <div className="flex flex-col items-center gap-5 sm:items-end">
          <SocialLinks tone="onDark" />
          <p className="text-xs text-on-ink-faint">
            © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
