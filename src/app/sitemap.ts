import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { navLinks } from "@/data/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const routes: MetadataRoute.Sitemap = [
    ...navLinks.map((l) => ({
      url: l.href === "/" ? base : `${base}${l.href}`,
      changeFrequency: "monthly" as const,
      priority: l.href === "/" ? 1 : 0.9,
    })),
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
  return routes;
}
