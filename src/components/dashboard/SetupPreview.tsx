import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { riseDelay } from "@/components/ui/Panel";

/**
 * A still of the 3D room, opening onto the Setup page. A picture rather than
 * the live scene, so the overview never pays for loading three.js.
 */
export function SetupPreview({ className }: { className?: string }) {
  return (
    <Link
      href="/setup"
      className={`panel rise group relative block overflow-hidden ${className ?? ""}`}
      style={riseDelay(540)}
      aria-label="Step into my room — the 3D setup"
    >
      <div className="relative aspect-[16/9] bg-black sm:aspect-[21/8]">
        <Image
          src="/images/setup-preview.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 75vw"
          className="object-cover object-center transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
          <div className="text-white">
            <p className="eyebrow text-white/60">Setup · 3D</p>
            <p className="heading mt-1 text-xl sm:text-2xl">Step into my room</p>
            <p className="mt-0.5 hidden text-[13px] text-white/70 sm:block">
              It follows my day in Philippine time. Click around: things react.
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
