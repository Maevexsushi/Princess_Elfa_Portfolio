import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { IconTile } from "@/components/ui/IconTile";
import { Label } from "@/components/ui/Label";

export function EducationTimeline() {
  return (
    <Section id="education" tone="muted" labelledBy="education-heading">
      <SectionHeading
        id="education-heading"
        eyebrow="Education"
        title="Education"
      />

      <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
        {education.map((item, i) => (
          <Card
            key={item.institution}
            as="article"
            tone="white"
            padding="lg"
            interactive
            className="flex flex-col gap-5"
          >
            <IconTile tone={i % 2 === 0 ? "primary" : "secondary"}>
              <GraduationCap className="h-7 w-7" strokeWidth={2.5} />
            </IconTile>
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-primary-strong">{item.period}</Label>
              {item.honor && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                  {item.honor}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {item.institution}
              </h3>
              <p className="mt-2 leading-relaxed text-foreground-soft">
                {item.program}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
