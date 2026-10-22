import type { SocialLink } from "@/lib/types";
import { siteConfig } from "./siteConfig";

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Maevexsushi",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/princess-mae-elfa-062540416",
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
