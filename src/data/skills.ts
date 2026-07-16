import type { SkillCategory } from "@/lib/types";

// `icon` maps to a key resolved in the SkillCard component. Unknown keys
// gracefully fall back to a generic badge, so new skills are safe to add.
export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "PHP", icon: "php" },
      { name: "SQL", icon: "sql" },
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      { name: "Next.js", icon: "nextjs" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "Responsive Design", icon: "responsive" },
    ],
  },
  {
    title: "Backend Development",
    skills: [
      { name: "PHP", icon: "php" },
      { name: "MySQL", icon: "mysql" },
      { name: "REST APIs", icon: "api" },
    ],
  },
  {
    title: "AI & Development Tools",
    skills: [
      { name: "ChatGPT", icon: "openai" },
      { name: "Claude", icon: "claude" },
      { name: "Gemini", icon: "gemini" },
      { name: "Cursor AI", icon: "cursor" },
    ],
  },
  {
    title: "Tools & Technologies",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "VS Code", icon: "vscode" },
      { name: "Hosting & Deployment", icon: "cloud" },
    ],
  },
  {
    title: "IT Support",
    skills: [
      { name: "Computer Troubleshooting", icon: "wrench" },
      { name: "System Setup & Configuration", icon: "settings" },
      { name: "Software Installation", icon: "download" },
      { name: "Technical Support", icon: "headset" },
    ],
  },
  {
    title: "Productivity Tools",
    skills: [
      { name: "Microsoft Word", icon: "word" },
      { name: "Microsoft Excel", icon: "excel" },
      { name: "Google Workspace", icon: "google" },
      { name: "PDF Tools", icon: "pdf" },
    ],
  },
  {
    title: "Soft Skills",
    skills: [
      { name: "Problem Solving", icon: "puzzle" },
      { name: "Critical Thinking", icon: "brain" },
      { name: "Time Management", icon: "clock" },
      { name: "Project Management", icon: "kanban" },
    ],
  },
];
