"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/cn";
import { LocalTime } from "./LocalTime";

type Point = { x: number; y: number; px: number; py: number };

/** Strap segments. More is smoother and costs almost nothing at this size. */
const SEGMENTS = 10;
const GRAVITY = 0.55;
const ITERATIONS = 14;

/** A deterministic barcode, so the card prints the same on every render. */
const BARCODE = Array.from("PRINCESSMAEDELFA2026", (ch, i) => {
  const code = ch.charCodeAt(0) + i * 7;
  return { width: 1 + (code % 3), gap: 1 + ((code >> 2) % 2) };
});

const STRAP_TEXT = "PRINCESS ELFA  ·  PORTFOLIO  ·  2026  ·  ".repeat(6);

/**
 * My ID badge on a lanyard. Grab it and it follows the pointer, swing it and
 * it swings back, fling it and it carries the throw; click it to turn it over.
 *
 * The physics is a small Verlet simulation. The strap is a chain of points
 * that may go slack but never stretch; the card is a rigid bar hung from the
 * last one, so its angle comes out of the motion rather than being animated.
 * Positions are written straight to the DOM each frame — React only
 * re-renders when the card flips — and the loop sleeps whenever the badge is
 * at rest or off screen.
 */
export function IdBadge({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const pinRef = useRef<SVGGElement>(null);
  const [flipped, setFlipped] = useState(false);
  const strapId = useId().replace(/:/g, "");

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    const pin = pinRef.current;
    if (!stage || !card || !strap || !pin) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const damping = reduceMotion ? 0.9 : 0.985;

    let width = stage.clientWidth;
    let cardH = card.offsetHeight;
    let ropeLen = Math.max(60, Math.min(170, stage.clientHeight - cardH - 56));
    let seg = ropeLen / SEGMENTS;
    let anchor = { x: width / 2, y: 0 };

    // rope[0] is the anchor; rope[SEGMENTS] is where the card is clipped on.
    // `tail` is the bottom of the card, one rigid card-length below.
    const rope: Point[] = [];
    const tail: Point = { x: 0, y: 0, px: 0, py: 0 };

    function layout(swing: number) {
      for (let i = 0; i <= SEGMENTS; i++) {
        const x = anchor.x + Math.sin(swing) * seg * i;
        const y = anchor.y + Math.cos(swing) * seg * i;
        rope[i] = { x, y, px: x, py: y };
      }
      const top = rope[SEGMENTS];
      tail.x = tail.px = top.x + Math.sin(swing) * cardH;
      tail.y = tail.py = top.y + Math.cos(swing) * cardH;
    }
    // Start hanging straight and still; it only moves once someone plays.
    layout(0);

    const drag = { active: false, x: 0, y: 0, along: 0, startX: 0, startY: 0, moved: false };
    let twist = 0;
    let frame = 0;
    let running = false;
    let restFrames = 0;
    let visible = true;

    function integrate(p: Point) {
      const vx = (p.x - p.px) * damping;
      const vy = (p.y - p.py) * damping;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + GRAVITY;
    }

    /** Pull two points to at most `len` apart (or exactly, if `rigid`). */
    function constrain(a: Point, b: Point, len: number, rigid: boolean, moveA: boolean) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      if (!rigid && d <= len) return;
      const diff = (d - len) / d;
      if (moveA) {
        a.x += dx * diff * 0.5;
        a.y += dy * diff * 0.5;
        b.x -= dx * diff * 0.5;
        b.y -= dy * diff * 0.5;
      } else {
        b.x -= dx * diff;
        b.y -= dy * diff;
      }
    }

    function step() {
      for (let i = 1; i <= SEGMENTS; i++) integrate(rope[i]);
      integrate(tail);

      for (let k = 0; k < ITERATIONS; k++) {
        rope[0].x = anchor.x;
        rope[0].y = anchor.y;
        for (let i = 0; i < SEGMENTS; i++) {
          constrain(rope[i], rope[i + 1], seg, false, i > 0);
        }
        constrain(rope[SEGMENTS], tail, cardH, true, true);

        if (drag.active) {
          // Hold the grabbed point under the pointer and let the card pivot
          // around it: shift the whole card, never rotate it by hand.
          const top = rope[SEGMENTS];
          const gx = top.x + (tail.x - top.x) * drag.along;
          const gy = top.y + (tail.y - top.y) * drag.along;
          const dx = drag.x - gx;
          const dy = drag.y - gy;
          top.x += dx;
          top.y += dy;
          tail.x += dx;
          tail.y += dy;
        }
      }
    }

    function render() {
      const top = rope[SEGMENTS];
      const angle = Math.atan2(-(tail.x - top.x), tail.y - top.y);
      // Sideways speed turns the card a little on its strap, as fabric does.
      const target = Math.max(-28, Math.min(28, (tail.x - tail.px) * 2.4));
      twist += (target - twist) * 0.12;

      const cardW = card!.offsetWidth;
      card!.style.transform = `translate3d(${top.x - cardW / 2}px, ${top.y}px, 0) rotate(${angle}rad) rotateY(${twist}deg)`;

      let d = `M ${rope[0].x} ${rope[0].y}`;
      for (let i = 1; i < SEGMENTS; i++) {
        const mx = (rope[i].x + rope[i + 1].x) / 2;
        const my = (rope[i].y + rope[i + 1].y) / 2;
        d += ` Q ${rope[i].x} ${rope[i].y} ${mx} ${my}`;
      }
      d += ` L ${top.x} ${top.y}`;
      strap!.setAttribute("d", d);
      pin!.setAttribute("transform", `translate(${anchor.x} ${anchor.y})`);
    }

    function loop() {
      step();
      render();
      const speed = Math.hypot(tail.x - tail.px, tail.y - tail.py);
      restFrames = !drag.active && speed < 0.015 ? restFrames + 1 : 0;
      if (restFrames > 90 || !visible) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    }

    function wake() {
      restFrames = 0;
      if (!running && visible) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    }

    function localPoint(e: PointerEvent) {
      const rect = stage!.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      // Keep the card within reach of the strap, so it can't be dragged off
      // into the rest of the page.
      const reach = ropeLen + cardH * drag.along + 30;
      const dx = x - anchor.x;
      const dy = y - anchor.y;
      const dist = Math.hypot(dx, dy);
      if (dist > reach) {
        x = anchor.x + (dx / dist) * reach;
        y = anchor.y + (dy / dist) * reach;
      }
      return { x, y };
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      card!.setPointerCapture(e.pointerId);
      const top = rope[SEGMENTS];
      // How far down the card's axis it was grabbed, 0 at the clip.
      const rect = stage!.getBoundingClientRect();
      const px = e.clientX - rect.left - top.x;
      const py = e.clientY - rect.top - top.y;
      const ax = tail.x - top.x;
      const ay = tail.y - top.y;
      drag.along = Math.max(0, Math.min(1, (px * ax + py * ay) / (cardH * cardH)));
      drag.active = true;
      drag.moved = false;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      const p = localPoint(e);
      drag.x = p.x;
      drag.y = p.y;
      card!.dataset.dragging = "true";
      wake();
    }

    function onPointerMove(e: PointerEvent) {
      if (!drag.active) return;
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 5) drag.moved = true;
      const p = localPoint(e);
      drag.x = p.x;
      drag.y = p.y;
    }

    function onPointerUp(e: PointerEvent) {
      if (!drag.active) return;
      drag.active = false;
      delete card!.dataset.dragging;
      if (card!.hasPointerCapture(e.pointerId)) card!.releasePointerCapture(e.pointerId);
      // A press that didn't travel is a click: turn the card over.
      if (!drag.moved) setFlipped((f) => !f);
      wake();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        // A keyboard nudge: give the card a push and let it swing.
        tail.px += e.key === "ArrowLeft" ? 14 : -14;
        wake();
      }
    }

    function onResize() {
      const nextWidth = stage!.clientWidth;
      const dx = nextWidth / 2 - anchor.x;
      width = nextWidth;
      cardH = card!.offsetHeight;
      ropeLen = Math.max(60, Math.min(170, stage!.clientHeight - cardH - 56));
      seg = ropeLen / SEGMENTS;
      anchor = { x: width / 2, y: 0 };
      for (const p of [...rope, tail]) {
        p.x += dx;
        p.px += dx;
      }
      wake();
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    visibility.observe(stage);

    const resize = new ResizeObserver(onResize);
    resize.observe(stage);

    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);
    card.addEventListener("keydown", onKeyDown);

    render();
    wake();

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      card.removeEventListener("pointerdown", onPointerDown);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointercancel", onPointerUp);
      card.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={cn("relative w-full select-none", className ?? "h-[540px] sm:h-[600px]")}
      style={{ perspective: "1400px" }}
    >
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <path
          ref={strapRef}
          id={strapId}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={20}
          strokeLinecap="round"
        />
        <text
          fill="var(--bg)"
          fontSize={8}
          letterSpacing={1.6}
          dominantBaseline="central"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <textPath href={`#${strapId}`} startOffset={6}>
            {STRAP_TEXT}
          </textPath>
        </text>
        {/* The hook the strap hangs from, sitting on the masthead rule */}
        <g ref={pinRef}>
          <rect x={-16} y={-5} width={32} height={10} rx={5} fill="var(--ink)" />
          <circle r={2.5} fill="var(--bg)" />
        </g>
      </svg>

      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`ID card for ${siteConfig.name}. Press Enter to turn it over, arrow keys to swing it, or drag it.`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className="group absolute top-0 left-0 h-[372px] w-[240px] cursor-grab touch-none rounded-2xl [transform-style:preserve-3d] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-3 active:cursor-grabbing sm:h-[400px] sm:w-[260px]"
        style={{ transformOrigin: "50% 0" }}
      >
        {/* Metal clip, holding the card to the strap */}
        <div
          aria-hidden
          className="absolute -top-4 left-1/2 z-10 h-7 w-11 -translate-x-1/2 rounded-md border border-black/20 bg-gradient-to-b from-[#e8e8e8] via-[#bdbdbd] to-[#8c8c8c]"
        >
          <div className="mx-auto mt-1.5 h-1.5 w-6 rounded-full bg-black/30" />
        </div>

        <div
          className="relative h-full w-full transition-transform duration-700 ease-out-quint [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
        >
          <CardFront />
          <CardBack />
        </div>
      </div>

      <p
        aria-hidden
        className="eyebrow pointer-events-none absolute inset-x-0 bottom-0 text-center text-ink-3"
      >
        Drag to swing · Click to flip
      </p>
    </div>
  );
}

const face =
  "absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-ink p-4 text-bg [backface-visibility:hidden] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] sm:p-[18px]";

function Punch() {
  return <div aria-hidden className="mx-auto h-2 w-12 shrink-0 rounded-full bg-bg/90" />;
}

function CardFront() {
  return (
    <div className={face}>
      <Punch />
      <div className="eyebrow mt-3 flex justify-between text-[9px] opacity-60">
        <span>Portfolio pass</span>
        <span>2026</span>
      </div>

      <div className="relative mt-2.5 aspect-square w-full overflow-hidden rounded-lg bg-bg/10">
        <Image
          src="/profilepic.jpg"
          alt={`Photo of ${siteConfig.name}`}
          fill
          priority
          draggable={false}
          sizes="260px"
          className="object-cover object-[50%_28%]"
        />
      </div>

      <p className="mt-3 text-[17px] leading-tight font-semibold tracking-tight">
        {siteConfig.name}
      </p>
      <p className="mt-1 text-[11px] leading-snug opacity-65">{siteConfig.title}</p>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div aria-hidden className="flex h-7 items-stretch">
          {BARCODE.map((bar, i) => (
            <span
              key={i}
              className="bg-bg"
              style={{ width: bar.width, marginRight: bar.gap }}
            />
          ))}
        </div>
        <span className="eyebrow text-right text-[9px] leading-tight opacity-60">
          BSIT
          <br />
          Cum Laude
        </span>
      </div>
    </div>
  );
}

function CardBack() {
  const rows = [
    { label: "Based in", value: siteConfig.location },
    { label: "Education", value: "BS Information Technology, Cum Laude 2026" },
    { label: "Focus", value: "Full-stack web apps with practical AI" },
    { label: "Status", value: "Open to work" },
  ];

  return (
    <div className={`${face} [transform:rotateY(180deg)]`}>
      <Punch />
      <p className="eyebrow mt-3 text-[9px] opacity-60">If found, please return to</p>
      <p className="mt-1.5 text-[13px] font-semibold break-all">{siteConfig.email}</p>

      <dl className="mt-4 flex flex-col">
        {rows.map((row) => (
          <div key={row.label} className="border-t border-bg/15 py-2">
            <dt className="eyebrow text-[8.5px] opacity-55">{row.label}</dt>
            <dd className="mt-0.5 text-[12px] leading-snug">{row.value}</dd>
          </div>
        ))}
        <div className="border-t border-bg/15 py-2">
          <dt className="eyebrow text-[8.5px] opacity-55">Local time</dt>
          <dd className="mt-0.5 text-[12px] tabular-nums">
            <LocalTime />
          </dd>
        </div>
      </dl>

      <p className="eyebrow mt-auto text-center text-[9px] opacity-50">Click to flip back</p>
    </div>
  );
}
