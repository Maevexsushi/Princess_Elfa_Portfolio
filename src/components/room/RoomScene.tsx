"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import {
  Color,
  MathUtils,
  Vector3,
  type DirectionalLight,
  type HemisphereLight,
  type OrthographicCamera,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Activity, CameraView, RoomItemId } from "@/data/room";
import { daylight, goldenHour } from "./daylight";
import { Avatar } from "./scene/Avatar";
import { Chair, Desk } from "./scene/Desk";
import { Room } from "./scene/Room";
import { damp, RoomContext, useRoom, useSinceChange, useTypingBus, type RoomCtx } from "./scene/shared";

/* ---------------------------------------------------------------------------
   Props
--------------------------------------------------------------------------- */

export type RoomToggles = {
  deskLamp: boolean;
  bedLamp: boolean;
  curtainsOpen: boolean;
  fairy: 0 | 1 | 2;
  laptopOpen: boolean;
  screen: 0 | 1 | 2;
  clock24: boolean;
  poster: number;
  diplomaTilt: boolean;
  music: boolean;
};

/** Monotonic counters: each click bumps one, and the object animates once. */
export type RoomCounters = { chair: number; cap: number; plant: number; mug: number };

export type RoomSceneProps = {
  /** Hour of the day in the Philippines, 0–24 (sped up in time-lapse). */
  hour: number;
  activity: Activity;
  view: CameraView;
  /** Bumped to re-run a camera move to the same view. */
  viewNonce: number;
  weather: { cloudy: number; rain: boolean } | null;
  toggles: RoomToggles;
  counters: RoomCounters;
  reducedMotion: boolean;
  active: boolean;
  onItem: (id: RoomItemId) => void;
  onHover: (id: RoomItemId | null) => void;
};

/* ---------------------------------------------------------------------------
   Daylight: sky, sun or moon, and a fill from the viewer's side
--------------------------------------------------------------------------- */

function Daylight({ hour, cloudy }: { hour: number; cloudy: number }) {
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const colors = useRef({
    skyDay: new Color("#dbe9ff"),
    skyNight: new Color("#3a4775"),
    moon: new Color("#9fb3ff"),
    golden: new Color("#ffad70"),
    noon: new Color("#fff2dc"),
    tmp: new Color(),
  });

  useFrame((_, dt) => {
    const c = colors.current;
    const day = daylight(hour) * (1 - cloudy * 0.4);
    const golden = goldenHour(hour);
    const k = Math.min(1, dt * 4);
    if (hemi.current) {
      hemi.current.intensity = damp(hemi.current.intensity, 0.55 + 1.1 * day, 4, dt);
      c.tmp.copy(c.skyNight).lerp(c.skyDay, day);
      hemi.current.color.lerp(c.tmp, k);
    }
    if (sun.current) {
      sun.current.intensity = damp(sun.current.intensity, 0.6 + 2.6 * day, 4, dt);
      c.tmp.copy(day > 0.05 ? c.noon : c.moon);
      if (golden > 0) c.tmp.lerp(c.golden, golden * 0.85);
      sun.current.color.lerp(c.tmp, k);
    }
    if (fill.current) fill.current.intensity = damp(fill.current.intensity, 0.25 + 0.55 * day, 4, dt);
  });

  return (
    <>
      <hemisphereLight ref={hemi} groundColor="#6b4e36" intensity={1} />
      {/* Sun by day, moon by night — through the window, past the wall */}
      <directionalLight
        ref={sun}
        position={[2.4, 6, -7]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight ref={fill} position={[6, 7, 6]} intensity={0.5} />
    </>
  );
}

/* ---------------------------------------------------------------------------
   Camera: isometric, orbit within limits, glide between preset views
--------------------------------------------------------------------------- */

const VIEWS: Record<CameraView, { target: [number, number, number]; dir: [number, number, number]; zoom: number }> = {
  room: { target: [0, 0.75, 0], dir: [1, 0.86, 1], zoom: 1 },
  desk: { target: [1.35, 1.0, -2.35], dir: [0.8, 0.62, 1], zoom: 2.3 },
  bed: { target: [-2.0, 0.75, -1.85], dir: [1, 0.9, 0.85], zoom: 1.9 },
  window: { target: [1.3, 1.6, -2.85], dir: [0.6, 0.42, 1], zoom: 2.4 },
};

function CameraRig({ view, nonce }: { view: CameraView; nonce: number }) {
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;
  const size = useThree((s) => s.size);
  const { reducedMotion } = useRoom();
  const moving = useRef(true);
  const goalRef = useRef({ pos: new Vector3(), target: new Vector3() });
  // Narrow screens get a tighter frame, so the room isn't lost in the stage.
  const base = Math.min(size.width / (size.width < 640 ? 7.4 : 8.2), size.height / 6);

  useEffect(() => {
    moving.current = true;
  }, [view, nonce, base]);

  useEffect(() => {
    if (!controls) return;
    const stop = () => (moving.current = false);
    controls.addEventListener("start", stop);
    return () => controls.removeEventListener("start", stop);
  }, [controls]);

  useFrame((state, dt) => {
    if (!moving.current || !controls) return;
    const camera = state.camera as OrthographicCamera;
    const goal = goalRef.current;
    const v = VIEWS[view];
    goal.target.set(...v.target);
    goal.pos.set(...v.dir).normalize().multiplyScalar(30).add(goal.target);
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 4.5);
    camera.position.lerp(goal.pos, k);
    controls.target.lerp(goal.target, k);
    camera.zoom = MathUtils.lerp(camera.zoom, base * v.zoom, k);
    camera.updateProjectionMatrix();
    controls.update();
    if (camera.position.distanceTo(goal.pos) < 0.01 && Math.abs(camera.zoom - base * v.zoom) < 0.05) {
      moving.current = false;
    }
  });

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minZoom={base * 0.85}
      maxZoom={base * 3.4}
      minAzimuthAngle={0.2}
      maxAzimuthAngle={1.35}
      minPolarAngle={0.7}
      maxPolarAngle={1.25}
    />
  );
}

/* ---------------------------------------------------------------------------
   The scene
--------------------------------------------------------------------------- */

function Scene(props: RoomSceneProps) {
  const { hour, activity, toggles, counters, weather } = props;
  const spinRef = useRef(0);
  const busRef = useTypingBus();
  const sinceMug = useSinceChange(counters.mug);
  const screenOn = activity !== "sleep";
  const typing = activity === "work" || activity === "code";
  const steaming = () => activity === "coffee" || activity === "code" || sinceMug() < 8;
  const dark = 1 - daylight(hour) * (1 - (weather?.cloudy ?? 0.15) * 0.4);

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <Daylight hour={hour} cloudy={weather?.cloudy ?? 0.15} />
      <CameraRig view={props.view} nonce={props.viewNonce} />
      <Suspense fallback={null}>
        <Room
          hour={hour}
          weather={weather}
          sleeping={activity === "sleep"}
          toggles={toggles}
          counters={counters}
          dark={dark}
        />
      </Suspense>
      <Desk
        screenVariant={toggles.screen}
        screenOn={screenOn}
        typing={typing}
        laptopOpen={toggles.laptopOpen}
        deskLamp={toggles.deskLamp}
        music={toggles.music}
        dark={dark}
        steaming={steaming}
        busRef={busRef}
      />
      <Chair spins={counters.chair} spinRef={spinRef} />
      <Avatar
        activity={activity}
        spinRef={spinRef}
        busRef={busRef}
        typingRate={activity === "code" ? 9 : activity === "work" ? 6.5 : 0}
      />
    </>
  );
}

export default function RoomScene(props: RoomSceneProps) {
  const ctx = useMemo<RoomCtx>(
    () => ({ onItem: props.onItem, onHover: props.onHover, reducedMotion: props.reducedMotion }),
    [props.onItem, props.onHover, props.reducedMotion],
  );

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 2]}
      frameloop={props.active ? "always" : "never"}
      camera={{ position: [17, 15, 17], zoom: 60, near: 0.1, far: 200 }}
      onPointerMissed={() => props.onHover(null)}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <RoomContext.Provider value={ctx}>
        <Scene {...props} />
      </RoomContext.Provider>
      {/* Soft contact shadows in corners, glow on anything bright, filmic tone */}
      <EffectComposer multisampling={4}>
        <N8AO halfRes quality="medium" aoRadius={0.45} distanceFalloff={0.6} intensity={2.2} color="#1a1410" />
        <Bloom mipmapBlur luminanceThreshold={1.6} luminanceSmoothing={0.3} intensity={0.9} radius={0.7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.3} darkness={0.45} />
      </EffectComposer>
    </Canvas>
  );
}
