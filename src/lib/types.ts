export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
}

export interface Skill {
  name: string;
  icon: string; // react-icons key resolved in SkillCard
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  period: string;
  honor?: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
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

export interface Project {
  slug: string;
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
