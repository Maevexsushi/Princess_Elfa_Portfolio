import type { ComponentType } from "react";
import {
  SiJavascript,
  SiTypescript,
  SiPhp,
  SiNextdotjs,
  SiHtml5,
  SiCss,
  SiMysql,
  SiGooglegemini,
  SiGoogle,
  SiGit,
  SiGithub,
  SiClaude,
  SiCursor,
} from "react-icons/si";
import {
  Database,
  Smartphone,
  Webhook,
  Bot,
  Code2,
  Cloud,
  Wrench,
  Settings,
  Download,
  Headphones,
  FileText,
  Table,
  FileType,
  Puzzle,
  Brain,
  Clock3,
  SquareKanban,
  Boxes,
} from "lucide-react";

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const iconMap: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  php: SiPhp,
  sql: Database,
  nextjs: SiNextdotjs,
  html: SiHtml5,
  css: SiCss,
  responsive: Smartphone,
  mysql: SiMysql,
  api: Webhook,
  openai: Bot,
  claude: SiClaude,
  gemini: SiGooglegemini,
  cursor: SiCursor,
  git: SiGit,
  github: SiGithub,
  vscode: Code2,
  cloud: Cloud,
  wrench: Wrench,
  settings: Settings,
  download: Download,
  headset: Headphones,
  word: FileText,
  excel: Table,
  google: SiGoogle,
  pdf: FileType,
  puzzle: Puzzle,
  brain: Brain,
  clock: Clock3,
  kanban: SquareKanban,
};

export function SkillIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Boxes;
  return <Icon className={className} aria-hidden />;
}
