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
    // Opens Gmail web compose instead of the OS default mail app.
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      siteConfig.email,
    )}`,
    icon: "email",
  },
];
