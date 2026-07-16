"use client";

import { motion } from "framer-motion";
import { Mail, Clock, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/data/siteConfig";
import { socialLinks } from "@/data/social";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ui/ContactForm";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function ContactSection() {
  const github = socialLinks.find((l) => l.icon === "github");
  const linkedin = socialLinks.find((l) => l.icon === "linkedin");

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="container-page flex flex-col gap-14">
        <SectionHeading
          eyebrow="contact"
          title="Interested in working together?"
          description={siteConfig.openToWork}
        />

        <div className="mx-auto grid w-full max-w-4xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4"
          >
            <motion.a
              variants={fadeInUp}
              href={`mailto:${siteConfig.email}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <span className="flex flex-col">
                <span className="text-xs text-muted-2">Email</span>
                <span className="text-sm font-medium text-foreground group-hover:text-accent">
                  {siteConfig.email}
                </span>
              </span>
            </motion.a>

            {github && (
              <motion.a
                variants={fadeInUp}
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <FaGithub className="h-5 w-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-muted-2">GitHub</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent">
                    View my repositories
                  </span>
                </span>
              </motion.a>
            )}

            {linkedin && (
              <motion.a
                variants={fadeInUp}
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <FaLinkedin className="h-5 w-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-muted-2">LinkedIn</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent">
                    Connect with me
                  </span>
                </span>
              </motion.a>
            )}

            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted"
            >
              <Clock className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              Typical response time:{" "}
              <span className="font-medium text-foreground">
                {siteConfig.responseTime}
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent-soft p-4 text-sm text-muted"
            >
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              Open to freelance, web development, AI integrations, and full-time
              roles.
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
