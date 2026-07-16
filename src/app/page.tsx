import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsGrid />
      <ProjectGrid />
      <ExperienceTimeline />
      <EducationTimeline />
      <ContactSection />
    </>
  );
}
