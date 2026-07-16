"use client";

import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

interface Line {
  prompt?: string;
  text: string;
  comment?: boolean;
  output?: boolean;
}

const lines: Line[] = [
  { prompt: "~", text: "whoami" },
  { text: "princess-mae-elfa", output: true },
  { prompt: "~", text: "cat stack.json" },
  { text: "{", output: true },
  { text: '  "frontend": ["Next.js", "TypeScript", "Tailwind"],', output: true },
  { text: '  "backend":  ["PHP", "MySQL", "REST APIs"],', output: true },
  { text: '  "ai":       ["Claude", "ChatGPT", "Gemini"]', output: true },
  { text: "}", output: true },
  { prompt: "~", text: "./deploy.sh --status", comment: false },
  { text: "✔ shipping user-focused apps that improve business.", output: true },
];

export function TerminalWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-2xl glow"
      role="img"
      aria-label="Terminal window showing a developer profile summary"
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-2 font-mono text-xs text-muted-2">
          princess@portfolio: ~
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.3 }}
              className="whitespace-pre"
            >
              {line.prompt ? (
                <>
                  <span className="text-green-400">{line.prompt}</span>
                  <span className="text-muted-2"> $ </span>
                  <span className="text-foreground">{line.text}</span>
                </>
              ) : (
                <span
                  className={line.text.startsWith("✔") ? "text-accent-strong" : "text-muted"}
                >
                  {line.text}
                </span>
              )}
            </motion.div>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}
