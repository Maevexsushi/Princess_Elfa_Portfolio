import type { Metadata } from "next";
import { skillCategories } from "@/data/skills";
import { techUsage } from "@/lib/insights";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { PageHeader } from "@/components/shell/PageHeader";
import { StackUsage } from "@/components/dashboard/StackUsage";
import { MainStackTiles } from "@/components/ui/MainStack";

export const metadata: Metadata = {
  title: "Stack",
  description: "Languages, frameworks, AI tools and IT support skills, with how often each shows up in my projects.",
};

export default function StackPage() {
  const skillCount = new Set(skillCategories.flatMap((c) => c.skills.map((s) => s.name))).size;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Stack"
        title="Tools and skills"
        description={`${skillCount} skills across ${skillCategories.length} areas, and ${techUsage().length} technologies used in shipped and in-progress projects.`}
      />

      <Panel
        title="Main stack"
        labelledBy="main-stack-heading"
        action={<span className="eyebrow text-ink-3">What I reach for first</span>}
        className="rise"
        style={riseDelay(40)}
      >
        <MainStackTiles />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel
          title="Used in projects"
          labelledBy="usage-heading"
          className="rise lg:col-span-5"
          style={riseDelay(60)}
        >
          <StackUsage withIcons />
        </Panel>

        <div className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-7">
          {skillCategories.map((category, i) => (
            <Panel
              key={category.title}
              title={category.title}
              labelledBy={`skills-${i}`}
              className="rise"
              style={riseDelay(100 + i * 40)}
              action={<span className="eyebrow text-ink-3 tabular-nums">{category.skills.length}</span>}
            >
              <ul className="flex flex-col gap-2.5">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center gap-3 text-[13px] text-ink">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rule bg-bg text-ink">
                      <SkillIcon name={skill.icon} branded className="h-[18px] w-[18px]" />
                    </span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
