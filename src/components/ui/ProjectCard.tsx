import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";
import type { Project } from "@/lib/types";
import { Label } from "./Label";
import { TechBadge } from "./TechBadge";

export function ProjectCard({ project }: { project: Project }) {
  const hasLive = project.liveUrl && project.liveUrl !== "#";
  const hasRepo = project.githubUrl && project.githubUrl !== "#";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-muted transition-all duration-200 hover:scale-[1.02] hover:bg-primary-soft">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-ink"
        aria-label={`View case study: ${project.title}`}
      >
        <Image
          src={project.image}
          alt={`${project.title} — ${project.tagline}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <Label className="text-primary-strong">{project.tagline}</Label>
          <h3 className="text-2xl font-extrabold text-foreground">
            {project.title}
          </h3>
        </div>

        <p className="flex-1 leading-relaxed text-foreground-soft">
          {project.description}
        </p>

        {project.impact && (
          <div className="flex items-center gap-2.5 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white">
            <TrendingUp className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
            {project.impact}
          </div>
        )}

        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <TechBadge label={tech} tone="onMuted" />
            </li>
          ))}
        </ul>

        <div className="mt-1 flex items-center justify-between gap-4 border-t-2 border-border pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-strong transition-colors duration-200 hover:text-foreground"
          >
            Case study
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={2.5}
              aria-hidden
            />
          </Link>
          <div className="flex items-center gap-2">
            {hasRepo && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub repository`}
                className="flex h-11 w-11 items-center justify-center rounded-md text-foreground-soft transition-all duration-200 hover:scale-110 hover:bg-ink hover:text-white"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            )}
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="flex h-11 w-11 items-center justify-center rounded-md text-foreground-soft transition-all duration-200 hover:scale-110 hover:bg-ink hover:text-white"
              >
                <ExternalLink className="h-5 w-5" strokeWidth={2.5} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
