import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      data-tone="primary"
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-primary-strong px-5 py-20 text-center text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-white/10"
      />
      <div className="relative flex flex-col items-center gap-6">
        <p className="text-display font-extrabold leading-none">404</p>
        <h1 className="text-3xl font-extrabold">Page not found</h1>
        <p className="max-w-md text-lg leading-relaxed text-primary-soft">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className={buttonClass({ variant: "inverse" })}>
          Back home
        </Link>
      </div>
    </div>
  );
}
