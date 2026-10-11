import { Briefcase, FolderKanban, LayoutGrid, Layers, Mail } from "lucide-react";
import type { NavIcon as NavIconKey } from "@/data/nav";

const icons = {
  overview: LayoutGrid,
  projects: FolderKanban,
  experience: Briefcase,
  stack: Layers,
  contact: Mail,
} as const;

export function NavIcon({ name, className }: { name: NavIconKey; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
