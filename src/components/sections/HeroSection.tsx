import Link from "next/link";
import { ArrowRight, FileDown, Mail } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { TypingEffect } from "@/components/ui/TypingEffect";
import { GeometricComposition } from "@/components/ui/GeometricComposition";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Label";
import { buttonClass } from "@/components/ui/button";

/**
 * The page opens on a solid blue block rather than white, so the first thing a
 * visitor reads is a colour field — the poster move the design system asks for.
 *
 * Blue-600 rather than blue-500: white body copy on blue-500 measures 3.68:1
 * and fails WCAG AA. Blue-500 is still the button colour on light sections.
 */
export function HeroSection() {
  return (
    <Section
      id="hero"
      tone="primary"
      labelledBy="hero-heading"
      innerClassName="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16"
      decoration={
        <>
          {/* Oversized flat shapes — visual interest with no depth cues */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-48 -left-28 h-96 w-96 rotate-12 rounded-lg bg-white/5"
          />
        </>
      }
    >
      <div className="flex flex-col items-start gap-7">
        <Label className="inline-flex items-center gap-2.5 rounded-md bg-accent px-3.5 py-2 text-ink">
          <span aria-hidden className="h-2 w-2 animate-pulse rounded-sm bg-ink" />
          Available for opportunities
        </Label>

        <h1 id="hero-heading" className="flex flex-col gap-3">
          <span className="text-lg font-semibold uppercase tracking-wider">
            Hi, I&apos;m
          </span>
          <span className="text-display font-extrabold leading-[0.95]">
            {siteConfig.name}
          </span>
        </h1>

        <p className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
          <span aria-hidden className="h-8 w-1.5 shrink-0 rounded-sm bg-accent" />
          <TypingEffect words={siteConfig.roles} />
        </p>

        <p className="max-w-xl text-lg leading-relaxed text-primary-soft">
          {siteConfig.intro}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/#projects" className={buttonClass({ variant: "inverse" })}>
            View Projects
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </Link>
          <a
            href={siteConfig.resumeUrl}
            download
            className={buttonClass({ variant: "outlineInverse" })}
          >
            <FileDown className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            Resume
          </a>
          <Link
            href="/#contact"
            className={buttonClass({ variant: "outlineInverse" })}
          >
            <Mail className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            Contact
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Label className="text-primary-soft">Find me on</Label>
          <SocialLinks tone="onDark" />
        </div>
      </div>

      <div className="mt-14 flex justify-center lg:mt-0 lg:justify-end">
        <GeometricComposition />
      </div>
    </Section>
  );
}
