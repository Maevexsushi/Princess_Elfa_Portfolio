import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import {
  ArrowLeft,
  ExternalLink,
  Target,
  ListChecks,
  Cpu,
  GitBranch,
  TrendingUp,
  Lightbulb,
  Layers,
  Boxes,
} from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { TechBadge } from "@/components/ui/TechBadge";
import { Section } from "@/components/ui/Section";
import { IconTile } from "@/components/ui/IconTile";
import { BulletList } from "@/components/ui/BulletList";
import { Label } from "@/components/ui/Label";
import { StatusPill } from "@/components/ui/StatusPill";
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

/** Sub-heading for one part of the case study. Local — it has one consumer. */
function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="flex items-center gap-4">
        <IconTile tone="primary" size="sm">
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </IconTile>
        <span className="text-2xl font-extrabold">{title}</span>
      </h2>
      {children}
    </section>
  );
}

/** Results cycle accents so the row reads as three blocks, not one. */
const resultAccents = ["text-accent", "text-secondary", "text-white"];

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

  return (
    <article>
      {/* Header — the page opens on a colour block, as the home page does */}
      <Section
        tone="primary"
        labelledBy="case-study-heading"
        width="narrow"
        innerGap="gap-8"
        decoration={
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rotate-12 rounded-lg bg-white/10"
          />
        }
      >
        <Link
          href="/#projects"
          className="inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-soft transition-colors duration-200 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          Back to projects
        </Link>

        <div className="flex flex-col gap-4">
          {project.status && <StatusPill status={project.status} />}
          <Label className="text-accent">{project.tagline}</Label>
          <h1
            id="case-study-heading"
            className="text-display-sm font-extrabold leading-[1.05]"
          >
            {project.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-primary-soft">
            {project.description}
          </p>
        </div>

        {(hasRepo || hasLive) && (
          <div className="flex flex-wrap gap-3">
            {hasRepo && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({ variant: "outlineInverse", size: "md" })}
              >
                <FaGithub className="h-5 w-5" />
                Repository
              </a>
            )}
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({ variant: "inverse", size: "md" })}
              >
                <ExternalLink className="h-5 w-5" strokeWidth={2.5} />
                Live demo
              </a>
            )}
          </div>
        )}
      </Section>

      <Section tone="white" width="narrow">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-ink">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        <Block icon={Boxes} title="Tech Stack">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <TechBadge label={tech} />
              </li>
            ))}
          </ul>
        </Block>

        <Block icon={Layers} title="Project Overview">
          <p className="text-lg leading-relaxed text-foreground-soft">
            {cs.overview}
          </p>
        </Block>

        <Block icon={Target} title="Business Problem">
          <p className="text-lg leading-relaxed text-foreground-soft">
            {cs.businessProblem}
          </p>
        </Block>
      </Section>

      <Section tone="muted" width="narrow">
        <Block icon={ListChecks} title="User Requirements">
          <BulletList items={cs.userRequirements} className="text-foreground-soft" />
        </Block>

        <Block icon={Cpu} title="Technical Challenges">
          <BulletList
            items={cs.technicalChallenges}
            className="text-foreground-soft"
          />
        </Block>

        {project.screenshots.length > 0 && (
          <Block icon={Layers} title="Screenshots">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((shot) => (
                <div
                  key={shot.src}
                  className="relative aspect-video overflow-hidden rounded-lg bg-ink"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Block>
        )}
      </Section>

      <Section tone="ink" width="narrow">
        <Block icon={GitBranch} title="Development Process">
          <BulletList
            items={cs.developmentProcess}
            marker="accent"
            className="text-on-ink"
          />
        </Block>

        <Block icon={TrendingUp} title="Results & Metrics">
          <div className="grid gap-4 sm:grid-cols-3">
            {cs.results.map((r, i) => (
              <div
                key={r.label}
                className="flex flex-col gap-2 rounded-lg bg-ink-soft p-6 text-center"
              >
                <span
                  className={`text-3xl font-extrabold ${
                    resultAccents[i % resultAccents.length]
                  }`}
                >
                  {r.value}
                </span>
                <span className="text-sm leading-relaxed text-on-ink">
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </Block>
      </Section>

      <Section tone="white" width="narrow">
        <Block icon={Lightbulb} title="Lessons Learned">
          <BulletList items={cs.lessonsLearned} className="text-foreground-soft" />
        </Block>
      </Section>

      {/* CTA */}
      <Section
        tone="accent"
        width="narrow"
        innerGap="gap-8"
        innerClassName="items-center text-center"
      >
        <p className="text-display-sm font-extrabold leading-[1.05]">
          Interested in a similar project?
        </p>
        <Link href="/#contact" className={buttonClass({ variant: "primary" })}>
          Get in touch
        </Link>
      </Section>
    </article>
  );
}
