"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUp, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/cn";

export const ASK_EVENT = "app:ask";

/** Open the assistant from anywhere (top bar, command menu, shortcuts). */
export function openAskAI() {
  window.dispatchEvent(new Event(ASK_EVENT));
}

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What technologies does she use?",
  "Tell me about Acadify",
  "What did she do at DENR?",
  "Is she open to work?",
];

const MAX_CHARS = 600;

/* ---------------------------------------------------------------------------
   Rendering an answer: **bold**, "- " bullets, and links for site paths,
   URLs and the email address. Nothing else is interpreted.
--------------------------------------------------------------------------- */

const TOKEN = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+|(?<![\w/])\/(?:projects(?:\/[a-z0-9-]+)?|experience|stack|contact)\b)/g;

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    const link = "font-medium text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-ink";
    const md = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (md) {
      return (
        <a key={i} href={md[2]} target="_blank" rel="noopener noreferrer" className={link}>
          {md[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const clean = part.replace(/[.,]$/, "");
      return (
        <Fragment key={i}>
          <a href={clean} target="_blank" rel="noopener noreferrer" className={link}>
            {clean.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
          {part.slice(clean.length)}
        </Fragment>
      );
    }
    if (part.includes("@")) {
      const clean = part.replace(/[.,]$/, "");
      return (
        <Fragment key={i}>
          <a href={`mailto:${clean}`} className={link}>{clean}</a>
          {part.slice(clean.length)}
        </Fragment>
      );
    }
    if (part.startsWith("/")) {
      return <Link key={i} href={part} className={link}>{part}</Link>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Answer({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="flex flex-col gap-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-ink-3" />
            <span>{inline(b)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (line.trim()) blocks.push(<p key={`p-${blocks.length}`}>{inline(line)}</p>);
  }
  flush();
  return <div className="flex flex-col gap-2">{blocks}</div>;
}

/* ---------------------------------------------------------------------------
   The assistant
--------------------------------------------------------------------------- */

export function AskAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => setOpen(true), []);

  // Focus the box once the panel is interactive (it's `inert` while closed).
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    window.addEventListener(ASK_EVENT, show);
    return () => window.removeEventListener(ASK_EVENT, show);
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Follow the answer as it streams in.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function ask(question: string) {
    const q = question.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    setError(null);
    setInput("");
    const history: Message[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: text }]);
      }
      if (!text.trim()) throw new Error("No answer came back. Please try again.");
    } catch (err) {
      if (controller.signal.aborted) {
        // Stopped by the visitor: keep whatever had arrived.
        setMessages((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
      } else {
        setMessages(history.slice(0, -1));
        setInput(q);
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setBusy(false);
      abort.current = null;
      inputRef.current?.focus();
    }
  }

  const reset = () => {
    abort.current?.abort();
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : show())}
        aria-expanded={open}
        aria-controls="ask-ai"
        className={cn(
          "fixed right-4 bottom-20 z-40 flex h-11 items-center gap-2 rounded-full bg-ink pr-4 pl-3.5 text-sm font-medium text-bg shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] transition-[transform,opacity] duration-300 ease-out-quint hover:-translate-y-0.5 sm:right-6 lg:bottom-6",
          open && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        Ask AI
      </button>

      {/* Panel */}
      <section
        id="ask-ai"
        role="dialog"
        aria-label={`Ask AI about ${siteConfig.shortName}`}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden border border-rule bg-surface shadow-[0_24px_80px_-20px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-300 ease-out-quint",
          "inset-x-2 top-16 bottom-2 rounded-2xl sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6 sm:h-[min(38rem,calc(100vh-6rem))] sm:w-[25rem]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <header className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-bg">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-ink">Ask AI</p>
            <p className="truncate text-xs text-ink-3">Answers about {siteConfig.shortName} and her work</p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              aria-label="New conversation"
              title="New conversation"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-bg-raised hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-bg-raised hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
        </header>

        <div ref={logRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col justify-end gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="heading text-lg text-ink">Hi! Ask me anything about {siteConfig.shortName}.</p>
                <p className="text-[13px] leading-relaxed text-ink-2">
                  Her projects, skills, experience, education, or how to reach her. I only know what&apos;s in
                  this portfolio.
                </p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => ask(s)}
                      className="w-full rounded-xl border border-rule bg-bg px-3 py-2 text-left text-[13px] text-ink-2 transition-colors hover:border-rule-strong hover:text-ink"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <li key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "user" ? (
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-wrap text-bg">
                      {m.content}
                    </p>
                  ) : (
                    <div className="max-w-[92%] text-[13px] leading-relaxed text-ink-2">
                      {m.content ? (
                        <Answer text={m.content} />
                      ) : (
                        <span className="flex items-center gap-1 py-1.5" aria-label="Thinking">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3"
                              style={{ animationDelay: `${d * 120}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        {error && (
          <p role="alert" className="mx-4 mb-2 rounded-lg bg-bg-raised px-3 py-2 text-xs text-ink">
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="border-t border-rule p-3"
        >
          <div className="flex items-end gap-2 rounded-xl border border-rule bg-bg p-1.5 pl-3 focus-within:border-rule-strong">
            <label htmlFor="ask-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="ask-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                }
              }}
              placeholder="Ask about her projects, skills…"
              className="max-h-28 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[13px] text-ink placeholder:text-ink-3 focus:outline-none [field-sizing:content]"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => abort.current?.abort()}
                aria-label="Stop"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-bg"
              >
                <Square className="h-3 w-3 fill-current" aria-hidden />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-bg transition-opacity disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-ink-3">
            AI answers can be wrong. For anything important, email {siteConfig.email}.
          </p>
        </form>
      </section>
    </>
  );
}
