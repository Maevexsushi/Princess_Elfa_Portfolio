import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { normalizeTech, pad2, statusLabel } from "@/lib/insights";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { buttonClass } from "@/components/ui/button";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const title = `${project.title} — ${project.tagline}`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `${siteConfig.url}/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.description,
      url: `${siteConfig.url}/projects/${project.slug}`,
      images: [{ url: project.image, alt: project.title }],
    },
  };
}

const chapters = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The problem" },
  { id: "requirements", label: "Requirements" },
  { id: "challenges", label: "Technical challenges" },
  { id: "process", label: "Process" },
  { id: "lessons", label: "Lessons learned" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

/** One numbered chapter of the case study, as a panel. */
function Chapter({ id, children }: { id: ChapterId; children: ReactNode }) {
  const index = chapters.findIndex((c) => c.id === id);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="panel scroll-mt-20">
      <header className="flex min-h-12 items-center gap-3 border-b border-rule px-5 py-2.5">
        <span className="eyebrow text-ink-3 tabular-nums">{pad2(index + 1)}</span>
        <h2 id={`${id}-heading`} className="text-[13px] font-medium text-ink">
          {chapters[index].label}
        </h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-rule py-3 first:border-t-0 first:pt-0 last:pb-0">
      <dt className="eyebrow text-ink-3">{label}</dt>
      <dd className="text-[13px] text-ink">{children}</dd>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const hasLive = project.liveUrl && project.liveUrl !== "#";
  const hasRepo = project.githubUrl && project.githubUrl !== "#";
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const stack = [...new Set(project.technologies.map(normalizeTech))];

  return (
    <article className="flex flex-col gap-6">
      {/* Reading progress, driven by the page's own scroll timeline */}
      <div aria-hidden className="reading-progress fixed inset-x-0 top-0 z-50 h-0.5 bg-ink" />

      {/* Header */}
      <header className="rise flex flex-col gap-5">
        <Link
          href="/projects"
          className="group inline-flex w-fit items-center gap-1.5 text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-300 ease-out-quint group-hover:-translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
          All projects
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="eyebrow text-ink-3">
                {pad2(index + 1)} / {pad2(projects.length)} · {project.tagline}
              </span>
              <StatusBadge project={project} />
            </div>
            <h1 className="heading text-[1.75rem] leading-tight text-ink sm:text-[2rem]">
              {project.title}
            </h1>
            <p className="max-w-3xl leading-relaxed text-ink-2">{project.description}</p>
          </div>

          {(hasRepo || hasLive) && (
            <div className="flex shrink-0 flex-wrap gap-2">
              {hasRepo && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass({ variant: "secondary", size: "md" })}
                >
                  Source code
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </a>
              )}
              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass({ size: "md" })}
                >
                  Live site
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Results as headline figures */}
      <dl className="grid gap-3 sm:grid-cols-3">
        {cs.results.map((r, i) => (
          <div
            key={r.label}
            className="panel rise flex flex-col gap-1 p-4"
            style={riseDelay(60 + i * 50)}
          >
            <dt className="order-2 text-[13px] leading-snug text-ink-2">{r.label}</dt>
            <dd className="heading order-1 text-[1.75rem] leading-none text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
          <div
            className="panel rise relative aspect-[16/10] overflow-hidden"
            style={riseDelay(200)}
          >
            <ViewTransition name={`project-${project.slug}`} share="project-image">
              <div className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top"
                />
              </div>
            </ViewTransition>
          </div>

          <Chapter id="overview">
            <p className="leading-relaxed text-ink">{cs.overview}</p>
          </Chapter>

          <Chapter id="problem">
            <p className="leading-relaxed text-ink-2">{cs.businessProblem}</p>
          </Chapter>

          <Chapter id="requirements">
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {cs.userRequirements.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink text-bg">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="challenges">
            <ol className="flex flex-col">
              {cs.technicalChallenges.map((item, i) => (
                <li
                  key={item}
                  className="grid grid-cols-[2rem_1fr] gap-2 border-t border-rule py-3.5 text-[13px] leading-relaxed text-ink-2 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="eyebrow pt-0.5 text-ink-3 tabular-nums">{pad2(i + 1)}</span>
                  {item}
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="process">
            {/* Steps strung on a rule, so the order reads as a path */}
            <ol className="relative ml-3 flex flex-col gap-5 border-l border-rule pl-7">
              {cs.developmentProcess.map((step, i) => (
                <li key={step} className="relative text-[13px] leading-relaxed text-ink-2">
                  <span
                    aria-hidden
                    className="eyebrow absolute top-0 -left-[calc(1.75rem+0.6875rem)] flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full border border-rule-strong bg-surface text-[10px] text-ink"
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="lessons">
            <ul className="flex flex-col gap-4">
              {cs.lessonsLearned.map((lesson) => (
                <li
                  key={lesson}
                  className="border-l-2 border-ink pl-4 leading-relaxed font-medium text-ink"
                >
                  {lesson}
                </li>
              ))}
            </ul>
          </Chapter>
        </div>

        {/* Details sidebar */}
        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            <Panel
              title="Details"
              labelledBy="details-heading"
              className="rise"
              style={riseDelay(240)}
            >
              <dl className="flex flex-col">
                <DetailRow label="Status">{statusLabel(project)}</DetailRow>
                {project.progress && (
                  <DetailRow label="Progress">
                    {project.progress.value} of {project.progress.total} {project.progress.unit}
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-bg-raised">
                      <span
                        className="grow block h-full rounded-full bg-ink"
                        style={{
                          width: `${(project.progress.value / project.progress.total) * 100}%`,
                        }}
                      />
                    </span>
                  </DetailRow>
                )}
                {project.impact && <DetailRow label="Impact">{project.impact}</DetailRow>}
                <DetailRow label="Stack">
                  <span className="flex flex-wrap gap-1">
                    {stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-rule bg-bg px-1.5 py-0.5 text-xs text-ink-2"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </DetailRow>
              </dl>
            </Panel>

            <div className="panel rise hidden p-4 lg:block" style={riseDelay(280)}>
              <TableOfContents items={[...chapters]} />
            </div>
          </div>
        </aside>
      </div>

      {/* Onward */}
      <nav aria-label="More projects" className="grid gap-3 sm:grid-cols-2">
        {[
          { p: prev, dir: "Previous" as const },
          { p: next, dir: "Next" as const },
        ].map(({ p, dir }) => (
          <Link
            key={dir}
            href={`/projects/${p.slug}`}
            className={`panel group flex items-center gap-4 p-4 transition-colors hover:border-rule-strong ${
              dir === "Next" ? "sm:flex-row-reverse sm:text-right" : ""
            }`}
          >
            <span className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-bg-raised ring-1 ring-rule ring-inset">
              <Image
                src={p.image}
                alt=""
                fill
                sizes="72px"
                className="object-cover object-top grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`eyebrow flex items-center gap-1 text-ink-3 ${
                  dir === "Next" ? "sm:justify-end" : ""
                }`}
              >
                {dir === "Previous" && <ArrowLeft className="h-3 w-3" strokeWidth={2} aria-hidden />}
                {dir} project
                {dir === "Next" && <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden />}
              </span>
              <span className="block truncate font-medium text-ink">{p.title}</span>
            </span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
