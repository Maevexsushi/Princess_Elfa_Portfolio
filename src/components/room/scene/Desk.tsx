"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  CanvasTexture,
  Color,
  InstancedMesh,
  Object3D,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type PointLight,
  type SpotLight,
  type Sprite,
  type SpriteMaterial,
} from "three";
import { drawAcadify, drawPortfolio, drawTerminal, EditorScreen, makeCanvas } from "./screens";
import {
  Box,
  C,
  damp,
  Glow,
  Interactive,
  KEY_COLS,
  KEY_ROWS,
  KEYBOARD,
  keyWorld,
  SPACE,
  useRoom,
  type TypingBusRef,
} from "./shared";

/* ---------------------------------------------------------------------------
   Keyboard: every key is real, and goes down when a finger hits it
--------------------------------------------------------------------------- */

const KEYS = KEY_COLS * KEY_ROWS;

function Keyboard({ busRef }: { busRef: TypingBusRef }) {
  const keys = useRef<InstancedMesh>(null);
  const space = useRef<Mesh>(null);
  const tmpRef = useRef({ o: new Object3D(), up: new Color("#e8e8e6"), down: new Color("#ffffff") });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const tmp = tmpRef.current;
    const bus = busRef.current;
    const mesh = keys.current;
    if (mesh) {
      for (let i = 0; i < KEYS; i++) {
        const pressed = t - bus.pressedAt[i] < 0.11;
        keyWorld(i, tmp.o.position);
        tmp.o.position.y -= 0.006 + (pressed ? 0.004 : 0);
        tmp.o.updateMatrix();
        mesh.setMatrixAt(i, tmp.o.matrix);
        mesh.setColorAt(i, pressed ? tmp.down : tmp.up);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    if (space.current) {
      keyWorld(SPACE, space.current.position);
      space.current.position.y -= 0.006 + (t - bus.pressedAt[SPACE] < 0.11 ? 0.004 : 0);
    }
  });

  const { center } = KEYBOARD;
  return (
    <group>
      <RoundedBox args={[0.44, 0.016, 0.16]} radius={0.006} position={[center.x, center.y - 0.006, center.z]} castShadow receiveShadow>
        <meshStandardMaterial color={C.charcoal} roughness={0.6} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, KEYS]} castShadow>
        <boxGeometry args={[0.024, 0.01, 0.024]} />
        <meshStandardMaterial roughness={0.55} />
      </instancedMesh>
      <mesh ref={space}>
        <boxGeometry args={[0.15, 0.01, 0.024]} />
        <meshStandardMaterial color="#e8e8e6" roughness={0.55} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Monitor: a live screen
--------------------------------------------------------------------------- */

function Monitor({
  variant,
  on,
  typing,
  busRef,
}: {
  variant: 0 | 1 | 2;
  on: boolean;
  typing: boolean;
  busRef: TypingBusRef;
}) {
  const screen = useMemo(() => {
    const c = makeCanvas(1024, 576);
    return { ...c, editor: new EditorScreen(c.ctx, 1024, 576) };
  }, []);
  const acc = useRef(1);
  const material = useRef<MeshBasicMaterial>(null);

  useFrame(({ clock }, dt) => {
    if (!on) return;
    const t = clock.getElapsedTime();
    screen.editor.update(busRef.current.strokes, t);
    acc.current += dt;
    if (acc.current < 1 / 15) return;
    acc.current = 0;
    if (variant === 0) screen.editor.draw(t, !typing);
    else if (variant === 1) drawAcadify(screen.ctx, 1024, 576, t);
    else drawPortfolio(screen.ctx, 1024, 576, t);
    const map = material.current?.map;
    if (map) map.needsUpdate = true;
  });

  return (
    <Interactive id="monitor" position={[1.5, 0.78, -2.8]}>
      {/* Stand */}
      <RoundedBox args={[0.26, 0.016, 0.17]} radius={0.006} position={[0, 0.008, 0]} castShadow>
        <meshStandardMaterial color={C.black} roughness={0.4} metalness={0.3} />
      </RoundedBox>
      <Box position={[0, 0.17, -0.035]} size={[0.045, 0.32, 0.03]} color={C.black} roughness={0.4} metalness={0.3} />
      {/* Body and bezel */}
      <RoundedBox args={[1.04, 0.6, 0.035]} radius={0.012} position={[0, 0.44, -0.018]} castShadow>
        <meshStandardMaterial color={C.black} roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.445, 0.0005]}>
        <planeGeometry args={[0.99, 0.556]} />
        {on ? (
          <meshBasicMaterial ref={material} map={screen.texture} color={[1.4, 1.4, 1.4]} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#0b0b0c" roughness={0.25} metalness={0.2} />
        )}
      </mesh>
      {/* Light bar */}
      <Box position={[0, 0.755, 0.01]} size={[0.42, 0.02, 0.03]} color={C.black} />
      {/* Two sticky notes on the bezel */}
      <mesh position={[0.43, 0.68, 0.002]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[0.07, 0.07]} />
        <meshStandardMaterial color="#f5e27a" roughness={0.9} />
      </mesh>
      <mesh position={[0.36, 0.69, 0.0025]} rotation={[0, 0, -0.06]}>
        <planeGeometry args={[0.065, 0.065]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {on && <Glow position={[0, 0.44, 0.08]} size={1.5} color="#9ec5ff" opacity={0.08} />}
    </Interactive>
  );
}

/* ---------------------------------------------------------------------------
   Laptop: a terminal running the dev server
--------------------------------------------------------------------------- */

function Laptop({ open, on }: { open: boolean; on: boolean }) {
  const lid = useRef<Group>(null);
  const { reducedMotion } = useRoom();
  const screen = useMemo(() => makeCanvas(512, 320), []);
  const acc = useRef(1);
  const material = useRef<MeshBasicMaterial>(null);

  useFrame(({ clock }, dt) => {
    if (lid.current) {
      lid.current.rotation.x = damp(lid.current.rotation.x, open ? -0.3 : Math.PI / 2 - 0.03, reducedMotion ? 40 : 6, dt);
    }
    if (!on || !open) return;
    acc.current += dt;
    if (acc.current < 0.25) return;
    acc.current = 0;
    drawTerminal(screen.ctx, 512, 320, clock.getElapsedTime());
    const map = material.current?.map;
    if (map) map.needsUpdate = true;
  });

  return (
    <Interactive id="laptop" position={[0.6, 0.78, -2.62]} rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.38, 0.016, 0.26]} radius={0.006} position={[0, 0.008, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.metal} roughness={0.35} metalness={0.6} />
      </RoundedBox>
      <Box position={[0, 0.0165, 0.02]} size={[0.32, 0.002, 0.12]} color="#2b2b2e" shadow={false} />
      <group ref={lid} position={[0, 0.016, -0.125]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[0.38, 0.25, 0.01]} radius={0.004} position={[0, 0.125, 0]} castShadow>
          <meshStandardMaterial color={C.metal} roughness={0.35} metalness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.127, 0.0055]}>
          <planeGeometry args={[0.35, 0.22]} />
          {on ? (
            <meshBasicMaterial ref={material} map={screen.texture} color={[1.3, 1.3, 1.3]} toneMapped={false} />
          ) : (
            <meshStandardMaterial color="#0d0d0e" roughness={0.3} />
          )}
        </mesh>
      </group>
    </Interactive>
  );
}

/* ---------------------------------------------------------------------------
   Desk lamp — a real spotlight, so it pools light on the desk
--------------------------------------------------------------------------- */

function DeskLamp({ on, dark }: { on: boolean; dark: number }) {
  const light = useRef<SpotLight>(null);
  const bulb = useRef<MeshStandardMaterial>(null);
  const target = useMemo(() => new Object3D(), []);

  useFrame((_, dt) => {
    const k = on ? 1 : 0;
    if (light.current) light.current.intensity = damp(light.current.intensity, k * (1.6 + 3.2 * dark), 10, dt);
    if (bulb.current) bulb.current.emissiveIntensity = damp(bulb.current.emissiveIntensity, k * 7, 10, dt);
  });

  return (
    <>
      <primitive object={target} position={[2.0, 0.78, -2.5]} />
      <Interactive id="deskLamp" position={[2.42, 0.78, -2.86]}>
        <mesh position={[0, 0.012, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.024, 24]} />
          <meshStandardMaterial color={C.black} roughness={0.4} metalness={0.4} />
        </mesh>
        <Box position={[0, 0.21, 0]} size={[0.02, 0.4, 0.02]} color={C.black} metalness={0.4} roughness={0.4} />
        <Box position={[-0.1, 0.41, 0.05]} size={[0.25, 0.02, 0.02]} rotation={[0, 0.45, -0.22]} color={C.black} metalness={0.4} roughness={0.4} />
        <mesh position={[-0.21, 0.36, 0.11]} rotation={[0.4, 0, 0.35]} castShadow>
          <coneGeometry args={[0.075, 0.12, 24, 1, true]} />
          <meshStandardMaterial color={C.black} side={2} roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[-0.205, 0.322, 0.112]}>
          <sphereGeometry args={[0.026, 14, 14]} />
          <meshStandardMaterial ref={bulb} color="#fff5e0" emissive="#ffcf8a" emissiveIntensity={0} />
        </mesh>
      </Interactive>
      <spotLight
        ref={light}
        position={[2.21, 1.08, -2.74]}
        target={target}
        angle={0.75}
        penumbra={0.7}
        distance={3}
        decay={2}
        color="#ffc98f"
        intensity={0}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.002}
      />
    </>
  );
}

/* ---------------------------------------------------------------------------
   Mug, headphones, and the small things on a desk
--------------------------------------------------------------------------- */

function Mug({ steaming }: { steaming: () => boolean }) {
  const puffs = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const on = steaming();
    puffs.current.forEach((p, i) => {
      if (!p) return;
      const phase = (t * 0.55 + i / 4) % 1;
      p.position.set(Math.sin((t + i) * 2) * 0.018, 0.1 + phase * 0.28, Math.cos((t + i) * 1.7) * 0.01);
      (p.material as MeshStandardMaterial).opacity = on ? 0.4 * Math.sin(phase * Math.PI) : 0;
      p.scale.setScalar(0.5 + phase * 1.1);
    });
  });

  return (
    <Interactive id="mug" position={[2.18, 0.78, -2.4]}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 20]} />
        <meshStandardMaterial color={C.white} roughness={0.35} />
      </mesh>
      <mesh position={[0.05, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.025, 0.008, 8, 16]} />
        <meshStandardMaterial color={C.white} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.096, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.04, 18]} />
        <meshStandardMaterial color="#3d2416" roughness={0.2} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(p) => void (puffs.current[i] = p)}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </Interactive>
  );
}

function useNoteTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 46px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♪", 32, 34);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
}

function Headphones({ music }: { music: boolean }) {
  const notes = useRef<(Sprite | null)[]>([]);
  const tex = useNoteTexture();
  const { reducedMotion } = useRoom();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    notes.current.forEach((n, i) => {
      if (!n) return;
      const phase = (t * 0.4 + i / 3) % 1;
      (n.material as SpriteMaterial).opacity = music && !reducedMotion ? Math.sin(phase * Math.PI) * 0.9 : 0;
      n.position.set(-0.05 + Math.sin(phase * 7 + i) * 0.06, 0.38 + phase * 0.4, 0.02);
      n.scale.setScalar(0.05 + phase * 0.03);
    });
  });
  return (
    <Interactive id="headphones" position={[0.18, 0.78, -2.85]}>
      <mesh position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 0.02, 18]} />
        <meshStandardMaterial color={C.black} roughness={0.5} />
      </mesh>
      <Box position={[0, 0.15, 0]} size={[0.015, 0.28, 0.015]} color={C.black} />
      {/* Headband and cups */}
      <mesh position={[0, 0.29, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.075, 0.012, 8, 20, Math.PI]} />
        <meshStandardMaterial color={C.charcoal} roughness={0.5} />
      </mesh>
      {[1, -1].map((s) => (
        <RoundedBox key={s} args={[0.035, 0.085, 0.07]} radius={0.015} position={[0, 0.22, 0.072 * s]} castShadow>
          <meshStandardMaterial color={C.charcoal} roughness={0.6} />
        </RoundedBox>
      ))}
      {[0, 1, 2].map((i) => (
        <sprite key={i} ref={(n) => void (notes.current[i] = n)}>
          <spriteMaterial map={tex} transparent opacity={0} depthWrite={false} />
        </sprite>
      ))}
    </Interactive>
  );
}

function DeskProps() {
  return (
    <group>
      {/* Desk mat */}
      <RoundedBox args={[0.9, 0.004, 0.36]} radius={0.002} position={[1.55, 0.782, -2.46]} receiveShadow>
        <meshStandardMaterial color="#2a2b2e" roughness={0.95} />
      </RoundedBox>
      {/* Mouse */}
      <RoundedBox args={[0.055, 0.025, 0.09]} radius={0.012} position={[1.86, 0.795, -2.44]} castShadow>
        <meshStandardMaterial color={C.black} roughness={0.4} />
      </RoundedBox>
      {/* Notebook and pen */}
      <group position={[0.95, 0.782, -2.44]} rotation={[0, -0.25, 0]}>
        <Box position={[0, 0.008, 0]} size={[0.16, 0.016, 0.22]} color="#1f1f22" />
        <Box position={[0, 0.0165, 0]} size={[0.15, 0.002, 0.21]} color="#f3efe6" shadow={false} />
        <Box position={[0.04, 0.022, 0.02]} size={[0.008, 0.008, 0.15]} rotation={[0, 0.3, 0]} color={C.gold} />
      </group>
      {/* Phone, face down */}
      <RoundedBox args={[0.07, 0.008, 0.145]} radius={0.006} position={[2.32, 0.786, -2.6]} rotation={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#202024" roughness={0.3} />
      </RoundedBox>
      {/* A small succulent */}
      <group position={[2.05, 0.78, -2.85]}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.032, 0.07, 14]} />
          <meshStandardMaterial color={C.white} roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.sin(i * 1.3) * 0.018, 0.085, Math.cos(i * 1.3) * 0.018]} rotation={[Math.cos(i) * 0.5, i, Math.sin(i) * 0.5]} castShadow>
            <coneGeometry args={[0.014, 0.05, 6]} />
            <meshStandardMaterial color={C.plantLight} roughness={0.7} flatShading />
          </mesh>
        ))}
      </group>
      {/* Bin under the desk */}
      <mesh position={[0.32, 0.13, -2.62]} castShadow receiveShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.26, 18, 1, true]} />
        <meshStandardMaterial color={C.charcoal} roughness={0.7} side={2} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Desk and chair
--------------------------------------------------------------------------- */

export function Desk({
  screenVariant,
  screenOn,
  typing,
  laptopOpen,
  deskLamp,
  music,
  dark,
  steaming,
  busRef,
}: {
  screenVariant: 0 | 1 | 2;
  screenOn: boolean;
  typing: boolean;
  laptopOpen: boolean;
  deskLamp: boolean;
  music: boolean;
  dark: number;
  steaming: () => boolean;
  busRef: TypingBusRef;
}) {
  const screenLight = useRef<PointLight>(null);
  useFrame((_, dt) => {
    if (screenLight.current) {
      screenLight.current.intensity = damp(screenLight.current.intensity, screenOn ? 0.4 + 1.6 * dark : 0, 6, dt);
    }
  });

  return (
    <group>
      {/* Desktop and legs */}
      <RoundedBox args={[2.55, 0.04, 0.72]} radius={0.01} position={[1.33, 0.76, -2.62]} castShadow receiveShadow>
        <meshStandardMaterial color={C.white} roughness={0.5} />
      </RoundedBox>
      {[
        [0.1, -2.92],
        [2.56, -2.92],
        [0.1, -2.32],
        [2.56, -2.32],
      ].map(([x, z], i) => (
        <Box key={i} position={[x, 0.37, z]} size={[0.04, 0.74, 0.04]} color={C.black} metalness={0.3} roughness={0.5} />
      ))}
      <Box position={[1.33, 0.7, -2.92]} size={[2.4, 0.06, 0.02]} color={C.black} metalness={0.3} roughness={0.5} />

      <DeskProps />
      <Keyboard busRef={busRef} />
      <Monitor variant={screenVariant} on={screenOn} typing={typing} busRef={busRef} />
      <Laptop open={laptopOpen} on={screenOn} />
      <DeskLamp on={deskLamp} dark={dark} />
      <Mug steaming={steaming} />
      <Headphones music={music} />
      <pointLight ref={screenLight} position={[1.5, 1.22, -2.5]} distance={2.2} decay={2} color="#cfe0ff" intensity={0} />
    </group>
  );
}

export function Chair({ spins, spinRef }: { spins: number; spinRef: { current: number } }) {
  const ref = useRef<Group>(null);
  const { reducedMotion } = useRoom();
  useFrame((_, dt) => {
    spinRef.current = damp(spinRef.current, spins * Math.PI * 2, reducedMotion ? 40 : 3, dt);
    if (ref.current) ref.current.rotation.y = spinRef.current;
  });

  return (
    <Interactive id="chair" position={[1.42, 0, -1.98]}>
      <group ref={ref}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <group key={i}>
              <Box position={[Math.sin(a) * 0.15, 0.06, Math.cos(a) * 0.15]} size={[0.035, 0.03, 0.3]} rotation={[0, a, 0]} color={C.black} metalness={0.3} roughness={0.5} />
              <mesh position={[Math.sin(a) * 0.29, 0.025, Math.cos(a) * 0.29]} castShadow>
                <sphereGeometry args={[0.025, 10, 10]} />
                <meshStandardMaterial color={C.black} />
              </mesh>
            </group>
          );
        })}
        <mesh position={[0, 0.27, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.026, 0.38, 12]} />
          <meshStandardMaterial color={C.metal} metalness={0.7} roughness={0.3} />
        </mesh>
        <RoundedBox args={[0.5, 0.075, 0.48]} radius={0.035} position={[0, 0.48, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={C.charcoal} roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[0.46, 0.6, 0.06]} radius={0.04} position={[0, 0.86, 0.26]} rotation={[-0.08, 0, 0]} castShadow>
          <meshStandardMaterial color={C.charcoal} roughness={0.95} />
        </RoundedBox>
        <Box position={[0, 0.62, 0.27]} size={[0.06, 0.2, 0.03]} color={C.black} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Box position={[0.27 * s, 0.56, 0.06]} size={[0.025, 0.14, 0.025]} color={C.black} />
            <RoundedBox args={[0.06, 0.025, 0.24]} radius={0.01} position={[0.27 * s, 0.64, 0.02]} castShadow>
              <meshStandardMaterial color={C.black} roughness={0.7} />
            </RoundedBox>
          </group>
        ))}
      </group>
    </Interactive>
  );
}
