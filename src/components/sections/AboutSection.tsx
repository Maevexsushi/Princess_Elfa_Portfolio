"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, FlaskConical } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { stats } from "@/data/stats";
import { skillCategories } from "@/data/skills";
import { StatCard } from "@/components/ui/StatCard";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

// A compact tech-stack visualization drawn from the core skill categories.
const techStack = [
  ...skillCategories[0].skills, // languages
  ...skillCategories[1].skills.slice(0, 2), // frontend highlights
  ...skillCategories[2].skills.slice(1, 2), // backend highlight (MySQL)
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page flex flex-col gap-14">
        <SectionHeading eyebrow="about" title="A bit about me" />

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <motion.p variants={fadeInUp} className="leading-relaxed text-muted">
              {siteConfig.summary}
            </motion.p>

            <motion.ul variants={fadeInUp} className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-accent" aria-hidden />
                <span className="text-muted">
                  Based in{" "}
                  <span className="font-medium text-foreground">
                    {siteConfig.location}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span className="text-muted">
                  <span className="font-medium text-foreground">
                    BS in Information Technology
                  </span>
                  , Bulacan State University — Meneses (2022–2026),{" "}
                  <span className="text-accent-strong">Cum Laude</span>
                </span>
              </li>
            </motion.ul>

            <motion.div
              variants={fadeInUp}
              className="rounded-xl border border-accent/20 bg-accent-soft p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-accent" aria-hidden />
                <span className="font-mono text-xs uppercase tracking-wide text-accent">
                  Thesis Highlight
                </span>
              </div>
              <p className="font-semibold text-foreground">
                DermaSculpt: Dermatology AI Clinic Support System
              </p>
              <p className="mt-1 text-sm text-muted">
                An AI-powered clinic support platform that improved staff
                response times by 30%.
              </p>
            </motion.div>
          </motion.div>

          {/* Tech stack visualization */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <p className="mb-4 font-mono text-sm text-muted-2">
              <span className="text-accent">const</span> stack ={" "}
              <span className="text-foreground">[</span>
            </p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {techStack.map((skill, i) => (
                <motion.li
                  key={`${skill.name}-${i}`}
                  variants={fadeInUp}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-2 p-4 text-center"
                >
                  <SkillIcon name={skill.icon} className="h-7 w-7 text-accent" />
                  <span className="text-xs font-medium text-foreground">
                    {skill.name}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
            <p className="mt-4 font-mono text-sm text-muted-2">
              <span className="text-foreground">]</span>;
            </p>
          </motion.div>
        </div>

        {/* Key statistics */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
