import type { Skill } from "@/lib/types";
import { SkillIcon } from "./SkillIcon";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <li className="group flex items-center gap-3.5 rounded-lg bg-background px-4 py-3.5 transition-all duration-200 hover:scale-[1.02] hover:bg-primary-soft">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary-strong transition-all duration-200 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
        <SkillIcon name={skill.icon} className="h-5 w-5" />
      </span>
      <span className="font-semibold text-foreground">{skill.name}</span>
    </li>
  );
}
