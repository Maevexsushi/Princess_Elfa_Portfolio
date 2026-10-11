export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
}

export interface Skill {
  name: string;
  icon: string; // icon key resolved in SkillIcon
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  /** "YYYY-MM", for the timeline chart. */
  start: string;
  end: string;
  location?: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  period: string;
  /** "YYYY-MM", for the timeline chart. */
  start: string;
  end: string;
  honor?: string;
}

export interface StatItem {
  value: string;
  label: string;
  /** Where the figure comes from, shown as a caption. */
  source: string;
}

export interface CaseStudySection {
  overview: string;
  businessProblem: string;
  userRequirements: string[];
  technicalChallenges: string[];
  developmentProcess: string[];
  results: { value: string; label: string }[];
  lessonsLearned: string[];
}

export type ProjectStatus = "in-progress";

export interface Project {
  slug: string;
  /** Omit for finished projects. */
  status?: ProjectStatus;
  /** Measurable progress for work still under way, e.g. sprints delivered. */
  progress?: { value: number; total: number; unit: string };
  title: string;
  tagline: string;
  description: string;
  image: string;
  featured: boolean;
  technologies: string[];
  impact?: string;
  githubUrl?: string;
  liveUrl?: string;
  screenshots: { src: string; alt: string }[];
  caseStudy: CaseStudySection;
}
