import { Briefcase } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { BulletList } from "@/components/ui/BulletList";
import { Label } from "@/components/ui/Label";

export function ExperienceTimeline() {
  return (
    <Section id="experience" tone="ink" labelledBy="experience-heading">
      <SectionHeading
        id="experience-heading"
        eyebrow="Experience"
        title="Work experience"
        tone="dark"
      />

      {/* A solid 4px rail rather than a hairline: the structure should read as
          a graphic element, not a border. */}
      <ol className="relative mx-auto flex w-full max-w-3xl flex-col gap-12 border-l-4 border-primary pl-8 sm:pl-10">
        {experience.map((item) => (
          <li key={`${item.role}-${item.period}`} className="relative">
            <span
              aria-hidden
              className="absolute -left-[42px] flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white sm:-left-[52px]"
            >
              <Briefcase className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col gap-2">
              <Label className="text-accent">{item.period}</Label>
              <h3 className="text-2xl font-extrabold">{item.role}</h3>
              <p className="font-semibold text-on-ink">{item.organization}</p>
            </div>
            <BulletList
              items={item.bullets}
              marker="accent"
              className="mt-5 text-on-ink"
            />
          </li>
        ))}
      </ol>
    </Section>
  );
}
