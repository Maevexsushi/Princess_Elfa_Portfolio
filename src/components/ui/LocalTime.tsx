"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/data/siteConfig";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: siteConfig.timeZone,
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

/**
 * The time where I am, so a visitor abroad can tell at a glance whether a
 * message will land in working hours. The server renders a placeholder — it
 * cannot know when the page will be read — and the client fills it in.
 */
export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(new Date()),
    () => null,
  );

  return (
    <time className={className} suppressHydrationWarning>
      {time ?? "--:--"} {siteConfig.timeZoneLabel}
    </time>
  );
}
