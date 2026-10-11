"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * "⌘K" on Apple devices, "Ctrl K" everywhere else. The server can't know the
 * platform, so it renders the Mac form and the client corrects it after
 * hydration — no mismatch, because useSyncExternalStore hydrates with the
 * server snapshot first.
 */
export function ShortcutHint({ className }: { className?: string }) {
  const isApple = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
  return <kbd className={className}>{isApple ? "⌘K" : "Ctrl K"}</kbd>;
}
