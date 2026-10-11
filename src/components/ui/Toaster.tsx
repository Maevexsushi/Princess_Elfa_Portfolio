"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { TOAST_EVENT } from "@/lib/toast";

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const onToast = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      setNonce((n) => n + 1);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(null), 2400);
    return () => window.clearTimeout(id);
  }, [message, nonce]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
    >
      {message && (
        <p
          key={nonce}
          className="rise flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          {message}
        </p>
      )}
    </div>
  );
}
