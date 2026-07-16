"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/lib/types";
import { SkillIcon } from "./SkillIcon";
import { fadeInUp } from "@/lib/motion";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <motion.li
      variants={fadeInUp}
      className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-2 text-muted transition-colors group-hover:text-accent">
        <SkillIcon name={skill.icon} className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium text-foreground">{skill.name}</span>
    </motion.li>
  );
}
