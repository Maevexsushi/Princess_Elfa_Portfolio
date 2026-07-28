import { MapPin, GraduationCap, FlaskConical } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { stats } from "@/data/stats";
import { skillCategories } from "@/data/skills";
import { StatCard } from "@/components/ui/StatCard";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { IconTile } from "@/components/ui/IconTile";
import { Label } from "@/components/ui/Label";

// A compact tech-stack visualization drawn from the core skill categories.
const techStack = [
  ...skillCategories[0].skills, // languages
  ...skillCategories[1].skills.slice(0, 2), // frontend highlights
  ...skillCategories[2].skills.slice(1, 2), // backend highlight (MySQL)
];

export function AboutSection() {
  return (
    <Section id="about" tone="white" labelledBy="about-heading">
      <SectionHeading id="about-heading" eyebrow="About" title="A bit about me" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-foreground-soft">
            {siteConfig.summary}
          </p>

          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <MapPin
                className="h-5 w-5 shrink-0 text-primary"
                strokeWidth={2.5}
                aria-hidden
              />
              <span className="text-foreground-soft">
                Based in{" "}
                <span className="font-bold text-foreground">
                  {siteConfig.location}
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <GraduationCap
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                strokeWidth={2.5}
                aria-hidden
              />
              <span className="text-foreground-soft">
                <span className="font-bold text-foreground">
                  BS in Information Technology
                </span>
                , Bulacan State University — Meneses (2022–2026),{" "}
                <span className="font-bold text-accent-strong">Cum Laude</span>
              </span>
            </li>
          </ul>

          <Card tone="accent" className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <IconTile tone="accent" size="sm">
                <FlaskConical className="h-5 w-5" strokeWidth={2.5} />
              </IconTile>
              <Label className="text-accent-strong">Thesis highlight</Label>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">
                DermaSculpt: Dermatology AI Clinic Support System
              </p>
              <p className="mt-2 leading-relaxed text-foreground-soft">
                An AI-powered clinic support platform that improved staff
                response times by 30%.
              </p>
            </div>
          </Card>
        </div>

        {/* Tech stack block */}
        <Card tone="muted" padding="lg" className="flex flex-col gap-6">
          <Label className="text-primary-strong">Core stack</Label>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {techStack.map((skill, i) => (
              <li
                key={`${skill.name}-${i}`}
                className="group flex flex-col items-center gap-3 rounded-lg bg-background p-4 text-center transition-all duration-200 hover:scale-[1.04]"
              >
                <SkillIcon
                  name={skill.icon}
                  className="h-8 w-8 text-primary-strong transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-sm font-semibold text-foreground">
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Key statistics — each one its own accent */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </Section>
  );
}
