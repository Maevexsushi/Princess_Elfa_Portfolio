"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileDown, Mail } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { TypingEffect } from "@/components/ui/TypingEffect";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Available for opportunities
          </motion.span>

          <motion.h1
            id="hero-heading"
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Hi, I&apos;m{" "}
            <span className="text-gradient">Princess Mae D. Elfa</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-mono text-xl font-medium text-muted sm:text-2xl"
          >
            <span className="text-muted-2" aria-hidden>
              {"> "}
            </span>
            <TypingEffect words={siteConfig.roles} />
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="max-w-xl leading-relaxed text-muted"
          >
            {siteConfig.intro}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              View Projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={siteConfig.resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              Download Resume
            </a>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Contact Me
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-2">Find me on</span>
            <SocialLinks />
          </motion.div>
        </motion.div>

        <div className="flex justify-center lg:justify-end">
          <TerminalWindow />
        </div>
      </div>
    </section>
  );
}
