import Link from "next/link";
import { ArrowRight, FileText, GraduationCap, MapPin } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { LocalTime } from "@/components/ui/LocalTime";
import { buttonClass } from "@/components/ui/button";
import { riseDelay } from "@/components/ui/Panel";

export function IntroPanel() {
  return (
    <section aria-labelledby="intro-heading" className="panel rise flex flex-col gap-5 p-5 sm:p-6" style={riseDelay(60)}>
      <div className="eyebrow flex items-center justify-between gap-4 text-ink-3">
        <span className="flex items-center gap-2 text-ink">
          <span aria-hidden className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-ink text-ink" />
          Open to work
        </span>
        <LocalTime className="tabular-nums" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 id="intro-heading" className="heading text-[1.75rem] leading-tight text-ink sm:text-[2rem]">
          {siteConfig.name}
          <span className="block text-lg tracking-[-0.02em] text-ink-3 sm:text-xl">
            Full-stack &amp; AI web developer
          </span>
        </h1>
        <p className="max-w-2xl leading-relaxed text-ink-2">
          {siteConfig.headline} {siteConfig.summary}
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-2">
        <li className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} aria-hidden />
          {siteConfig.location}
        </li>
        <li className="flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} aria-hidden />
          BS Information Technology, Cum Laude 2026
        </li>
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Link href="/projects" className={buttonClass({ size: "md" })}>
          View projects
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover/btn:translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
        <Link href="/resume" className={buttonClass({ variant: "secondary", size: "md" })}>
          <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Résumé
        </Link>
        <CopyEmailButton className="h-11 rounded-full px-4 text-sm font-medium text-ink-2 transition-colors hover:bg-bg-raised hover:text-ink" />
      </div>
    </section>
  );
}
