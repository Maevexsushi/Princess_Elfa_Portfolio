import { useEffect, useState } from "react";

/**
 * The id of the section currently being read.
 *
 * "Being read" means crossing a line 35% of the way down the viewport — the
 * place the eye rests — rather than merely being visible, which would mark a
 * section active while only its last few pixels peek in at the top.
 */
export function useActiveSection(ids: string[], enabled = true) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled) return;
    const elements = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -64% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}
