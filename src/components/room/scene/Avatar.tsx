"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace, Vector3, type Group, type Mesh, type Sprite, type SpriteMaterial } from "three";
import type { Activity } from "@/data/room";
import { SleepingMe } from "./Sleeper";
import { C, damp, KEY_COLS, keyWorld, rand, SPACE, useRoom, type TypingBusRef } from "./shared";

/* ---------------------------------------------------------------------------
   Poses, in the avatar's own space: +z forward, +y up, origin on the floor.
   (Facing +z, the right hand is on the -x side.)
--------------------------------------------------------------------------- */

type Pose = "desk" | "stand" | "bed" | "sleep";

type Frame = {
  pelvis: [number, number, number];
  torso: [number, number, number];
  tilt: number;
  shoulder: [number, number, number];
  head: [number, number, number];
  hip: [number, number, number];
  knee: [number, number, number];
  ankle: [number, number, number];
};

const FRAMES: Record<Exclude<Pose, "sleep">, Frame> = {
  desk: {
    pelvis: [0, 0.6, 0],
    torso: [0, 0.84, 0.05],
    tilt: 0.22,
    shoulder: [0.155, 1.0, 0.09],
    head: [0, 1.19, 0.13],
    hip: [0.085, 0.585, 0.02],
    knee: [0.1, 0.585, 0.42],
    ankle: [0.1, 0.1, 0.47],
  },
  stand: {
    pelvis: [0, 0.88, 0],
    torso: [0, 1.12, 0],
    tilt: 0.02,
    shoulder: [0.18, 1.29, 0.02],
    head: [0, 1.47, 0.03],
    hip: [0.09, 0.86, 0],
    knee: [0.09, 0.47, 0.02],
    ankle: [0.09, 0.08, 0],
  },
  bed: {
    pelvis: [0, 0.64, 0],
    torso: [0, 0.88, 0.03],
    tilt: 0.14,
    shoulder: [0.165, 1.05, 0.07],
    head: [0, 1.22, 0.1],
    hip: [0.085, 0.63, 0.02],
    knee: [0.1, 0.62, 0.4],
    ankle: [0.1, 0.1, 0.44],
  },
};

/** Where the avatar stands in the room for each pose, and which way it faces. */
export const PLACES: Record<Pose, { p: [number, number, number]; r: number }> = {
  desk: { p: [1.42, 0, -1.98], r: Math.PI },
  stand: { p: [0.35, 0, -1.35], r: 2.59 },
  bed: { p: [-1.84, 0, -1.45], r: Math.PI / 2 },
  // Asleep, the figure is drawn in room coordinates (see Sleeper.tsx).
  sleep: { p: [0, 0, 0], r: 0 },
};

export function poseFor(activity: Activity): Pose {
  return activity === "sleep" ? "sleep" : activity === "rest" ? "bed" : activity === "coffee" ? "stand" : "desk";
}

const UPPER = 0.235;
const FORE = 0.22;
const UP = new Vector3(0, 1, 0);

/* ---------------------------------------------------------------------------
   Two-bone IK: from shoulder and target, find the elbow (and the hand, which
   stops short if the target is out of reach). `pole` says which way the
   elbow bends.
--------------------------------------------------------------------------- */

const ik = { dir: new Vector3(), bend: new Vector3() };

function solveArm(shoulder: Vector3, target: Vector3, pole: Vector3, elbow: Vector3, hand: Vector3) {
  const { dir, bend } = ik;
  dir.subVectors(target, shoulder);
  const dist = Math.min(Math.max(dir.length(), 0.08), UPPER + FORE - 0.002);
  dir.normalize();
  hand.copy(shoulder).addScaledVector(dir, dist);
  const cosA = (UPPER * UPPER + dist * dist - FORE * FORE) / (2 * UPPER * dist);
  const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
  bend.subVectors(pole, shoulder);
  bend.addScaledVector(dir, -bend.dot(dir)).normalize();
  elbow.copy(shoulder).addScaledVector(dir, UPPER * cosA).addScaledVector(bend, UPPER * sinA);
}

const seg = new Vector3();
/** Stretch a unit cylinder between two points. */
function place(mesh: Mesh | null, a: Vector3, b: Vector3) {
  if (!mesh) return;
  seg.subVectors(b, a);
  const len = seg.length();
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, seg.divideScalar(len || 1));
  mesh.scale.set(1, len, 1);
}

/* ---------------------------------------------------------------------------
   Typing: each hand picks keys on its own half of the keyboard
--------------------------------------------------------------------------- */

type HandState = { key: number; tapAt: number; nextAt: number; pos: Vector3; ready: boolean };

function pickKey(side: 1 | -1) {
  // side 1 = left hand (cols 1–6), side -1 = right hand (cols 7–12)
  if (rand() < 0.08) return SPACE;
  const r = rand();
  const row = r < 0.15 ? 0 : r < 0.5 ? 1 : r < 0.88 ? 2 : 3;
  const col = side === 1 ? 1 + Math.floor(rand() * 6) : 7 + Math.floor(rand() * 6);
  return row * KEY_COLS + col;
}

/* ---------------------------------------------------------------------------
   "Z"s for sleeping
--------------------------------------------------------------------------- */

function useZTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 48px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Z", 32, 34);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
}

/* ---------------------------------------------------------------------------
   The avatar
--------------------------------------------------------------------------- */

function Limb({ r, color, ref }: { r: number; color: string; ref: (m: Mesh | null) => void }) {
  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={[r, r * 0.92, 1, 12]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Joint({ r, color, ref }: { r: number; color: string; ref: (m: Mesh | null) => void }) {
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[r, 12, 12]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function Avatar({
  activity,
  spinRef,
  busRef,
  typingRate,
}: {
  activity: Activity;
  spinRef: { current: number };
  busRef: TypingBusRef;
  /** Keystrokes per second across both hands; 0 while not typing. */
  typingRate: number;
}) {
  const pose = poseFor(activity);
  const { reducedMotion } = useRoom();
  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const mug = useRef<Group>(null);
  const phone = useRef<Group>(null);
  const zs = useRef<(Sprite | null)[]>([]);
  const zTex = useZTexture();
  const [shown, setShown] = useState(pose);
  const pop = useRef(1);

  // Limb meshes, filled by ref callbacks
  const m = useRef<Record<string, Mesh | null>>({});

  // Scratch vectors and per-hand typing state, reused every frame.
  const scratchRef = useRef({
    sL: new Vector3(), sR: new Vector3(), eL: new Vector3(), eR: new Vector3(), hL: new Vector3(), hR: new Vector3(),
    tL: new Vector3(), tR: new Vector3(), pole: new Vector3(), tmp: new Vector3(), look: new Vector3(),
    hip: new Vector3(), knee: new Vector3(), ankle: new Vector3(),
  });
  const handsRef = useRef<Record<"L" | "R", HandState>>({
    L: { key: 3 + 2 * KEY_COLS, tapAt: -1, nextAt: 0, pos: new Vector3(), ready: false },
    R: { key: 9 + 2 * KEY_COLS, tapAt: -1, nextAt: 0.12, pos: new Vector3(), ready: false },
  });

  // A pose change pops the avatar into its new place rather than sliding it
  // through the furniture.
  useEffect(() => {
    if (pose === shown) return;
    pop.current = reducedMotion ? 1 : 0;
    // Swapping the rendered pose in response to the prop is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown(pose);
    handsRef.current.L.ready = handsRef.current.R.ready = false;
  }, [pose, shown, reducedMotion]);

  useFrame(({ clock }, dt) => {
    const g = root.current;
    if (!g) return;
    const v = scratchRef.current;
    const hands = handsRef.current;
    const bus = busRef.current;
    const t = clock.getElapsedTime();
    const place0 = PLACES[shown];
    g.position.set(...place0.p);
    g.rotation.y = place0.r + (shown === "desk" ? spinRef.current : 0);
    pop.current = Math.min(1, pop.current + dt * 4);
    const s = 1 - Math.pow(1 - pop.current, 3);
    // Asleep, the duvet's own easing carries the change; no pop.
    g.scale.setScalar(shown === "sleep" ? 1 : 0.6 + 0.4 * s);
    g.updateMatrixWorld();

    if (shown === "sleep") {
      zs.current.forEach((sprite, i) => {
        if (!sprite) return;
        const phase = (t * 0.35 + i / 3) % 1;
        (sprite.material as SpriteMaterial).opacity = reducedMotion ? 0 : Math.sin(phase * Math.PI) * 0.85;
        sprite.position.set(-2.46 + phase * 0.22, 0.86 + phase * 0.5, -2.68 + Math.sin(phase * 6) * 0.04);
        sprite.scale.setScalar(0.06 + phase * 0.08);
      });
      return;
    }

    const f = FRAMES[shown];
    const breathe = reducedMotion ? 0 : Math.sin(t * 1.5) * 0.012;
    if (torso.current) {
      torso.current.position.set(...f.torso);
      torso.current.rotation.x = f.tilt;
      torso.current.scale.set(1, 1 + breathe, 1);
    }

    // Shoulders
    v.sL.set(f.shoulder[0], f.shoulder[1] + breathe * 0.4, f.shoulder[2]);
    v.sR.set(-f.shoulder[0], f.shoulder[1] + breathe * 0.4, f.shoulder[2]);

    // Hand targets
    let lookWorld: Vector3 | null = null;
    if (shown === "desk") {
      const thinking = !reducedMotion && t % 11 > 9.4; // a pause to think, glancing at the laptop
      for (const [side, hand] of [
        [1, hands.L],
        [-1, hands.R],
      ] as const) {
        if (!hand.ready) {
          keyWorld(hand.key, hand.pos);
          g.worldToLocal(hand.pos);
          hand.ready = true;
        }
        if (typingRate > 0 && !thinking && t >= hand.nextAt) {
          hand.key = pickKey(side);
          hand.tapAt = t;
          hand.nextAt = t + (2 / typingRate) * (0.6 + rand() * 0.8);
          bus.pressedAt[hand.key] = t;
          bus.strokes += 1;
        }
        keyWorld(hand.key, v.tmp);
        g.worldToLocal(v.tmp);
        hand.pos.x = damp(hand.pos.x, v.tmp.x, 22, dt);
        hand.pos.z = damp(hand.pos.z, v.tmp.z, 22, dt);
        const phase = (t - hand.tapAt) / 0.13;
        const dip = phase >= 0 && phase < 1 ? Math.sin(phase * Math.PI) * 0.016 : 0;
        hand.pos.y = v.tmp.y + 0.03 - dip;
      }
      // The wrist sits behind the fingertips, toward the body.
      const toWrist = (out: Vector3, fingertip: Vector3, shoulder: Vector3) => {
        out.copy(fingertip);
        v.look.set(shoulder.x - fingertip.x, 0, shoulder.z - fingertip.z).normalize();
        out.addScaledVector(v.look, 0.075);
        out.y += 0.012;
      };
      toWrist(v.tL, hands.L.pos, v.sL);
      toWrist(v.tR, hands.R.pos, v.sR);
      lookWorld = thinking ? v.look.set(0.6, 0.95, -2.6) : v.look.set(1.5, 1.2, -2.83);
    } else if (shown === "stand") {
      const cycle = t % 7;
      const sip = reducedMotion ? 0 : cycle > 5 ? Math.sin(((cycle - 5) / 2) * Math.PI) : 0;
      v.tL.set(0.07, 1.06 + sip * 0.3, 0.2 - sip * 0.05);
      v.tR.set(-0.07, 1.06 + sip * 0.3, 0.2 - sip * 0.05);
      if (mug.current) {
        mug.current.position.set(0, 1.09 + sip * 0.3, 0.26 - sip * 0.06);
        mug.current.rotation.x = sip * 0.7;
      }
      if (head.current) head.current.userData.pitch = -0.1 - sip * 0.35;
    } else if (shown === "bed") {
      const tap = reducedMotion ? 0 : Math.max(0, Math.sin(t * 9)) * 0.006;
      v.tL.set(0.06, 0.83 + tap, 0.28);
      v.tR.set(-0.06, 0.83, 0.28);
      if (head.current) head.current.userData.pitch = 0.5;
    }

    // Arms
    v.pole.set(v.sL.x + 0.12, v.sL.y - 0.55, v.sL.z - 0.4);
    solveArm(v.sL, v.tL, v.pole, v.eL, v.hL);
    v.pole.set(v.sR.x - 0.12, v.sR.y - 0.55, v.sR.z - 0.4);
    solveArm(v.sR, v.tR, v.pole, v.eR, v.hR);
    const mm = m.current;
    place(mm.upperL, v.sL, v.eL);
    place(mm.foreL, v.eL, v.hL);
    place(mm.upperR, v.sR, v.eR);
    place(mm.foreR, v.eR, v.hR);
    mm.shoulderL?.position.copy(v.sL);
    mm.shoulderR?.position.copy(v.sR);
    mm.elbowL?.position.copy(v.eL);
    mm.elbowR?.position.copy(v.eR);
    for (const [key, wrist, elbow] of [
      ["handL", v.hL, v.eL],
      ["handR", v.hR, v.eR],
    ] as const) {
      const hand = mm[key];
      if (!hand) continue;
      hand.position.copy(wrist);
      v.tmp.subVectors(wrist, elbow);
      v.tmp.y *= shown === "desk" ? 0.25 : 1; // palms stay flat over the keys
      hand.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), v.tmp.normalize());
    }

    // Legs
    for (const side of [1, -1]) {
      v.hip.set(f.hip[0] * side, f.hip[1], f.hip[2]);
      v.knee.set(f.knee[0] * side, f.knee[1], f.knee[2]);
      v.ankle.set(f.ankle[0] * side, f.ankle[1], f.ankle[2]);
      const k = side === 1 ? "L" : "R";
      place(mm[`thigh${k}`], v.hip, v.knee);
      place(mm[`shin${k}`], v.knee, v.ankle);
      mm[`knee${k}`]?.position.copy(v.knee);
      mm[`foot${k}`]?.position.set(v.ankle.x, 0.035, v.ankle.z + 0.05);
    }

    // Head: turn toward what she's looking at
    const hg = head.current;
    if (hg) {
      hg.position.set(...f.head);
      let yaw = 0;
      let pitch = (hg.userData.pitch as number) ?? 0;
      if (lookWorld) {
        v.tmp.copy(lookWorld);
        g.worldToLocal(v.tmp);
        v.tmp.sub(hg.position);
        yaw = Math.max(-0.9, Math.min(0.9, Math.atan2(v.tmp.x, v.tmp.z)));
        pitch = -Math.atan2(v.tmp.y, Math.hypot(v.tmp.x, v.tmp.z));
      }
      const idle = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.03;
      hg.rotation.y = damp(hg.rotation.y, yaw + idle, 5, dt);
      hg.rotation.x = damp(hg.rotation.x, pitch, 5, dt);
    }
  });

  const hair = (
    <>
      <mesh position={[0, 0.018, -0.012]} castShadow>
        <sphereGeometry args={[0.124, 20, 20]} />
        <meshStandardMaterial color={C.hair} roughness={0.55} />
      </mesh>
      <RoundedBox args={[0.25, 0.44, 0.08]} radius={0.035} position={[0, -0.2, -0.085]} castShadow>
        <meshStandardMaterial color={C.hair} roughness={0.55} />
      </RoundedBox>
      {[1, -1].map((s) => (
        <RoundedBox key={s} args={[0.05, 0.3, 0.07]} radius={0.02} position={[0.1 * s, -0.12, 0.01]} castShadow>
          <meshStandardMaterial color={C.hair} roughness={0.55} />
        </RoundedBox>
      ))}
    </>
  );

  if (shown === "sleep") {
    return (
      <group ref={root} position={PLACES.sleep.p}>
        <SleepingMe />
        {[0, 1, 2].map((i) => (
          <sprite key={i} ref={(s) => void (zs.current[i] = s)}>
            <spriteMaterial map={zTex} transparent opacity={0} depthWrite={false} />
          </sprite>
        ))}
      </group>
    );
  }

  return (
    <group ref={root} position={PLACES[shown].p}>
      {/* Torso, with a hood resting behind the neck */}
      <group ref={torso}>
        <mesh scale={[1, 1, 0.72]} castShadow>
          <capsuleGeometry args={[0.135, 0.22, 6, 14]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.95} />
        </mesh>
        <RoundedBox args={[0.2, 0.09, 0.08]} radius={0.035} position={[0, 0.17, -0.085]} castShadow>
          <meshStandardMaterial color={C.hoodie} roughness={0.95} />
        </RoundedBox>
        <mesh position={[0, 0.2, 0.01]}>
          <cylinderGeometry args={[0.042, 0.045, 0.08, 10]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
      </group>
      {/* Pelvis */}
      <mesh position={FRAMES[shown].pelvis} scale={[1, 0.7, 0.85]} castShadow>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshStandardMaterial color={C.pants} roughness={0.9} />
      </mesh>

      {/* Head */}
      <group ref={head}>
        <mesh castShadow>
          <sphereGeometry args={[0.112, 20, 20]} />
          <meshStandardMaterial color={C.skin} roughness={0.75} />
        </mesh>
        {[1, -1].map((s) => (
          <mesh key={s} position={[0.038 * s, 0.005, 0.104]}>
            <sphereGeometry args={[0.011, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
        {hair}
      </group>

      {/* Arms */}
      <Joint r={0.056} color={C.hoodie} ref={(x) => void (m.current.shoulderL = x)} />
      <Joint r={0.056} color={C.hoodie} ref={(x) => void (m.current.shoulderR = x)} />
      <Limb r={0.049} color={C.hoodie} ref={(x) => void (m.current.upperL = x)} />
      <Limb r={0.049} color={C.hoodie} ref={(x) => void (m.current.upperR = x)} />
      <Joint r={0.045} color={C.hoodie} ref={(x) => void (m.current.elbowL = x)} />
      <Joint r={0.045} color={C.hoodie} ref={(x) => void (m.current.elbowR = x)} />
      <Limb r={0.042} color={C.hoodie} ref={(x) => void (m.current.foreL = x)} />
      <Limb r={0.042} color={C.hoodie} ref={(x) => void (m.current.foreR = x)} />
      {(["handL", "handR"] as const).map((key) => (
        <group key={key} ref={(gr) => void (m.current[key] = gr as unknown as Mesh)}>
          {/* Palm, then fingers angled down toward the keys */}
          <RoundedBox args={[0.068, 0.026, 0.07]} radius={0.012} position={[0, 0, 0.035]} castShadow>
            <meshStandardMaterial color={C.skin} roughness={0.75} />
          </RoundedBox>
          <RoundedBox
            args={[0.064, 0.018, 0.05]}
            radius={0.008}
            position={[0, -0.012, 0.085]}
            rotation={[0.45, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color={C.skin} roughness={0.75} />
          </RoundedBox>
        </group>
      ))}

      {/* Legs */}
      {(["L", "R"] as const).map((k) => (
        <group key={k}>
          <Limb r={0.07} color={C.pants} ref={(x) => void (m.current[`thigh${k}`] = x)} />
          <Joint r={0.066} color={C.pants} ref={(x) => void (m.current[`knee${k}`] = x)} />
          <Limb r={0.056} color={C.pants} ref={(x) => void (m.current[`shin${k}`] = x)} />
          <mesh ref={(x) => void (m.current[`foot${k}`] = x)} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.2]} />
            <meshStandardMaterial color={C.white} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Props in hand */}
      {shown === "stand" && (
        <group ref={mug}>
          <mesh castShadow>
            <cylinderGeometry args={[0.042, 0.037, 0.1, 16]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
        </group>
      )}
      {shown === "bed" && (
        // Turned to face her (the screen's +z points back up at her eyes),
        // then tilted so the top edge leans away, as a phone is held.
        <group ref={phone} position={[0, 0.86, 0.3]} rotation={[0, Math.PI, 0]}>
          <group rotation={[-1.05, 0, 0]}>
            <RoundedBox args={[0.075, 0.15, 0.01]} radius={0.008} castShadow>
              <meshStandardMaterial color={C.black} roughness={0.4} />
            </RoundedBox>
            <mesh position={[0, 0, 0.0056]}>
              <planeGeometry args={[0.066, 0.135]} />
              <meshBasicMaterial color={[1.6, 1.7, 2]} toneMapped={false} />
            </mesh>
            {/* A few lines of a feed on the screen */}
            {[0.045, 0.02, -0.005, -0.03].map((y, i) => (
              <mesh key={y} position={[-0.004 * (i % 2), y, 0.006]}>
                <planeGeometry args={[0.05 - (i % 2) * 0.012, 0.012]} />
                <meshBasicMaterial color={[0.9, 0.95, 1.1]} toneMapped={false} />
              </mesh>
            ))}
            {/* The screen lighting up her face */}
            <pointLight position={[0, 0, 0.18]} distance={0.5} decay={2} intensity={0.08} color="#cfe0ff" />
          </group>
        </group>
      )}
    </group>
  );
}
