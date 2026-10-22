import type { ComponentType, CSSProperties } from "react";
import {
  SiClaude,
  SiCss,
  SiCursor,
  SiGit,
  SiGithub,
  SiGoogle,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiPostgresql,
  SiRadixui,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWindsurf,
  SiZod,
} from "react-icons/si";
import { TbApi, TbBrandOpenai, TbDeviceMobile, TbSql } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import { PiFilePdf, PiMicrosoftExcelLogo, PiMicrosoftWordLogo } from "react-icons/pi";
import {
  Boxes,
  Brain,
  Clock3,
  Download,
  Headphones,
  Puzzle,
  Settings,
  SquareKanban,
  Wrench,
} from "lucide-react";

type IconType = ComponentType<{ className?: string; style?: CSSProperties; "aria-hidden"?: boolean }>;

/**
 * Each key's real logo, and the brand's own colour where it has one.
 *
 * `dark` is a lighter tint of the same brand colour for the dark theme,
 * where deep blues and greens would otherwise sink into the background.
 *
 * Brands whose mark is black (Next.js, GitHub, OpenAI, Cursor, Vercel…) have
 * no colour here, so they draw in the current ink and flip with the theme
 * instead of vanishing on the dark background. Skills that are not products
 * — IT support, soft skills — keep a plain line icon; there is no logo to be
 * faithful to.
 */
const icons: Record<string, { Icon: IconType; color?: string; dark?: string }> = {
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  typescript: { Icon: SiTypescript, color: "#3178C6", dark: "#5A9BE0" },
  php: { Icon: SiPhp, color: "#777BB4", dark: "#9A9ED6" },
  sql: { Icon: TbSql },
  nextjs: { Icon: SiNextdotjs },
  html: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#663399", dark: "#A57BD8" },
  responsive: { Icon: TbDeviceMobile },
  mysql: { Icon: SiMysql, color: "#4479A1", dark: "#7AAAD4" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1", dark: "#7C9BF0" },
  api: { Icon: TbApi },
  openai: { Icon: TbBrandOpenai },
  claude: { Icon: SiClaude, color: "#D97757" },
  gemini: { Icon: SiGooglegemini, color: "#8E75B2" },
  cursor: { Icon: SiCursor },
  windsurf: { Icon: SiWindsurf },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub },
  vscode: { Icon: VscVscode, color: "#007ACC" },
  cloud: { Icon: SiVercel },
  vercel: { Icon: SiVercel },
  react: { Icon: SiReact, color: "#149ECA", dark: "#61DAFB" },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  supabase: { Icon: SiSupabase, color: "#3FCF8E" },
  zod: { Icon: SiZod, color: "#3E67B1", dark: "#7A9BDB" },
  radix: { Icon: SiRadixui },
  word: { Icon: PiMicrosoftWordLogo, color: "#2B579A", dark: "#6B9BE0" },
  excel: { Icon: PiMicrosoftExcelLogo, color: "#217346", dark: "#4CB07A" },
  google: { Icon: SiGoogle, color: "#4285F4" },
  pdf: { Icon: PiFilePdf, color: "#EC1C24" },
  wrench: { Icon: Wrench },
  settings: { Icon: Settings },
  download: { Icon: Download },
  headset: { Icon: Headphones },
  puzzle: { Icon: Puzzle },
  brain: { Icon: Brain },
  clock: { Icon: Clock3 },
  kanban: { Icon: SquareKanban },
};

/**
 * Technology names as they appear in projects.ts, mapped to an icon key, so
 * the usage chart can show logos too. Names with no logo (pgvector, pdf-lib,
 * "AI / LLMs"…) simply have none.
 */
const techKeys: Record<string, string> = {
  "Claude Code": "claude",
  "Tailwind CSS": "tailwind",
  "Next.js": "nextjs",
  React: "react",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Windsurf: "windsurf",
  CSS: "css",
  PHP: "php",
  MySQL: "mysql",
  PostgreSQL: "postgresql",
  Supabase: "supabase",
  Zod: "zod",
  "Radix UI": "radix",
};

export function techIconKey(name: string): string | undefined {
  return techKeys[name];
}

export function SkillIcon({
  name,
  className,
  branded = false,
}: {
  name: string;
  className?: string;
  /** Draw the logo in its brand colour, where it has one. */
  branded?: boolean;
}) {
  const entry = icons[name];
  const Icon = entry?.Icon ?? Boxes;
  if (!branded || !entry?.color) return <Icon className={className} aria-hidden />;
  return (
    <Icon
      className={`text-[var(--brand)] dark:text-[var(--brand-dark)] ${className ?? ""}`}
      style={{ "--brand": entry.color, "--brand-dark": entry.dark ?? entry.color } as CSSProperties}
      aria-hidden
    />
  );
}
