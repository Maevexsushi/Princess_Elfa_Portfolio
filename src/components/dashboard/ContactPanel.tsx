import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/data/siteConfig";
import { socialLinks } from "@/data/social";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { LocalTime } from "@/components/ui/LocalTime";

/** The quickest routes to me, as a compact list. */
export function ContactList() {
  const github = socialLinks.find((l) => l.icon === "github");
  const linkedin = socialLinks.find((l) => l.icon === "linkedin");
  const channels = [
    github && { label: "GitHub", href: github.href, Icon: FaGithub },
    linkedin && { label: "LinkedIn", href: linkedin.href, Icon: FaLinkedin },
  ].filter((c) => !!c);
  // Dividers live on the <li>s so `first:` sees siblings; rows are inside.
  const item = "border-t border-rule first:border-t-0";
  const row = "group flex items-center gap-3 py-3 text-[13px]";

  return (
    <ul className="flex flex-col">
      <li className={`${item} ${row} pt-0`}>
        <Mail className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-ink">{siteConfig.email}</span>
        <CopyEmailButton className="shrink-0 rounded-md border border-rule px-2 py-1 text-xs text-ink-2 transition-colors hover:border-rule-strong hover:text-ink">
          Copy
        </CopyEmailButton>
      </li>
      {channels.map(({ label, href, Icon }) => (
          <li key={label} className={item}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={row}>
              <Icon className="h-4 w-4 shrink-0 text-ink-3" />
              <span className="flex-1 text-ink">{label}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 text-ink-3 transition-transform duration-300 ease-out-quint group-hover:-translate-y-px group-hover:translate-x-px"
                strokeWidth={2}
                aria-hidden
              />
            </a>
          </li>
        ))}
      <li className={`${item} ${row} pb-0`}>
        <Clock className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden />
        <span className="flex-1 text-ink-2">Replies {siteConfig.responseTime.toLowerCase()}</span>
        <LocalTime className="eyebrow text-ink-3 tabular-nums" />
      </li>
    </ul>
  );
}

export function ContactPanelBody() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <ContactList />
      <Link
        href="/contact"
        className="group mt-auto inline-flex items-center justify-between rounded-lg bg-ink px-3.5 py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-ink/85"
      >
        Send a message
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    </div>
  );
}
