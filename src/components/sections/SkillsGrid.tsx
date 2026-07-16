"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/skills";
import { SkillCard } from "@/components/ui/SkillCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function SkillsGrid() {
  return (
    <section
      id="skills"
      className="scroll-mt-20 border-y border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="container-page flex flex-col gap-14">
        <SectionHeading
          eyebrow="skills"
          title="Technical toolkit"
          description="Technologies and tools I use to design, build, and support reliable applications."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-4"
            >
              <h3 className="font-mono text-sm font-semibold text-foreground">
                <span className="text-accent">#</span> {category.title}
              </h3>
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {category.skills.map((skill) => (
                  <SkillCard key={`${category.title}-${skill.name}`} skill={skill} />
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
