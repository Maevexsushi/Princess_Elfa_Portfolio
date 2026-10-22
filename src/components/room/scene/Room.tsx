"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RepeatWrapping, SRGBColorSpace, type Group, type MeshBasicMaterial, type MeshStandardMaterial, type PointLight } from "three";
import { posterMottos } from "@/data/room";
import { canvasTexture, drawClock, drawDiploma, drawPoster, drawWindowView } from "../textures";
import { Box, C, damp, Glow, Interactive, useRoom, useSinceChange } from "./shared";
import { Duvet, Moonlight } from "./Sleeper";

export const WINDOW = { x0: 0.5, x1: 2.1, y0: 1.3, y1: 2.4 };
const WALL_H = 3;
export const BED = { x: -2.37, z: -1.92 };

/* ---------------------------------------------------------------------------
   Shell: floor, walls with a window opening, skirting, rug
--------------------------------------------------------------------------- */

function useFloorTexture() {
  return useMemo(() => {
    const { texture, paint } = canvasTexture(1024, 1024);
    paint((ctx, w, h) => {
      const rows = 12;
      const rh = h / rows;
      let seed = 21;
      const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      for (let r = 0; r < rows; r++) {
        let x = -rand() * 300;
        while (x < w) {
          const len = 260 + rand() * 260;
          const tone = 0.86 + rand() * 0.2;
          ctx.fillStyle = `rgb(${Math.round(180 * tone)},${Math.round(133 * tone)},${Math.round(92 * tone)})`;
          ctx.fillRect(x, r * rh, len, rh);
          // grain
          ctx.strokeStyle = "rgba(90,55,30,0.12)";
          ctx.lineWidth = 1;
          for (let g = 0; g < 5; g++) {
            const gy = r * rh + 6 + rand() * (rh - 12);
            ctx.beginPath();
            ctx.moveTo(x, gy);
            ctx.bezierCurveTo(x + len * 0.3, gy + 3, x + len * 0.6, gy - 3, x + len, gy);
            ctx.stroke();
          }
          ctx.fillStyle = "rgba(40,25,15,0.45)";
          ctx.fillRect(x, r * rh, 2, rh);
          x += len;
        }
        ctx.fillStyle = "rgba(40,25,15,0.5)";
        ctx.fillRect(0, r * rh, w, 2);
      }
    });
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    return texture;
  }, []);
}

function useRugTexture() {
  return useMemo(() => {
    const { texture, paint } = canvasTexture(512, 360);
    paint((ctx, w, h) => {
      ctx.fillStyle = "#ece7de";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#1d1d1f";
      ctx.lineWidth = 10;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, w - 72, h - 72);
      // A row of diamonds through the middle
      ctx.fillStyle = "#1d1d1f";
      for (let i = 0; i < 7; i++) {
        const cx = 90 + i * ((w - 180) / 6);
        ctx.beginPath();
        ctx.moveTo(cx, h / 2 - 26);
        ctx.lineTo(cx + 22, h / 2);
        ctx.lineTo(cx, h / 2 + 26);
        ctx.lineTo(cx - 22, h / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "#b5643c";
      ctx.fillRect(60, h / 2 - 2, w - 120, 4);
      // Fringe texture
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
    });
    return texture;
  }, []);
}

function Shell() {
  const floor = useFloorTexture();
  const rug = useRugTexture();
  const backZ = -3.06;
  const { x0, x1, y0, y1 } = WINDOW;

  return (
    <group>
      {/* Floor slab and boards */}
      <Box position={[-0.06, -0.17, -0.06]} size={[6.12, 0.3, 6.12]} color={C.base} />
      <mesh position={[-0.06, 0.001, -0.06]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.12, 6.12]} />
        <meshStandardMaterial map={floor} roughness={0.62} />
      </mesh>

      {/* Back wall, built around the window opening */}
      <Box position={[(-3.12 + x0) / 2, WALL_H / 2, backZ]} size={[x0 + 3.12, WALL_H, 0.12]} color={C.wall} roughness={0.95} />
      <Box position={[(x1 + 3) / 2, WALL_H / 2, backZ]} size={[3 - x1, WALL_H, 0.12]} color={C.wall} roughness={0.95} />
      <Box position={[(x0 + x1) / 2, y0 / 2, backZ]} size={[x1 - x0, y0, 0.12]} color={C.wall} roughness={0.95} />
      <Box position={[(x0 + x1) / 2, (y1 + WALL_H) / 2, backZ]} size={[x1 - x0, WALL_H - y1, 0.12]} color={C.wall} roughness={0.95} />
      {/* Left wall */}
      <Box position={[-3.06, WALL_H / 2, -0.06]} size={[0.12, WALL_H, 6.12]} color={C.wallSide} roughness={0.95} />
      {/* Wall caps */}
      <Box position={[-0.06, WALL_H + 0.005, -3.06]} size={[6.12, 0.01, 0.12]} color="#d5d0c6" shadow={false} />
      <Box position={[-3.06, WALL_H + 0.005, -0.06]} size={[0.12, 0.01, 6.12]} color="#d5d0c6" shadow={false} />

      {/* Skirting */}
      <Box position={[0, 0.05, -2.995]} size={[6, 0.1, 0.012]} color={C.white} shadow={false} />
      <Box position={[-2.995, 0.05, 0]} size={[0.012, 0.1, 6]} color={C.white} shadow={false} />

      {/* Window frame, mullions and a shallow sill that stays clear of the desk */}
      {[
        { p: [(x0 + x1) / 2, y0, -3.0], s: [x1 - x0 + 0.08, 0.05, 0.08] },
        { p: [(x0 + x1) / 2, y1, -3.0], s: [x1 - x0 + 0.08, 0.05, 0.08] },
        { p: [x0, (y0 + y1) / 2, -3.0], s: [0.05, y1 - y0, 0.08] },
        { p: [x1, (y0 + y1) / 2, -3.0], s: [0.05, y1 - y0, 0.08] },
        { p: [(x0 + x1) / 2, (y0 + y1) / 2, -3.02], s: [0.025, y1 - y0, 0.03] },
        { p: [(x0 + x1) / 2, (y0 + y1) / 2 + 0.12, -3.02], s: [x1 - x0, 0.025, 0.03] },
      ].map((f, i) => (
        <Box key={i} position={f.p as [number, number, number]} size={f.s as [number, number, number]} color={C.black} shadow={false} roughness={0.5} />
      ))}
      <Box position={[(x0 + x1) / 2, y0 - 0.035, -2.96]} size={[x1 - x0 + 0.16, 0.03, 0.08]} color={C.white} />

      {/* Rug */}
      <mesh position={[0.3, 0.008, 0.45]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.7, 1.9]} />
        <meshStandardMaterial map={rug} roughness={1} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Window view, rain and curtains
--------------------------------------------------------------------------- */

function WindowView({ hour, cloudy, rain }: { hour: number; cloudy: number; rain: boolean }) {
  const view = useMemo(() => canvasTexture(640, 440), []);
  const rainTex = useMemo(() => {
    const t = canvasTexture(128, 128);
    t.paint((ctx, w, h) => {
      ctx.strokeStyle = "rgba(220,230,255,0.6)";
      ctx.lineWidth = 1.5;
      let seed = 5;
      const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      for (let i = 0; i < 26; i++) {
        const x = rand() * w;
        const y = rand() * h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + 14);
        ctx.stroke();
      }
    });
    t.texture.wrapS = t.texture.wrapT = RepeatWrapping;
    t.texture.repeat.set(3, 2);
    return t.texture;
  }, []);
  const rainMat = useRef<MeshBasicMaterial>(null);

  const bucket = Math.floor(hour * 6);
  useEffect(() => {
    view.paint(drawWindowView(bucket / 6, cloudy));
  }, [bucket, cloudy, view]);

  useFrame((_, dt) => {
    const map = rainMat.current?.map;
    if (map) map.offset.y += dt * 2.2;
  });

  const { x0, x1, y0, y1 } = WINDOW;
  return (
    <group position={[(x0 + x1) / 2, (y0 + y1) / 2, 0]}>
      <mesh position={[0, 0, -3.1]}>
        <planeGeometry args={[x1 - x0, y1 - y0]} />
        <meshBasicMaterial map={view.texture} toneMapped={false} />
      </mesh>
      {rain && (
        <mesh position={[0, 0, -3.05]}>
          <planeGeometry args={[x1 - x0, y1 - y0]} />
          <meshBasicMaterial ref={rainMat} map={rainTex} transparent toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, 0, -3.025]}>
        <planeGeometry args={[x1 - x0, y1 - y0]} />
        <meshStandardMaterial color="#cfe3ff" transparent opacity={0.07} roughness={0.05} />
      </mesh>
    </group>
  );
}

function Curtains({ open }: { open: boolean }) {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const { reducedMotion } = useRoom();
  const { x0, x1, y0, y1 } = WINDOW;
  const h = y1 - y0 + 0.4;
  const cy = (y0 + y1) / 2 + 0.14;

  useFrame((_, dt) => {
    const k = reducedMotion ? 40 : 5;
    const width = open ? 0.22 : (x1 - x0) / 2 + 0.08;
    for (const [ref, side] of [
      [left, -1],
      [right, 1],
    ] as const) {
      if (!ref.current) continue;
      ref.current.scale.x = damp(ref.current.scale.x, width, k, dt);
      const edge = side < 0 ? x0 - 0.14 : x1 + 0.14;
      ref.current.position.x = side < 0 ? edge + ref.current.scale.x / 2 : edge - ref.current.scale.x / 2;
    }
  });

  const panel = (
    <mesh castShadow>
      <boxGeometry args={[1, h, 0.04]} />
      <meshStandardMaterial color="#dcd5c9" roughness={1} />
    </mesh>
  );

  return (
    <Interactive id="curtains">
      <group position={[0, cy, -2.93]}>
        <mesh position={[(x0 + x1) / 2, h / 2 + 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, x1 - x0 + 0.65, 10]} />
          <meshStandardMaterial color={C.black} metalness={0.5} roughness={0.4} />
        </mesh>
        <group ref={left} position={[x0 - 0.03, 0, 0]} scale={[0.22, 1, 1]}>
          {panel}
        </group>
        <group ref={right} position={[x1 + 0.03, 0, 0]} scale={[0.22, 1, 1]}>
          {panel}
        </group>
      </group>
    </Interactive>
  );
}

/* ---------------------------------------------------------------------------
   Bed corner
--------------------------------------------------------------------------- */

function Bed({ sleeping }: { sleeping: boolean }) {
  return (
    <group>
      {/* Frame and legs */}
      <RoundedBox args={[1.25, 0.22, 2.15]} radius={0.02} position={[BED.x, 0.2, BED.z]} castShadow receiveShadow>
        <meshStandardMaterial color={C.wood} roughness={0.7} />
      </RoundedBox>
      {[
        [-0.56, -0.98],
        [0.56, -0.98],
        [-0.56, 0.98],
        [0.56, 0.98],
      ].map(([dx, dz], i) => (
        <Box key={i} position={[BED.x + dx, 0.045, BED.z + dz]} size={[0.06, 0.09, 0.06]} color={C.woodDark} />
      ))}
      <RoundedBox args={[1.25, 0.95, 0.07]} radius={0.025} position={[BED.x, 0.5, -2.965]} castShadow>
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </RoundedBox>
      {/* Mattress, then the duvet draped over it (and over her, asleep) */}
      <RoundedBox args={[1.18, 0.18, 2.05]} radius={0.05} position={[BED.x, 0.4, BED.z + 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color={C.sheet} roughness={0.95} />
      </RoundedBox>
      <Duvet sleeping={sleeping} />
      {/* Pillows */}
      <RoundedBox args={[0.5, 0.12, 0.32]} radius={0.055} position={[BED.x - 0.27, 0.56, -2.72]} rotation={[0.25, 0.05, 0]} castShadow>
        <meshStandardMaterial color={C.white} roughness={1} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.12, 0.32]} radius={0.055} position={[BED.x + 0.27, 0.56, -2.72]} rotation={[0.25, -0.05, 0]} castShadow>
        <meshStandardMaterial color={C.white} roughness={1} />
      </RoundedBox>
    </group>
  );
}

function Photo() {
  const tex = useTexture("/profilepic.jpg", (t) => {
    t.colorSpace = SRGBColorSpace;
  });
  return (
    <Interactive id="photo" position={[-1.28, 0.5, -2.8]} rotation={[0, -0.35, 0]}>
      <group rotation={[-0.12, 0, 0]}>
        <Box position={[0, 0.11, 0]} size={[0.16, 0.21, 0.015]} color={C.black} roughness={0.4} />
        <mesh position={[0, 0.11, 0.008]}>
          <planeGeometry args={[0.13, 0.18]} />
          <meshStandardMaterial map={tex} roughness={0.6} />
        </mesh>
        <Box position={[0, 0.06, -0.04]} size={[0.02, 0.12, 0.01]} rotation={[0.5, 0, 0]} color={C.black} />
      </group>
    </Interactive>
  );
}

function Nightstand({ lampOn, dark }: { lampOn: boolean; dark: number }) {
  const light = useRef<PointLight>(null);
  const shade = useRef<MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (light.current) light.current.intensity = damp(light.current.intensity, lampOn ? 1.2 + 2.2 * dark : 0, 8, dt);
    if (shade.current) shade.current.emissiveIntensity = damp(shade.current.emissiveIntensity, lampOn ? 2.2 : 0, 8, dt);
  });
  return (
    <group>
      <group position={[-1.42, 0, -2.74]}>
        <RoundedBox args={[0.46, 0.5, 0.4]} radius={0.02} position={[0, 0.25, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={C.woodDark} roughness={0.7} />
        </RoundedBox>
        <Box position={[0, 0.32, 0.201]} size={[0.38, 0.005, 0.004]} color="#5c4130" shadow={false} />
        <Box position={[0, 0.36, 0.205]} size={[0.06, 0.012, 0.012]} color={C.gold} metalness={0.6} roughness={0.3} />
        {/* A book */}
        <Box position={[0.05, 0.512, 0.08]} size={[0.16, 0.025, 0.22]} rotation={[0, 0.2, 0]} color="#2f3b52" />
        <Interactive id="bedLamp" position={[-0.08, 0.5, -0.06]}>
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.06, 0.14, 18]} />
            <meshStandardMaterial color={C.white} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.115, 0.16, 24, 1, true]} />
            <meshStandardMaterial ref={shade} color="#f3e9d6" emissive="#ffc983" emissiveIntensity={0} side={2} roughness={1} />
          </mesh>
          {lampOn && <Glow position={[0, 0.24, 0]} size={0.9} color="#ffcf8a" opacity={0.25 + 0.3 * dark} />}
        </Interactive>
        <pointLight ref={light} position={[-0.08, 0.8, 0]} distance={3} decay={2} color="#ffcf9a" intensity={0} />
      </group>
      <Photo />
    </group>
  );
}

function Shelf({ tosses }: { tosses: number }) {
  const cap = useRef<Group>(null);
  const since = useSinceChange(tosses);
  const { reducedMotion } = useRoom();

  useFrame(() => {
    if (!cap.current) return;
    const t = since();
    const dur = 1.2;
    if (t < dur && !reducedMotion) {
      const p = t / dur;
      cap.current.position.y = 0.05 + 4 * 0.75 * p * (1 - p);
      cap.current.rotation.y = 0.4 + p * Math.PI * 4;
      cap.current.rotation.x = Math.sin(p * Math.PI) * 0.6;
    } else {
      cap.current.position.y = 0.05;
      cap.current.rotation.set(0, 0.4, 0);
    }
  });

  const books = [
    ["#2f3b52", 0.26],
    ["#8c3b2f", 0.22],
    ["#e8e2d4", 0.28],
    ["#1b1b1c", 0.24],
    ["#556b4f", 0.2],
    ["#c9a35a", 0.25],
    ["#f2f2f0", 0.23],
  ] as const;

  return (
    <group position={[-2.87, 1.72, -1.9]}>
      <Box position={[0, 0, 0]} size={[0.26, 0.03, 1.3]} color={C.woodDark} />
      {[-0.5, 0.5].map((z) => (
        <Box key={z} position={[0.05, -0.06, z]} size={[0.14, 0.1, 0.02]} color={C.black} metalness={0.4} roughness={0.4} />
      ))}
      {books.map(([color, h], i) => (
        <Box
          key={i}
          position={[0, 0.015 + h / 2, -0.58 + i * 0.07]}
          size={[0.18, h, 0.06]}
          rotation={i === 6 ? [0.22, 0, 0] : undefined}
          color={color}
        />
      ))}
      {/* A trailing plant */}
      <group position={[0.02, 0.015, 0.05]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
          <meshStandardMaterial color={C.white} roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[0.06 + (i % 2) * 0.02, 0.08 - i * 0.07, -0.04 + Math.sin(i) * 0.05]} castShadow>
            <icosahedronGeometry args={[0.035 - i * 0.002, 0]} />
            <meshStandardMaterial color={i % 2 ? C.plantLight : C.plant} flatShading roughness={0.8} />
          </mesh>
        ))}
      </group>
      <Interactive id="cap" position={[0, 0.015, 0.4]}>
        <group ref={cap} position={[0, 0.05, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.07, 18]} />
            <meshStandardMaterial color={C.black} roughness={0.8} />
          </mesh>
          <Box position={[0, 0.04, 0]} size={[0.28, 0.015, 0.28]} color={C.black} roughness={0.8} />
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color={C.gold} metalness={0.6} roughness={0.3} />
          </mesh>
          <Box position={[0.1, 0.0, 0.11]} size={[0.012, 0.1, 0.012]} color={C.gold} metalness={0.4} roughness={0.4} />
        </group>
      </Interactive>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Front of the room: bookcase, beanbag, plant
--------------------------------------------------------------------------- */

function Bookcase() {
  const rows = [
    ["#e8e2d4", "#2f3b52", "#1b1b1c", "#c9a35a", "#8c3b2f", "#f2f2f0", "#556b4f", "#2a2b2f"],
    ["#1b1b1c", "#e8e2d4", "#b5643c", "#2f3b52", "#f2f2f0", "#556b4f"],
  ];
  return (
    <group position={[-2.8, 0, 1.45]}>
      <RoundedBox args={[0.36, 0.82, 1.2]} radius={0.015} position={[0, 0.41, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.white} roughness={0.6} />
      </RoundedBox>
      {/* Hollow it: dark recesses for the two shelves */}
      {[0.22, 0.6].map((y) => (
        <Box key={y} position={[0.06, y, 0]} size={[0.26, 0.32, 1.1]} color="#d9d5ce" shadow={false} />
      ))}
      {rows.map((row, r) =>
        row.map((color, i) => (
          <Box
            key={`${r}-${i}`}
            position={[0.08, 0.07 + r * 0.38 + 0.12, -0.48 + i * 0.075]}
            size={[0.2, 0.24 - (i % 3) * 0.025, 0.055]}
            color={color}
          />
        )),
      )}
      {/* A small speaker and a vase on top */}
      <RoundedBox args={[0.16, 0.2, 0.14]} radius={0.02} position={[0, 0.92, 0.35]} castShadow>
        <meshStandardMaterial color={C.charcoal} roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.9, -0.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.16, 14]} />
        <meshStandardMaterial color="#d8cfc0" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Plant({ waterings }: { waterings: number }) {
  const leaves = useRef<Group>(null);
  const since = useSinceChange(waterings);
  useFrame(({ clock }) => {
    if (!leaves.current) return;
    const t = since();
    const wiggle = t < 1.4 ? Math.sin(t * 18) * 0.12 * (1 - t / 1.4) : 0;
    leaves.current.rotation.z = wiggle + Math.sin(clock.getElapsedTime() * 0.8) * 0.015;
  });
  return (
    <Interactive id="plant" position={[-2.45, 0, 2.45]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.19, 0.15, 0.4, 20]} />
        <meshStandardMaterial color={C.pot} roughness={0.85} />
      </mesh>
      <group ref={leaves} position={[0, 0.4, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.012, 0.018, 0.5, 6]} />
          <meshStandardMaterial color="#5a4630" />
        </mesh>
        {[
          [0, 0.42, 0, 0.24],
          [0.16, 0.3, 0.08, 0.18],
          [-0.15, 0.34, -0.06, 0.19],
          [0.04, 0.6, -0.05, 0.17],
          [-0.06, 0.2, 0.13, 0.15],
          [0.1, 0.5, 0.12, 0.13],
        ].map(([x, y, z, rad], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[rad, 0]} />
            <meshStandardMaterial color={i % 2 ? C.plantLight : C.plant} flatShading roughness={0.8} />
          </mesh>
        ))}
      </group>
    </Interactive>
  );
}

function Beanbag() {
  return (
    <group position={[-0.7, 0, 1.2]} rotation={[0, 0.6, 0]}>
      <mesh position={[0, 0.2, 0]} scale={[1, 0.62, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.34, 24, 18]} />
        <meshStandardMaterial color={C.charcoal} roughness={1} />
      </mesh>
      <mesh position={[0, 0.34, -0.12]} scale={[0.9, 0.55, 0.6]} castShadow>
        <sphereGeometry args={[0.3, 20, 16]} />
        <meshStandardMaterial color={C.charcoal} roughness={1} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Walls: diploma, clock, poster, fairy lights
--------------------------------------------------------------------------- */

function Diploma({ tilted }: { tilted: boolean }) {
  const frame = useRef<Group>(null);
  const paper = useMemo(() => {
    const t = canvasTexture(560, 400);
    t.paint(drawDiploma());
    return t.texture;
  }, []);
  const { reducedMotion } = useRoom();
  useFrame((_, dt) => {
    if (frame.current) frame.current.rotation.z = damp(frame.current.rotation.z, tilted ? 0.09 : 0, reducedMotion ? 40 : 6, dt);
  });
  return (
    <Interactive id="diploma" position={[-0.55, 1.8, -2.98]}>
      <group ref={frame}>
        <RoundedBox args={[0.62, 0.46, 0.03]} radius={0.006} castShadow>
          <meshStandardMaterial color={C.black} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0, 0.0165]}>
          <planeGeometry args={[0.55, 0.39]} />
          <meshStandardMaterial map={paper} roughness={0.9} />
        </mesh>
      </group>
    </Interactive>
  );
}

function Clock({ hour, h24 }: { hour: number; h24: boolean }) {
  const face = useMemo(() => canvasTexture(320, 110), []);
  const hh = Math.floor(hour) % 24;
  const mm = Math.floor((hour % 1) * 60);
  const display = h24 ? hh : hh % 12 || 12;
  const text = `${String(display).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  const suffix = h24 ? "" : hh < 12 ? "AM" : "PM";
  useEffect(() => {
    face.paint(drawClock(text, suffix));
  }, [text, suffix, face]);
  return (
    <Interactive id="clock" position={[2.55, 2.42, -2.98]}>
      <RoundedBox args={[0.64, 0.25, 0.05]} radius={0.015} castShadow>
        <meshStandardMaterial color={C.black} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[0.58, 0.2]} />
        <meshBasicMaterial map={face.texture} color={[1.3, 1.3, 1.3]} toneMapped={false} />
      </mesh>
    </Interactive>
  );
}

function Poster({ index }: { index: number }) {
  const art = useMemo(() => canvasTexture(400, 560), []);
  useEffect(() => {
    art.paint(drawPoster(posterMottos[index % posterMottos.length]));
  }, [index, art]);
  return (
    <Interactive id="poster" position={[-2.98, 1.72, 1.45]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[0.62, 0.86, 0.03]} radius={0.006} castShadow>
        <meshStandardMaterial color={C.black} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0165]}>
        <planeGeometry args={[0.56, 0.8]} />
        <meshStandardMaterial map={art.texture} roughness={0.8} />
      </mesh>
    </Interactive>
  );
}

function FairyLights({ mode, dark }: { mode: 0 | 1 | 2; dark: number }) {
  const bulbs = useMemo(() => {
    const list: { p: [number, number, number]; phase: number }[] = [];
    const n = 18;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      list.push({ p: [-2.85 + f * 5.75, 2.82 - Math.sin(f * Math.PI * 5) ** 2 * 0.09, -2.94], phase: i * 1.7 });
    }
    for (let i = 1; i <= n; i++) {
      const f = i / n;
      list.push({ p: [-2.94, 2.82 - Math.sin(f * Math.PI * 5) ** 2 * 0.09, -2.85 + f * 5.75], phase: i * 2.3 });
    }
    return list;
  }, []);
  const mats = useRef<(MeshStandardMaterial | null)[]>([]);
  const light = useRef<PointLight>(null);
  const { reducedMotion } = useRoom();

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const base = mode === 0 ? 0 : 3 + dark * 4;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const twinkle = mode === 2 && !reducedMotion ? 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 3 + bulbs[i].phase)) : 1;
      m.emissiveIntensity = base * twinkle;
    });
    if (light.current) light.current.intensity = damp(light.current.intensity, mode ? 0.5 + 1.5 * dark : 0, 6, dt);
  });

  return (
    <Interactive id="fairyLights">
      {bulbs.map((b, i) => (
        <mesh key={i} position={b.p}>
          <sphereGeometry args={[0.024, 10, 10]} />
          <meshStandardMaterial ref={(m) => void (mats.current[i] = m)} color="#fff1d6" emissive="#ffc46b" emissiveIntensity={0} />
        </mesh>
      ))}
      <pointLight ref={light} position={[-1.2, 2.55, -1.2]} distance={6} decay={2} color="#ffc46b" intensity={0} />
    </Interactive>
  );
}

/* ---------------------------------------------------------------------------
   The room, assembled
--------------------------------------------------------------------------- */

export function Room({
  hour,
  weather,
  sleeping,
  toggles,
  counters,
  dark,
}: {
  hour: number;
  weather: { cloudy: number; rain: boolean } | null;
  sleeping: boolean;
  toggles: { curtainsOpen: boolean; bedLamp: boolean; fairy: 0 | 1 | 2; clock24: boolean; poster: number; diplomaTilt: boolean };
  counters: { cap: number; plant: number };
  dark: number;
}) {
  return (
    <group>
      <Shell />
      <WindowView hour={hour} cloudy={weather?.cloudy ?? 0.15} rain={!!weather?.rain} />
      <Curtains open={toggles.curtainsOpen} />
      <Bed sleeping={sleeping} />
      <Moonlight dark={dark} sleeping={sleeping} />
      <Nightstand lampOn={toggles.bedLamp} dark={dark} />
      <Shelf tosses={counters.cap} />
      <Bookcase />
      <Plant waterings={counters.plant} />
      <Beanbag />
      <Diploma tilted={toggles.diplomaTilt} />
      <Clock hour={hour} h24={toggles.clock24} />
      <Poster index={toggles.poster} />
      <FairyLights mode={toggles.fairy} dark={dark} />
    </group>
  );
}
