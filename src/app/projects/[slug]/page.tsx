import type { Metadata } from "next";
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
} from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { TechBadge } from "@/components/ui/TechBadge";

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

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Icon className="h-5 w-5 text-accent" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
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

  return (
    <article className="container-page flex max-w-4xl flex-col gap-12 py-16 sm:py-20">
      <Link
        href="/#projects"
        className="inline-flex w-fit items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to projects
      </Link>

      {/* Header */}
      <header className="flex flex-col gap-4">
        <p className="font-mono text-sm text-accent">{project.tagline}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <TechBadge label={tech} />
            </li>
          ))}
        </ul>
        {(hasRepo || hasLive) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {hasRepo && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-accent"
              >
                <FaGithub className="h-4 w-4" />
                Repository
              </a>
            )}
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                <ExternalLink className="h-4 w-4" />
                Live demo
              </a>
            )}
          </div>
        )}
      </header>

      {/* Hero image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-2">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      <Block icon={Layers} title="Project Overview">
        <p className="text-sm leading-relaxed text-muted">{cs.overview}</p>
      </Block>

      <Block icon={Target} title="Business Problem">
        <p className="text-sm leading-relaxed text-muted">{cs.businessProblem}</p>
      </Block>

      <Block icon={ListChecks} title="User Requirements">
        <BulletList items={cs.userRequirements} />
      </Block>

      <Block icon={Cpu} title="Technical Challenges">
        <BulletList items={cs.technicalChallenges} />
      </Block>

      {/* Screenshots */}
      {project.screenshots.length > 0 && (
        <Block icon={Layers} title="Screenshots">
          <div className="grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((shot) => (
              <div
                key={shot.src}
                className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-2"
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

      <Block icon={GitBranch} title="Development Process">
        <BulletList items={cs.developmentProcess} />
      </Block>

      <Block icon={TrendingUp} title="Results & Metrics">
        <div className="grid gap-4 sm:grid-cols-3">
          {cs.results.map((r) => (
            <div
              key={r.label}
              className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-5 text-center"
            >
              <span className="text-2xl font-bold text-accent">{r.value}</span>
              <span className="text-sm text-muted">{r.label}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block icon={Lightbulb} title="Lessons Learned">
        <BulletList items={cs.lessonsLearned} />
      </Block>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-lg font-semibold">Interested in a similar project?</p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          Get in touch
        </Link>
      </div>
    </article>
  );
}
