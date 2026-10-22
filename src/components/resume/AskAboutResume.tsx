"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { openAskAI } from "@/components/ui/AskAI";

/** A nudge toward the assistant, and to the long form of the same story. */
export function AskAboutResume() {
  return (
    <div className="panel rise flex flex-col gap-3 p-4" style={{ "--d": "180ms" } as React.CSSProperties}>
      <p className="text-[13px] font-medium text-ink">Have a question about it?</p>
      <p className="text-[13px] leading-relaxed text-ink-2">
        Ask the assistant anything on the résumé, or read the full story behind each role and project.
      </p>
      <button
        type="button"
        onClick={openAskAI}
        className="group flex items-center justify-between rounded-lg bg-ink px-3.5 py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-ink/85"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Ask AI about her résumé
        </span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
      </button>
      <div className="flex gap-4 text-[13px] font-medium">
        <Link href="/experience" className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
          Experience
        </Link>
        <Link href="/projects" className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
          Projects
        </Link>
      </div>
    </div>
  );
}
