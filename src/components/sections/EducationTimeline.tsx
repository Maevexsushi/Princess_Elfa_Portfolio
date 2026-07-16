"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function EducationTimeline() {
  return (
    <section id="education" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page flex flex-col gap-14">
        <SectionHeading eyebrow="education" title="Education" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2"
        >
          {education.map((item) => (
            <motion.article
              key={item.institution}
              variants={fadeInUp}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <GraduationCap className="h-6 w-6" aria-hidden />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-accent">{item.period}</span>
                {item.honor && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent-strong">
                    {item.honor}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {item.institution}
              </h3>
              <p className="text-sm text-muted">{item.program}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
