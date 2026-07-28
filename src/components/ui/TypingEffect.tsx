"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false, // server snapshot: assume motion is allowed
  );
}

export function TypingEffect({
  words,
  className = "",
  typingSpeed = 90,
  deletingSpeed = 45,
  pause = 1400,
}: {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const current = words[index % words.length];
    const atWordEnd = !deleting && subIndex === current.length;
    const atWordStart = deleting && subIndex === 0;

    const delay = atWordEnd ? pause : deleting ? deletingSpeed : typingSpeed;

    // All state transitions happen inside the async callback (never
    // synchronously in the effect body) to avoid cascading renders.
    const timeout = setTimeout(() => {
      if (atWordEnd) {
        setDeleting(true);
      } else if (atWordStart) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      } else {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words, reducedMotion, typingSpeed, deletingSpeed, pause]);

  const current = words[index % words.length];
  // When reduced motion is preferred, show the full first word statically.
  const text = reducedMotion ? words[0] : current.substring(0, subIndex);

  return (
    <span className={className}>
      {/* The animated text is decorative: announcing it would fire on every
          keystroke. Screen readers get the full list once, statically. */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="cursor-blink ml-1 inline-block h-[0.9em] w-[0.45em] translate-y-[0.05em] rounded-sm bg-current align-baseline" />
      </span>
    </span>
  );
}
