import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="panel flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className="eyebrow text-ink-3">Error 404</p>
      <h1 className="heading text-[1.75rem] text-ink">Nothing here</h1>
      <p className="max-w-sm leading-relaxed text-ink-2">
        The page you were looking for doesn&apos;t exist, or it has moved.
      </p>
      <Link href="/" className={buttonClass({ size: "md", className: "mt-4" })}>
        <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
        Back to the overview
      </Link>
    </div>
  );
}
