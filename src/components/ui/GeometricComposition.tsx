import Image from "next/image";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/data/siteConfig";

/**
 * Hero artwork: a portrait framed by solid flat shapes.
 *
 * Depth is implied purely by overlap and scale — every shape is a single solid
 * fill or a hard 4px stroke, with no shadow, blur or gradient. Sizes and
 * offsets are percentages of a square container so the composition scales as
 * one unit instead of re-flowing at breakpoints.
 *
 * Painted back-to-front: ring, amber square, portrait, emerald circle, markers
 * — so the emerald circle crops the portrait's corner and the square sits
 * behind its edge.
 */
export function GeometricComposition({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full max-w-md", className)}>
      {/* Hard-stroke ring — sets the outer edge of the composition */}
      <div
        aria-hidden
        className="absolute right-[4%] bottom-[6%] h-[38%] w-[38%] rounded-full border-4 border-white"
      />

      {/* Rotated amber square — the one shape off the orthogonal grid */}
      <div
        aria-hidden
        className="absolute top-[2%] right-0 h-[36%] w-[36%] rotate-12 rounded-lg bg-accent"
      />

      {/* Portrait, set in a white block so it reads as a printed plate */}
      <div className="absolute top-[5%] left-[7%] h-[90%] w-[64%] rounded-lg bg-white p-3">
        <div className="relative h-full w-full overflow-hidden rounded-md bg-muted">
          <Image
            src="/profilepic.jpg"
            alt={`${siteConfig.name}, ${siteConfig.title}`}
            fill
            sizes="(max-width: 1024px) 65vw, 320px"
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Emerald circle, cropping the portrait's lower corner */}
      <div
        aria-hidden
        className="absolute bottom-[4%] left-[2%] h-[24%] w-[24%] rounded-full bg-secondary"
      />

      {/* Three solid markers, echoing the grid the layout is built on */}
      <div aria-hidden className="absolute top-[2%] left-[2%] flex gap-2">
        <span className="h-3 w-3 rounded-sm bg-white" />
        <span className="h-3 w-3 rounded-sm bg-white" />
        <span className="h-3 w-3 rounded-sm bg-accent" />
      </div>
    </div>
  );
}
