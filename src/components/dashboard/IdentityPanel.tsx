import { IdBadge } from "@/components/ui/IdBadge";
import { riseDelay } from "@/components/ui/Panel";

/** The ID badge hangs from this panel's header rule. */
export function IdentityPanel({ className }: { className?: string }) {
  return (
    <section
      aria-label="ID badge"
      className={`panel rise relative z-10 flex flex-col ${className ?? ""}`}
      style={riseDelay(0)}
    >
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <h2 className="text-[13px] font-medium text-ink">Identity</h2>
        <span className="eyebrow text-ink-3">Pass · 2026</span>
      </header>
      <IdBadge className="h-[520px] sm:h-[560px]" />
    </section>
  );
}
