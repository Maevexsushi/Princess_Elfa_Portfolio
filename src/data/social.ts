import type { SocialLink } from "@/lib/types";
import { siteConfig } from "./siteConfig";

// Placeholder URLs — swap in the real profiles when available.
export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Maevexsushi",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/princessmae",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    icon: "email",
  },
];
