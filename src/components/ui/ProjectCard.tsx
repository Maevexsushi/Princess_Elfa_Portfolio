"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";
import type { Project } from "@/lib/types";
import { fadeInUp } from "@/lib/motion";
import { TechBadge } from "./TechBadge";

export function ProjectCard({ project }: { project: Project }) {
  const hasLive = project.liveUrl && project.liveUrl !== "#";
  const hasRepo = project.githubUrl && project.githubUrl !== "#";

  return (
    <motion.article
      variants={fadeInUp}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/10"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-2"
        aria-label={`View case study: ${project.title}`}
      >
        <Image
          src={project.image}
          alt={`${project.title} — ${project.tagline}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-foreground">
            {project.title}
          </h3>
          <p className="font-mono text-xs text-accent">{project.tagline}</p>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {project.impact && (
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-sm font-medium text-accent-strong">
            <TrendingUp className="h-4 w-4" aria-hidden />
            {project.impact}
          </div>
        )}

        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <TechBadge label={tech} />
            </li>
          ))}
        </ul>

        <div className="mt-1 flex items-center justify-between border-t border-border pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
          >
            Case study
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <div className="flex items-center gap-2">
            {hasRepo && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub repository`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <FaGithub className="h-4.5 w-4.5" />
              </a>
            )}
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <ExternalLink className="h-4.5 w-4.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
