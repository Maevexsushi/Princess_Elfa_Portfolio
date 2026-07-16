"use client";

import { motion } from "framer-motion";
import { Code, Sparkles, Building2, Award } from "lucide-react";
import type { ComponentType } from "react";
import type { StatItem } from "@/lib/types";
import { fadeInUp } from "@/lib/motion";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  code: Code,
  sparkles: Sparkles,
  building: Building2,
  award: Award,
};

export function StatCard({ stat }: { stat: StatItem }) {
  const Icon = iconMap[stat.icon] ?? Sparkles;
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5"
    >
      <Icon className="h-6 w-6 text-accent" aria-hidden />
      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
      <span className="text-sm text-muted">{stat.label}</span>
    </motion.div>
  );
}
