import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once
 * hydrated. Useful for theme-aware UI that must avoid hydration mismatches
 * without calling setState inside an effect.
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
