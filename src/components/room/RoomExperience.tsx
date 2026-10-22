"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check, Clock3, CloudRain, Cloud, Sun, Moon, RotateCcw, Trophy, Video, X } from "lucide-react";
import {
  activityAt,
  activityLabel,
  cameraViews,
  roomItems,
  roomModes,
  weatherLocation,
  type CameraView,
  type RoomItemId,
  type RoomMode,
} from "@/data/room";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import { daylight } from "./daylight";
import type { RoomCounters, RoomToggles } from "./RoomScene";

/* The 3D scene is only downloaded in the browser, on this page. */
const RoomScene = dynamic(() => import("./RoomScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="eyebrow animate-pulse text-white/50">Loading the room…</p>
    </div>
  ),
});

/* ---------------------------------------------------------------------------
   Time and weather
--------------------------------------------------------------------------- */

const phHourFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZone: siteConfig.timeZone,
});

function phHourNow() {
  const parts = phHourFormat.formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return (get("hour") % 24) + get("minute") / 60 + get("second") / 3600;
}

/** Philippine time, or a sped-up day while time-lapse is on (24 h ≈ 36 s). */
function useRoomHour(timelapse: boolean) {
  const [hour, setHour] = useState<number | null>(null);
  const simulated = useRef(0);

  useEffect(() => {
    if (!timelapse) {
      const tick = () => setHour(phHourNow());
      tick();
      const id = window.setInterval(tick, 15_000);
      return () => window.clearInterval(id);
    }
    simulated.current = phHourNow();
    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      simulated.current = (simulated.current + ((now - last) / 1000) * (24 / 36)) % 24;
      last = now;
      setHour(simulated.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [timelapse]);

  return hour;
}

type Weather = { temp: number; label: string; cloudy: number; rain: boolean };

/** WMO weather codes, as Open-Meteo reports them, to words and cloud cover. */
function describe(code: number): Omit<Weather, "temp"> {
  if (code === 0) return { label: "Clear", cloudy: 0, rain: false };
  if (code <= 2) return { label: "Partly cloudy", cloudy: 0.35, rain: false };
  if (code === 3) return { label: "Overcast", cloudy: 0.8, rain: false };
  if (code === 45 || code === 48) return { label: "Foggy", cloudy: 0.9, rain: false };
  if (code >= 51 && code <= 57) return { label: "Drizzle", cloudy: 0.8, rain: true };
  if (code >= 61 && code <= 67) return { label: "Rain", cloudy: 0.9, rain: true };
  if (code >= 80 && code <= 82) return { label: "Showers", cloudy: 0.85, rain: true };
  if (code >= 95) return { label: "Thunderstorm", cloudy: 1, rain: true };
  return { label: "Cloudy", cloudy: 0.6, rain: false };
}

/** Current weather where I am, from Open-Meteo (free, no key). Quietly absent on failure. */
function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const { latitude, longitude } = weatherLocation;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=Asia%2FManila`,
      { signal: controller.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const temp = Math.round(data?.current?.temperature_2m);
        const code = Number(data?.current?.weather_code);
        if (Number.isFinite(temp) && Number.isFinite(code)) setWeather({ temp, ...describe(code) });
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return weather;
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(reducedMotionQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

/* ---------------------------------------------------------------------------
   Room state
--------------------------------------------------------------------------- */

type LampOverride = boolean | null;

type State = {
  mode: RoomMode;
  view: CameraView;
  viewNonce: number;
  timelapse: boolean;
  overrides: { deskLamp: LampOverride; bedLamp: LampOverride; fairy: 0 | 1 | 2 | null };
  toggles: Omit<RoomToggles, "deskLamp" | "bedLamp" | "fairy">;
  counters: RoomCounters;
  selected: RoomItemId | null;
};

const initial: State = {
  mode: "live",
  view: "room",
  viewNonce: 0,
  timelapse: false,
  overrides: { deskLamp: null, bedLamp: null, fairy: null },
  toggles: {
    curtainsOpen: true,
    laptopOpen: true,
    screen: 0,
    clock24: false,
    poster: 0,
    diplomaTilt: false,
    music: false,
  },
  counters: { chair: 0, cap: 0, plant: 0, mug: 0 },
  selected: null,
};

type Action =
  | { type: "mode"; mode: RoomMode }
  | { type: "view"; view: CameraView }
  | { type: "timelapse" }
  | { type: "item"; id: RoomItemId; auto: { deskLamp: boolean; bedLamp: boolean; fairy: 0 | 1 | 2 } }
  | { type: "close" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "mode":
      // Changing activity hands the lamps back to the automatic rules.
      return { ...state, mode: action.mode, overrides: { deskLamp: null, bedLamp: null, fairy: null } };
    case "view":
      return { ...state, view: action.view, viewNonce: state.viewNonce + 1 };
    case "timelapse":
      return { ...state, timelapse: !state.timelapse };
    case "close":
      return { ...state, selected: null };
    case "item": {
      const { toggles, counters, overrides } = state;
      const next = { ...state, selected: action.id };
      switch (action.id) {
        case "deskLamp":
          next.overrides = { ...overrides, deskLamp: !action.auto.deskLamp };
          break;
        case "bedLamp":
          next.overrides = { ...overrides, bedLamp: !action.auto.bedLamp };
          break;
        case "fairyLights":
          next.overrides = { ...overrides, fairy: ((action.auto.fairy + 1) % 3) as 0 | 1 | 2 };
          break;
        case "curtains":
          next.toggles = { ...toggles, curtainsOpen: !toggles.curtainsOpen };
          break;
        case "laptop":
          next.toggles = { ...toggles, laptopOpen: !toggles.laptopOpen };
          break;
        case "monitor":
          next.toggles = { ...toggles, screen: ((toggles.screen + 1) % 3) as 0 | 1 | 2 };
          break;
        case "clock":
          next.toggles = { ...toggles, clock24: !toggles.clock24 };
          break;
        case "poster":
          next.toggles = { ...toggles, poster: toggles.poster + 1 };
          break;
        case "diploma":
          next.toggles = { ...toggles, diplomaTilt: !toggles.diplomaTilt };
          break;
        case "headphones":
          next.toggles = { ...toggles, music: !toggles.music };
          break;
        case "photo":
          break;
        case "chair":
          next.counters = { ...counters, chair: counters.chair + 1 };
          break;
        case "cap":
          next.counters = { ...counters, cap: counters.cap + 1 };
          break;
        case "plant":
          next.counters = { ...counters, plant: counters.plant + 1 };
          break;
        case "mug":
          next.counters = { ...counters, mug: counters.mug + 1 };
          break;
      }
      return next;
    }
  }
}

/* ---------------------------------------------------------------------------
   Found objects, remembered between visits
--------------------------------------------------------------------------- */

const FOUND_KEY = "room:found";

function useFound() {
  const [found, setFound] = useState<Set<RoomItemId>>(() => new Set());
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FOUND_KEY) ?? "[]") as RoomItemId[];
      // Restoring a saved game on mount is the point of this effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved.length) setFound(new Set(saved));
    } catch {
      // Unreadable or blocked storage: start fresh.
    }
  }, []);
  const mark = useCallback((id: RoomItemId) => {
    setFound((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem(FOUND_KEY, JSON.stringify([...next]));
      } catch {}
      if (next.size === roomItems.length) toast("You found everything in the room");
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    setFound(new Set());
    try {
      localStorage.removeItem(FOUND_KEY);
    } catch {}
  }, []);
  return { found, mark, reset };
}

/* ---------------------------------------------------------------------------
   The experience
--------------------------------------------------------------------------- */

const pill =
  "flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] whitespace-nowrap transition-colors";

export function RoomExperience() {
  const [state, dispatch] = useReducer(reducer, initial);
  const hour = useRoomHour(state.timelapse);
  const weather = useWeather();
  const reducedMotion = useReducedMotion();
  const { found, mark, reset } = useFound();
  const [hovered, setHovered] = useState<RoomItemId | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause rendering while the room is scrolled out of view.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const h = hour ?? 12;
  const activity = state.mode === "live" ? activityAt(h) : state.mode;
  const dark = daylight(h) < 0.5;

  // Lamps follow the activity and the hour unless someone has flicked them.
  const auto = useMemo(
    () => ({
      deskLamp: (activity === "work" || activity === "code") && dark,
      bedLamp: activity === "rest" && dark,
      fairy: (dark && activity !== "sleep" ? 1 : 0) as 0 | 1 | 2,
    }),
    [activity, dark],
  );
  const toggles: RoomToggles = {
    ...state.toggles,
    deskLamp: state.overrides.deskLamp ?? auto.deskLamp,
    bedLamp: state.overrides.bedLamp ?? auto.bedLamp,
    fairy: state.overrides.fairy ?? auto.fairy,
  };

  const onItem = useCallback(
    (id: RoomItemId) => {
      mark(id);
      dispatch({
        type: "item",
        id,
        auto: {
          deskLamp: toggles.deskLamp,
          bedLamp: toggles.bedLamp,
          fairy: toggles.fairy,
        },
      });
    },
    [mark, toggles.deskLamp, toggles.bedLamp, toggles.fairy],
  );

  const selected = roomItems.find((i) => i.id === state.selected);
  const hoveredItem = roomItems.find((i) => i.id === hovered);
  const clock =
    hour === null
      ? "--:--"
      : new Date(2000, 0, 1, Math.floor(h), Math.floor((h % 1) * 60)).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
  const WeatherIcon = weather?.rain ? CloudRain : weather && weather.cloudy > 0.5 ? Cloud : dark ? Moon : Sun;

  return (
    <div className="flex flex-col gap-3">
      {/* Stage */}
      <div
        ref={stage}
        className="relative h-[68vh] min-h-[460px] overflow-hidden rounded-[0.875rem] border border-rule bg-black sm:h-[74vh]"
      >
        <RoomScene
          hour={h}
          activity={activity}
          view={state.view}
          viewNonce={state.viewNonce}
          weather={weather ? { cloudy: weather.cloudy, rain: weather.rain } : null}
          toggles={toggles}
          counters={state.counters}
          reducedMotion={reducedMotion}
          active={visible}
          onItem={onItem}
          onHover={setHovered}
        />

        {/* Top: time and weather, and the found counter */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          <div className="pointer-events-auto flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-[13px] text-white backdrop-blur-md">
            <span className="font-semibold tabular-nums">{clock}</span>
            {weather && (
              <span className="flex items-center gap-1.5 text-white/75">
                <WeatherIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                {weather.temp}°C · {weather.label}
              </span>
            )}
            <span className="eyebrow rounded-full bg-white/10 px-2 py-0.5 text-white/80">
              {state.timelapse ? "Time-lapse" : `${weatherLocation.label} · live`}
            </span>
          </div>
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-[13px] text-white backdrop-blur-md">
            <Trophy className="h-3.5 w-3.5 text-white/70" strokeWidth={1.75} aria-hidden />
            <span className="tabular-nums">
              {found.size}/{roomItems.length}
            </span>
            <span className="sr-only">objects found</span>
          </div>
        </div>

        {/* What the pointer is over, and what I'm doing */}
        <div className="pointer-events-none absolute bottom-[7.5rem] left-3 flex flex-col gap-1.5 sm:bottom-3">
          <p className="eyebrow w-fit rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-white/80 backdrop-blur-md">
            {activityLabel[activity]}
            {state.mode === "live" && " · live"}
          </p>
          {hoveredItem && (
            <p className="w-fit rounded-lg bg-white px-2.5 py-1 text-[13px] font-medium text-black">
              {hoveredItem.label}
              <span className="text-black/50"> · click</span>
            </p>
          )}
        </div>

        {/* Info card for the last thing clicked */}
        {selected && (
          <div
            role="status"
            className="absolute right-3 bottom-[7.5rem] w-[min(18rem,calc(100%-1.5rem))] rounded-xl border border-white/10 bg-black/75 p-3.5 text-white backdrop-blur-md sm:bottom-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13px] font-semibold">{selected.label}</p>
              <button
                type="button"
                onClick={() => dispatch({ type: "close" })}
                aria-label="Close"
                className="-m-1 rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-white/75">{selected.note}</p>
            {selected.link && (
              <Link
                href={selected.link.href}
                className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-medium text-white underline-offset-4 hover:underline"
              >
                {selected.link.label}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </Link>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-3 sm:bottom-14">
          <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/60 p-1 text-white backdrop-blur-md">
            <Video className="mx-2 h-3.5 w-3.5 shrink-0 text-white/60" strokeWidth={1.75} aria-hidden />
            {cameraViews.map((v) => (
              <button
                key={v.value}
                type="button"
                aria-pressed={state.view === v.value}
                onClick={() => dispatch({ type: "view", view: v.value })}
                className={cn(pill, state.view === v.value ? "bg-white/15" : "text-white/70 hover:text-white")}
              >
                {v.label}
              </button>
            ))}
            <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-white/15" />
            <button
              type="button"
              aria-pressed={state.timelapse}
              onClick={() => dispatch({ type: "timelapse" })}
              className={cn(pill, state.timelapse ? "bg-white text-black" : "text-white/70 hover:text-white")}
            >
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Time-lapse
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 hidden justify-center p-3 sm:flex">
          <ModeBar mode={state.mode} onMode={(m) => dispatch({ type: "mode", mode: m })} />
        </div>
      </div>

      {/* On phones the activity bar sits under the stage */}
      <div className="flex justify-center sm:hidden">
        <ModeBar mode={state.mode} onMode={(m) => dispatch({ type: "mode", mode: m })} light />
      </div>

      {/* Things to find — also the keyboard-friendly way to play */}
      <section aria-labelledby="find-heading" className="panel">
        <header className="flex min-h-12 items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
          <h2 id="find-heading" className="text-[13px] font-medium text-ink">
            Things to find <span className="text-ink-3 tabular-nums">· {found.size} of {roomItems.length}</span>
          </h2>
          {found.size > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-3 transition-colors hover:text-ink"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2} aria-hidden />
              Start over
            </button>
          )}
        </header>
        <ul className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {roomItems.map((item) => {
            const done = found.has(item.id);
            return (
              <li key={item.id} className="bg-surface">
                <button
                  type="button"
                  onClick={() => onItem(item.id)}
                  className="flex h-full w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-bg-raised/60"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      done ? "border-ink bg-ink text-bg" : "border-rule-strong",
                    )}
                  >
                    {done && <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-[13px] font-medium", done ? "text-ink" : "text-ink-3")}>
                      {done ? item.label : "Not found yet"}
                    </span>
                    <span className="block text-xs leading-relaxed text-ink-3">{done ? item.note : item.hint}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function ModeBar({ mode, onMode, light = false }: { mode: RoomMode; onMode: (m: RoomMode) => void; light?: boolean }) {
  return (
    <div
      role="group"
      aria-label="What I'm doing"
      className={cn(
        "no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1",
        light ? "border border-rule bg-surface" : "border border-white/10 bg-black/60 text-white backdrop-blur-md",
      )}
    >
      {roomModes.map((m) => {
        const on = mode === m.value;
        return (
          <button
            key={m.value}
            type="button"
            aria-pressed={on}
            onClick={() => onMode(m.value)}
            className={cn(
              pill,
              on
                ? light
                  ? "bg-ink text-bg"
                  : "bg-white text-black"
                : light
                  ? "text-ink-3 hover:text-ink"
                  : "text-white/70 hover:text-white",
            )}
          >
            {m.value === "live" && (
              <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", on ? (light ? "bg-bg" : "bg-black") : "bg-current")} />
            )}
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
