"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`mx-auto flex max-w-2xl flex-col gap-3 ${alignment} ${
        align === "center" ? "" : "mx-0"
      }`}
    >
      <span className="font-mono text-sm text-accent">
        <span className="text-muted-2">{"// "}</span>
        {eyebrow}
      </span>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="text-muted">{description}</p>}
    </motion.div>
  );
}
