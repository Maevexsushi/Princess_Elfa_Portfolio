"use client";

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, MathUtils, SRGBColorSpace, Vector3, type Group } from "three";
import type { RoomItemId } from "@/data/room";

export const damp = MathUtils.damp;

/* ---------------------------------------------------------------------------
   Context: callbacks and preferences every object needs
--------------------------------------------------------------------------- */

export type RoomCtx = {
  onItem: (id: RoomItemId) => void;
  onHover: (id: RoomItemId | null) => void;
  reducedMotion: boolean;
};

export const RoomContext = createContext<RoomCtx | null>(null);
export const useRoom = () => useContext(RoomContext)!;

/* ---------------------------------------------------------------------------
   Typing: the avatar's hands write here; the keyboard and monitor read it
--------------------------------------------------------------------------- */

export const KEY_COLS = 14;
export const KEY_ROWS = 4;
/** Keys plus the space bar (the last index). */
export const KEY_COUNT = KEY_COLS * KEY_ROWS + 1;
export const SPACE = KEY_COUNT - 1;

/** Keyboard placement in the room, shared by the keyboard and the hands. */
export const KEYBOARD = {
  center: new Vector3(1.5, 0.796, -2.43),
  pitch: 0.029,
};

/** World position of the top of a key. */
export function keyWorld(index: number, out = new Vector3()) {
  if (index === SPACE) return out.set(KEYBOARD.center.x, KEYBOARD.center.y + 0.012, KEYBOARD.center.z + KEYBOARD.pitch * 2.05);
  const col = index % KEY_COLS;
  const row = Math.floor(index / KEY_COLS);
  return out.set(
    KEYBOARD.center.x + (col - (KEY_COLS - 1) / 2) * KEYBOARD.pitch + row * 0.006,
    KEYBOARD.center.y + 0.012,
    KEYBOARD.center.z + (row - 1.5) * KEYBOARD.pitch - 0.012,
  );
}

export type TypingBus = {
  /** Total keystrokes so far — the monitor reveals code as this grows. */
  strokes: number;
  /** Clock time each key was last pressed. */
  pressedAt: Float32Array;
};

/** Shared, mutable typing state — a ref, written and read inside frame loops. */
export type TypingBusRef = { current: TypingBus };

export function useTypingBus(): TypingBusRef {
  return useRef<TypingBus>({ strokes: 0, pressedAt: new Float32Array(KEY_COUNT).fill(-10) });
}

/** Math.random, kept out of frame callbacks so they read as pure to the linter. */
export const rand = () => Math.random();

/* ---------------------------------------------------------------------------
   Primitives
--------------------------------------------------------------------------- */

export function Box({
  position,
  size,
  color,
  rotation,
  shadow = true,
  roughness = 0.85,
  metalness = 0,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  shadow?: boolean;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

/** Hover grows the object a touch and names it; click activates it. */
export function Interactive({
  id,
  children,
  ...group
}: {
  id: RoomItemId;
  children: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { onItem, onHover, reducedMotion } = useRoom();
  const ref = useRef<Group>(null);
  const hovered = useRef(false);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const s = damp(ref.current.scale.x, hovered.current ? 1.06 : 1, reducedMotion ? 30 : 14, dt);
    ref.current.scale.setScalar(s);
  });

  return (
    <group
      ref={ref}
      {...group}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hovered.current = true;
        document.body.style.cursor = "pointer";
        onHover(id);
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = "";
        onHover(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onItem(id);
      }}
    >
      {children}
    </group>
  );
}

/** Seconds since `counter` last changed (Infinity before the first change). */
export function useSinceChange(counter: number) {
  const changedAt = useRef(-Infinity);
  const first = useRef(true);
  const clock = useThree((s) => s.clock);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    changedAt.current = clock.getElapsedTime();
  }, [counter, clock]);
  return () => clock.getElapsedTime() - changedAt.current;
}

/* ---------------------------------------------------------------------------
   Glow: a soft additive halo, for light that should read as light
--------------------------------------------------------------------------- */

let glowTexture: CanvasTexture | null = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexture = new CanvasTexture(c);
  glowTexture.colorSpace = SRGBColorSpace;
  return glowTexture;
}

export function Glow({
  position,
  size,
  color,
  opacity,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  opacity: number;
}) {
  const map = useMemo(() => getGlowTexture(), []);
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

/* ---------------------------------------------------------------------------
   Palette — warm neutrals, so the room sits with a black-and-white site
--------------------------------------------------------------------------- */

export const C = {
  wall: "#ece8e1",
  wallSide: "#e2ddd4",
  base: "#1c1c1e",
  wood: "#b4855c",
  woodDark: "#7a573c",
  white: "#f5f5f3",
  black: "#1b1b1d",
  charcoal: "#2a2b2f",
  metal: "#c4c4c6",
  sheet: "#f3f1ec",
  blanket: "#34363c",
  knit: "#cdb999",
  skin: "#e4b18c",
  hair: "#121212",
  hoodie: "#efeeea",
  pants: "#2c2c30",
  plant: "#4d7a49",
  plantLight: "#679a5d",
  pot: "#b5643c",
  gold: "#d4a72c",
};
