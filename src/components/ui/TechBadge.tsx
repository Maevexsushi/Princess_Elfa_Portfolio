export function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs text-muted">
      {label}
    </span>
  );
}
