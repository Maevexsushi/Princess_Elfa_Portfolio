import type { Metadata } from "next";
import { ArrowUpRight, FileDown } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { buttonClass } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/PageHeader";
import { ResumeViewer } from "@/components/resume/ResumeViewer";
import { AskAboutResume } from "@/components/resume/AskAboutResume";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${siteConfig.name}'s résumé — ${siteConfig.title}. View it in the browser or download the PDF.`,
};

export default function ResumePage() {
  const file = siteConfig.resumeUrl;
  const degree = education[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Résumé"
        title="Résumé"
        description="One page: skills, experience and education. Read it here, or take the PDF with you."
        actions={
          <>
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "secondary", size: "md" })}
            >
              Open in new tab
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
            <a href={file} download={siteConfig.resumeFileName} className={buttonClass({ size: "md" })}>
              <FileDown className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Download PDF
            </a>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <section
          aria-label="Résumé preview"
          className="panel rise overflow-hidden lg:col-span-8"
          style={riseDelay(60)}
        >
          <ResumeViewer src={file} title={`Résumé of ${siteConfig.name}`} />
        </section>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            <Panel title="At a glance" labelledBy="glance-heading" className="rise" style={riseDelay(120)}>
              <dl className="flex flex-col">
                {[
                  { term: "Role", detail: siteConfig.title },
                  { term: "Based in", detail: siteConfig.location },
                  {
                    term: "Education",
                    detail: `BS Information Technology${degree.honor ? `, ${degree.honor}` : ""} (${degree.period})`,
                  },
                  ...experience.map((e, i) => ({
                    term: i === 0 ? "Experience" : "",
                    detail: `${e.role} · ${e.start.slice(0, 4)}–${e.end.slice(0, 4)}`,
                  })),
                  { term: "Status", detail: "Open to work" },
                ].map((row) => (
                  <div
                    key={row.detail}
                    className={`flex flex-col gap-1 py-3 first:pt-0 last:pb-0 ${row.term ? "border-t border-rule first:border-t-0" : "-mt-2 pt-0"}`}
                  >
                    {row.term ? <dt className="eyebrow text-ink-3">{row.term}</dt> : <dt className="sr-only">Experience</dt>}
                    <dd className="text-[13px] leading-relaxed text-ink">{row.detail}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <AskAboutResume />
          </div>
        </aside>
      </div>
    </div>
  );
}
