import type { Metadata } from "next";
import { Briefcase, GraduationCap } from "lucide-react";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { PageHeader } from "@/components/shell/PageHeader";
import { Timeline } from "@/components/dashboard/Timeline";

export const metadata: Metadata = {
  title: "Experience",
  description: "Freelance full-stack work, a government IT internship, and a BSIT degree, Cum Laude.",
};

export default function ExperiencePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Experience"
        title="Work and education"
        description="Freelancing for small businesses and clinics, interning in government IT, and finishing a degree with honors — much of it at the same time."
      />

      <Panel title="Timeline" labelledBy="timeline-heading" className="rise" style={riseDelay(60)}>
        <Timeline />
      </Panel>

      <section aria-labelledby="work-heading" className="flex flex-col gap-3">
        <h2 id="work-heading" className="eyebrow flex items-center gap-2 text-ink-3">
          <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> Work
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {experience.map((item, i) => (
            <article
              key={`${item.role}-${item.start}`}
              className="panel rise flex flex-col gap-4 p-5"
              style={riseDelay(120 + i * 60)}
            >
              <header className="flex flex-col gap-1">
                <p className="eyebrow text-ink-3">{item.period}</p>
                <h3 className="heading text-lg text-ink">{item.role}</h3>
                <p className="text-[13px] text-ink-2">{item.organization}</p>
              </header>
              <ul className="flex flex-col gap-2.5 border-t border-rule pt-4">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[13px] leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-ink-3" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-heading" className="flex flex-col gap-3">
        <h2 id="education-heading" className="eyebrow flex items-center gap-2 text-ink-3">
          <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> Education
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {education.map((item, i) => (
            <article
              key={item.institution}
              className="panel rise flex flex-col gap-1 p-5"
              style={riseDelay(240 + i * 60)}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="eyebrow text-ink-3">{item.period}</p>
                {item.honor && (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-bg">
                    {item.honor}
                  </span>
                )}
              </div>
              <h3 className="heading text-lg text-ink">{item.program}</h3>
              <p className="text-[13px] text-ink-2">{item.institution}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
