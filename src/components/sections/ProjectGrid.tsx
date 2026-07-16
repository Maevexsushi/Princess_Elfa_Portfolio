"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer, viewportOnce } from "@/lib/motion";

export function ProjectGrid() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page flex flex-col gap-14">
        <SectionHeading
          eyebrow="projects"
          title="Featured projects"
          description="A selection of AI-powered systems and web applications I've built, with measurable business impact."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 md:grid-cols-2"
        >
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
