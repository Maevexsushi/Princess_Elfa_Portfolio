import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";

export function ProjectGrid() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Section id="projects" tone="white" labelledBy="projects-heading">
      <SectionHeading
        id="projects-heading"
        eyebrow="Projects"
        title="Featured projects"
        description="A selection of AI-powered systems and web applications I've built, with measurable business impact."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
