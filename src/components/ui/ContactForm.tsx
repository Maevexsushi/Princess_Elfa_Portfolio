"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { buttonClass } from "./button";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Boxed fields with the label above; the label darkens with the field on
 * focus. The label follows the field in the markup (lifted with
 * flex-col-reverse) so `peer-focus` can reach it.
 */
const fieldClass =
  "peer w-full rounded-lg border border-rule bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-200 focus:border-ink-3 focus:ring-4 focus:ring-ink/5 focus:outline-none";
const labelClass = "text-[13px] font-medium text-ink-2 transition-colors duration-200 peer-focus:text-ink";

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

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5" noValidate>
      {/* Honeypot field — hidden from users, catches bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col-reverse gap-1.5">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
        </div>
        <div className="flex flex-col-reverse gap-1.5">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-1.5">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project or opportunity…"
          className={`${fieldClass} resize-y`}
        />
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
      </div>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" role="status" className="text-sm">
          {status === "success" && (
            <p className="flex items-center gap-2 text-ink">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} aria-hidden />
              {message}
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-accent-ink">
              <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              {message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClass({ size: "md", className: "shrink-0 self-start sm:self-auto" })}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover/btn:translate-x-1"
                strokeWidth={2}
                aria-hidden
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
