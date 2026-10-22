import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import { ArrowUpRight, Clock, FileDown, Mail } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/data/siteConfig";
import { socialLinks } from "@/data/social";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { LocalTime } from "@/components/ui/LocalTime";
import { buttonClass } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: siteConfig.openToWork,
};

const openTo = ["Freelance projects", "Web development", "AI integrations", "Full-time roles"];

/** Gmail's web compose, pre-addressed — avoids depending on an OS mail app. */
const composeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  siteConfig.email,
)}&su=${encodeURIComponent(`Hello from your portfolio`)}`;

/** The last segment of a profile URL, e.g. "Maevexsushi". */
const handle = (href: string) => href.replace(/\/+$/, "").split("/").pop() ?? href;

/** One way to reach me: what it is, where it goes, and the action. */
function Channel({
  icon: Icon,
  label,
  value,
  children,
  style,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section className="panel rise flex flex-col gap-5 p-5" style={style} aria-label={label}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rule bg-bg text-ink">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="eyebrow text-ink-3">{label}</p>
          <p className="truncate font-medium text-ink">{value}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function ContactPage() {
  const github = socialLinks.find((l) => l.icon === "github");
  const linkedin = socialLinks.find((l) => l.icon === "linkedin");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Contact" title="Get in touch" description={siteConfig.openToWork} />

      <div className="grid gap-3 lg:grid-cols-12">
        {/* Email leads: it's the channel I answer fastest */}
        <section
          aria-label="Email"
          className="panel rise flex flex-col justify-between gap-8 p-5 sm:p-6 lg:col-span-8"
          style={riseDelay(60)}
        >
          <div className="flex flex-col gap-2">
            <p className="eyebrow flex items-center gap-2 text-ink-3">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Email · the fastest way to reach me
            </p>
            <a
              href={composeHref}
              {...external}
              className="heading w-fit text-[1.375rem] break-all text-ink sm:text-[1.75rem]"
            >
              <span className="link-draw">{siteConfig.email}</span>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={composeHref} {...external} className={buttonClass({ size: "md" })}>
              Write an email
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
            <CopyEmailButton
              className={buttonClass({ variant: "secondary", size: "md" })}
            />
            <span className="flex items-center gap-1.5 px-2 text-[13px] text-ink-3">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              <span>
                Replies {siteConfig.responseTime.toLowerCase()} · it&apos;s{" "}
                <LocalTime className="tabular-nums" /> for me
              </span>
            </span>
          </div>
        </section>

        <Panel title="Open to" labelledBy="open-heading" className="rise lg:col-span-4" style={riseDelay(120)}>
          <ul className="flex flex-wrap gap-1.5">
            {openTo.map((item) => (
              <li
                key={item}
                className="rounded-full border border-rule bg-bg px-2.5 py-1 text-[13px] text-ink-2"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-auto flex items-center gap-2 pt-5 text-[13px] text-ink">
            <span aria-hidden className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-ink text-ink" />
            Available now
          </p>
        </Panel>

        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-12">
          {linkedin && (
            <Channel icon={FaLinkedin} label="LinkedIn" value={handle(linkedin.href)} style={riseDelay(180)}>
              <a href={linkedin.href} {...external} className={buttonClass({ variant: "secondary", size: "sm" })}>
                View profile
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </a>
            </Channel>
          )}
          {github && (
            <Channel icon={FaGithub} label="GitHub" value={handle(github.href)} style={riseDelay(220)}>
              <a href={github.href} {...external} className={buttonClass({ variant: "secondary", size: "sm" })}>
                View repositories
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </a>
            </Channel>
          )}
          <Channel icon={FileDown} label="Résumé" value="PDF" style={riseDelay(260)}>
            <Link href="/resume" className={buttonClass({ variant: "secondary", size: "sm" })}>
              View résumé
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </Link>
          </Channel>
        </div>
      </div>
    </div>
  );
}
