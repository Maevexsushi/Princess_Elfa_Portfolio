export const TOAST_EVENT = "app:toast";

/** Fire-and-forget notice, rendered by the single <Toaster /> in the layout. */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}
