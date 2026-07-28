import { skillCategories } from "@/data/skills";
import { SkillCard } from "@/components/ui/SkillCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Label";

export function SkillsGrid() {
  return (
    <Section id="skills" tone="muted" labelledBy="skills-heading">
      <SectionHeading
        id="skills-heading"
        eyebrow="Skills"
        title="Technical toolkit"
        description="Technologies and tools I use to design, build, and support reliable applications."
      />

      <div className="grid gap-10 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <div key={category.title} className="flex flex-col gap-4">
            <h3 className="flex items-center gap-3">
              <span
                aria-hidden
                className={`h-6 w-1.5 shrink-0 rounded-sm ${
                  i % 2 === 0 ? "bg-primary" : "bg-secondary"
                }`}
              />
              <Label>{category.title}</Label>
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {category.skills.map((skill) => (
                <SkillCard key={`${category.title}-${skill.name}`} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
