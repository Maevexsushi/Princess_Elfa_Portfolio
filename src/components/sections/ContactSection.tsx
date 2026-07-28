import type { ComponentType } from "react";
import { Mail, Clock, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/data/siteConfig";
import { socialLinks } from "@/data/social";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ui/ContactForm";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { IconTile } from "@/components/ui/IconTile";
import { Label } from "@/components/ui/Label";

function ContactRow({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-all duration-200 hover:scale-[1.02] hover:bg-primary-soft"
    >
      <IconTile tone="primary" size="sm">
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </IconTile>
      <span className="flex min-w-0 flex-col gap-1">
        <Label className="text-foreground-faint">{label}</Label>
        <span className="truncate font-bold text-foreground">{value}</span>
      </span>
    </a>
  );
}

export function ContactSection() {
  const github = socialLinks.find((l) => l.icon === "github");
  const linkedin = socialLinks.find((l) => l.icon === "linkedin");

  // Opens Gmail's web compose (in a new tab) pre-addressed to me, with a
  // ready-to-go subject line — avoids relying on the OS default mail app.
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    siteConfig.email,
  )}&su=${encodeURIComponent(`Project inquiry for ${siteConfig.name}`)}`;

  return (
    <Section id="contact" tone="accent" labelledBy="contact-heading">
      <SectionHeading
        id="contact-heading"
        eyebrow="Contact"
        title="Interested in working together?"
        description={siteConfig.openToWork}
        tone="color"
      />

      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <ContactRow
            href={gmailHref}
            icon={Mail}
            label="Email"
            value={siteConfig.email}
          />
          {github && (
            <ContactRow
              href={github.href}
              icon={FaGithub}
              label="GitHub"
              value="View my repositories"
            />
          )}
          {linkedin && (
            <ContactRow
              href={linkedin.href}
              icon={FaLinkedin}
              label="LinkedIn"
              value="Connect with me"
            />
          )}

          <div className="flex items-center gap-3 rounded-lg bg-ink p-4 text-white">
            <Clock className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            <span>
              Typical response time:{" "}
              <span className="font-bold">{siteConfig.responseTime}</span>
            </span>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-secondary p-4 text-ink">
            <Sparkles
              className="mt-0.5 h-5 w-5 shrink-0"
              strokeWidth={2.5}
              aria-hidden
            />
            <span className="font-semibold">
              Open to freelance, web development, AI integrations, and full-time
              roles.
            </span>
          </div>
        </div>

        <Card tone="white" padding="lg">
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}
