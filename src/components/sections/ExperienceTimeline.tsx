"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="scroll-mt-20 border-y border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="container-page flex flex-col gap-14">
        <SectionHeading eyebrow="experience" title="Work experience" />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative mx-auto flex max-w-3xl flex-col gap-10 border-l border-border pl-8"
        >
          {experience.map((item) => (
            <motion.li key={`${item.role}-${item.period}`} variants={fadeInUp} className="relative">
              <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-background">
                <Briefcase className="h-3 w-3 text-accent" aria-hidden />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-accent">{item.period}</span>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.role}
                </h3>
                <p className="text-sm text-muted">{item.organization}</p>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {item.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
