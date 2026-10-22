"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  BufferAttribute,
  Color,
  Matrix4,
  Object3D,
  PlaneGeometry,
  Quaternion,
  Vector3,
  type Mesh,
  type SpotLight,
} from "three";
import { C, damp, useRoom } from "./shared";

/* ---------------------------------------------------------------------------
   Where the bed is, and the shape of someone curled up in it.

   Everything is in room coordinates. She sleeps on her side on the left
   pillow, facing into the room (+x), knees drawn up a little.
--------------------------------------------------------------------------- */

const BED_X = -2.37;
const MATTRESS_HALF = 0.59;
const MATTRESS_TOP = 0.49;
const FOOT = -0.8;
const TOP_AWAKE = -2.3;
const TOP_ASLEEP = -2.56;
const HX = -2.58;

/** Soft ellipsoids under the duvet: shoulder, ribs, hip, thigh, knee, shins, feet. */
const BODY: { x: number; z: number; rx: number; rz: number; h: number; chest?: boolean }[] = [
  { x: HX + 0.03, z: -2.43, rx: 0.17, rz: 0.12, h: 0.2, chest: true },
  { x: HX + 0.0, z: -2.18, rx: 0.15, rz: 0.2, h: 0.17, chest: true },
  { x: HX - 0.02, z: -1.88, rx: 0.18, rz: 0.16, h: 0.21 },
  { x: HX + 0.13, z: -1.65, rx: 0.13, rz: 0.17, h: 0.14 },
  { x: HX + 0.25, z: -1.47, rx: 0.1, rz: 0.1, h: 0.12 },
  { x: HX + 0.12, z: -1.28, rx: 0.15, rz: 0.11, h: 0.09 },
  { x: HX + 0.0, z: -1.12, rx: 0.09, rz: 0.08, h: 0.07 },
];

const SEG_X = 44;
const SEG_Z = 64;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---------------------------------------------------------------------------
   Duvet: a real draped sheet of fabric. It hangs over the mattress edges,
   wrinkles a little, folds back at the top to show the sheet — and when
   she's asleep it takes her shape and rises and falls as she breathes.
--------------------------------------------------------------------------- */

export function Duvet({ sleeping }: { sleeping: boolean }) {
  const mesh = useRef<Mesh>(null);
  const { reducedMotion } = useRoom();
  const live = useRef({ amp: -1, top: 0, settledAt: -1 });

  // Topology and colours only; positions are written every frame below.
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(1, 1, SEG_X, SEG_Z);
    g.rotateX(-Math.PI / 2);
    const count = (SEG_X + 1) * (SEG_Z + 1);
    g.setAttribute("color", new BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, []);
  const colors = useMemo(
    () => ({ duvet: new Color(C.blanket), sheet: new Color(C.sheet), knit: new Color(C.knit), tmp: new Color() }),
    [],
  );

  useFrame(({ clock }, dt) => {
    const m = mesh.current;
    if (!m) return;
    const s = live.current;
    const t = clock.getElapsedTime();
    const target = sleeping ? 1 : 0;
    const first = s.amp < 0;
    if (first) {
      s.amp = target;
      s.top = sleeping ? TOP_ASLEEP : TOP_AWAKE;
    } else {
      s.amp = damp(s.amp, target, reducedMotion ? 40 : 2.4, dt);
      s.top = damp(s.top, sleeping ? TOP_ASLEEP : TOP_AWAKE, reducedMotion ? 40 : 2.4, dt);
    }
    const moving = Math.abs(s.amp - target) > 0.001;
    // Awake and settled: the duvet is still, so skip the work.
    if (!first && !moving && !sleeping) return;

    const breath = sleeping && !reducedMotion ? Math.sin(t * 1.15) : 0;
    const pos = m.geometry.getAttribute("position") as BufferAttribute;
    const col = m.geometry.getAttribute("color") as BufferAttribute;
    const length = FOOT - s.top;

    for (let iz = 0; iz <= SEG_Z; iz++) {
      const v = iz / SEG_Z;
      const z = s.top + v * length;
      const fromTop = v * length;
      const fold = 1 - smooth(0.12, 0.16, fromTop);
      // A knit throw folded across the foot — part of the same cloth, so it
      // follows her shape instead of floating on it.
      const throwBand = smooth(-1.19, -1.16, z);
      const throwLift = throwBand * 0.014;
      for (let ix = 0; ix <= SEG_X; ix++) {
        const u = ix / SEG_X;
        const x = BED_X + (u - 0.5) * 1.42;
        let y = MATTRESS_TOP + 0.016;

        // Her shape, eased in and out
        if (s.amp > 0.001) {
          let h = 0;
          for (const b of BODY) {
            const dx = (x - b.x) / b.rx;
            const dz = (z - b.z) / b.rz;
            const lift = b.chest ? 1 + breath * 0.07 : 1;
            h = Math.max(h, b.h * lift * Math.exp(-(dx * dx + dz * dz) * 1.35));
          }
          y += h * s.amp;
        }

        // The folded-back top sits a touch proud, with a rolled edge
        y += fold * 0.014 + throwLift - (fromTop < 0.02 ? (0.02 - fromTop) * 0.6 : 0);

        // Drape over the sides and the foot
        const side = Math.abs(x - BED_X) - MATTRESS_HALF;
        if (side > 0) y -= side * 1.6 + side * side * 6;
        const over = z - (-0.875);
        if (over > 0) y -= over * 1.6 + over * over * 6;

        // A few soft wrinkles
        y += 0.005 * Math.sin(x * 19 + z * 6) * Math.sin(z * 13 + 1) + 0.003 * Math.sin(z * 29 + x * 4);
        y = Math.max(y, 0.33);

        const i = iz * (SEG_X + 1) + ix;
        pos.setXYZ(i, x, y, z);
        colors.tmp.copy(colors.duvet).lerp(colors.knit, throwBand).lerp(colors.sheet, fold);
        col.setXYZ(i, colors.tmp.r, colors.tmp.g, colors.tmp.b);
      }
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    m.geometry.computeVertexNormals();
    m.geometry.computeBoundingSphere();
  });

  return (
    <mesh ref={mesh} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} side={2} />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
   Asleep: head on the pillow, eyes closed, hair across the pillow, one hand
   tucked up by her face
--------------------------------------------------------------------------- */

const HEAD = new Vector3(-2.6, 0.705, -2.64);

/** Orient the head: face toward the room, crown toward the headboard. */
function headQuaternion() {
  const face = new Vector3(1, 0.38, 0.12).normalize();
  const crown = new Vector3(0, 0.15, -1);
  crown.addScaledVector(face, -crown.dot(face)).normalize();
  const side = new Vector3().crossVectors(crown, face);
  return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(side, crown, face));
}

const lerp3 = (a: [number, number, number], b: [number, number, number], t: number) =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as [number, number, number];

function Limb({ from, to, r, color }: { from: [number, number, number]; to: [number, number, number]; r: number; color: string }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const dir = b.clone().sub(a);
    const o = new Object3D();
    o.position.copy(a).add(b).multiplyScalar(0.5);
    o.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize());
    return { position: o.position, quaternion: o.quaternion, length: dir.length() };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <capsuleGeometry args={[r, length, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

const ARM_FROM: [number, number, number] = [-2.47, 0.69, -2.36];
const ARM_TO: [number, number, number] = [-2.39, 0.66, -2.55];

export function SleepingMe() {
  const quat = useMemo(() => headQuaternion(), []);
  return (
    <group>
      {/* Head */}
      <group position={HEAD} quaternion={quat}>
        <mesh scale={[1, 1, 0.96]} castShadow>
          <sphereGeometry args={[0.112, 24, 24]} />
          <meshStandardMaterial color={C.skin} roughness={0.7} />
        </mesh>
        {/* Closed eyes: soft downward arcs */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[0.042 * s, 0.008, 0.104]} rotation={[0, 0.38 * s, Math.PI]}>
            <torusGeometry args={[0.016, 0.0045, 6, 14, Math.PI]} />
            <meshStandardMaterial color="#2a1d18" roughness={0.6} />
          </mesh>
        ))}
        {/* Blush and nose */}
        {[1, -1].map((s) => (
          <mesh key={`b${s}`} position={[0.066 * s, -0.028, 0.092]} rotation={[0, 0.6 * s, 0]}>
            <circleGeometry args={[0.019, 16]} />
            <meshStandardMaterial color="#ef9a8e" transparent opacity={0.6} roughness={1} depthWrite={false} />
          </mesh>
        ))}
        <mesh position={[0, -0.014, 0.11]}>
          <sphereGeometry args={[0.012, 10, 10]} />
          <meshStandardMaterial color={C.skin} roughness={0.7} />
        </mesh>
        {/* Hair over the crown and back of the head */}
        <mesh position={[0, 0.022, -0.026]} scale={[1.02, 1, 1]} castShadow>
          <sphereGeometry args={[0.124, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color={C.hair} roughness={0.5} side={2} />
        </mesh>
        <mesh position={[0, -0.02, -0.07]} scale={[1.05, 1.1, 0.8]} castShadow>
          <sphereGeometry args={[0.118, 20, 20]} />
          <meshStandardMaterial color={C.hair} roughness={0.5} />
        </mesh>
      </group>

      {/* Long hair fanned across the pillow, and a lock over her shoulder */}
      <mesh position={[-2.69, 0.64, -2.77]} rotation={[0.2, 0.35, 0]} scale={[0.2, 0.022, 0.15]} castShadow>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color={C.hair} roughness={0.5} />
      </mesh>
      <mesh position={[-2.55, 0.67, -2.5]} rotation={[0.05, -0.45, 0.25]} scale={[0.045, 0.02, 0.13]} castShadow>
        <sphereGeometry args={[1, 20, 10]} />
        <meshStandardMaterial color={C.hair} roughness={0.5} />
      </mesh>

      {/* Her top arm over the duvet, hand tucked up by her face */}
      <Limb from={ARM_FROM} to={lerp3(ARM_FROM, ARM_TO, 0.75)} r={0.042} color={C.hoodie} />
      <RoundedBox args={[0.06, 0.03, 0.075]} radius={0.013} position={ARM_TO} rotation={[0.1, -0.5, 0.2]} castShadow>
        <meshStandardMaterial color={C.skin} roughness={0.7} />
      </RoundedBox>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Moonlight through the window, laid across the bed at night
--------------------------------------------------------------------------- */

export function Moonlight({ dark, sleeping }: { dark: number; sleeping: boolean }) {
  const light = useRef<SpotLight>(null);
  const target = useMemo(() => {
    const o = new Object3D();
    o.position.set(-2.25, 0.5, -1.9);
    return o;
  }, []);
  useFrame((_, dt) => {
    if (light.current) light.current.intensity = damp(light.current.intensity, dark * (sleeping ? 5 : 2.5), 3, dt);
  });
  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={light}
        position={[1.0, 2.3, -2.7]}
        target={target}
        angle={0.55}
        penumbra={1}
        distance={7}
        decay={1.2}
        color="#a9bcff"
        intensity={0}
      />
    </>
  );
}
