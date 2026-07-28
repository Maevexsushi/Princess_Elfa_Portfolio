"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { buttonClass } from "./button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Something went wrong.");
      }

      setStatus("success");
      setMessage("Thanks for reaching out! I'll get back to you within 24 hours.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to send your message. Please email me directly.",
      );
    }
  }

  // Flat inputs: a solid gray block with no border at rest, hardening into a
  // white field with a 2px primary border on focus. No ring glow.
  const inputClass =
    "w-full rounded-md border-2 border-transparent bg-muted px-4 py-3 text-foreground placeholder:text-foreground-faint transition-colors duration-200 focus:border-primary focus:bg-background focus:outline-none";

  const labelTextClass = "text-xs font-semibold uppercase tracking-wider text-foreground";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot field — hidden from users, catches bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelTextClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelTextClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelTextClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project or opportunity…"
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className={buttonClass({ className: "mt-1 w-full" })}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Send Message
          </>
        )}
      </button>

      <div aria-live="polite" role="status">
        {status === "success" && (
          <p className="flex items-center gap-3 rounded-md bg-secondary px-4 py-3 font-semibold text-ink">
            <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-3 rounded-md bg-ink px-4 py-3 font-semibold text-white">
            <AlertCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
