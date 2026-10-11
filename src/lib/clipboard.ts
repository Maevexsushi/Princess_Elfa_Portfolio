import { toast } from "./toast";

export async function copyText(text: string, confirmation: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(confirmation);
  } catch {
    toast("Couldn't copy — select the text instead.");
  }
}
