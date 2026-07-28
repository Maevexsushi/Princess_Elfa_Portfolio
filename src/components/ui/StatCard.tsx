import { Code, Sparkles, Building2, Award } from "lucide-react";
import type { ComponentType } from "react";
import type { StatItem } from "@/lib/types";
import { Card, type CardTone } from "./Card";
import { IconTile, type IconTileTone } from "./IconTile";

const iconMap: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  code: Code,
  sparkles: Sparkles,
  building: Building2,
  award: Award,
};

/**
 * Each stat is deliberately a different accent, so the row reads as four
 * distinct colour blocks rather than one repeated card.
 */
const accents: Array<{ card: CardTone; tile: IconTileTone; value: string }> = [
  { card: "primary", tile: "primary", value: "text-primary-strong" },
  { card: "secondary", tile: "secondary", value: "text-secondary-strong" },
  { card: "accent", tile: "accent", value: "text-accent-strong" },
  { card: "muted", tile: "ink", value: "text-ink" },
];

export function StatCard({ stat, index = 0 }: { stat: StatItem; index?: number }) {
  const Icon = iconMap[stat.icon] ?? Sparkles;
  const accent = accents[index % accents.length];

  return (
    <Card tone={accent.card} className="flex flex-col gap-4">
      <IconTile tone={accent.tile} size="sm">
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </IconTile>
      <span className={`text-2xl font-extrabold ${accent.value}`}>
        {stat.value}
      </span>
      <span className="text-sm leading-relaxed text-foreground-soft">
        {stat.label}
      </span>
    </Card>
  );
}
