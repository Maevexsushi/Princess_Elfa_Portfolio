/**
 * How the light in the room changes over a day. Pure functions of the hour
 * (0–24, Philippine time), shared by the 3D lighting and the window view.
 */

const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** 0 at night, 1 in full daylight, easing through dawn and dusk. */
export function daylight(hour: number) {
  return smooth(5.4, 7, hour) * (1 - smooth(17.4, 19, hour));
}

/** 1 at sunrise and sunset, 0 otherwise — for the warm low-sun tint. */
export function goldenHour(hour: number) {
  const dawn = 1 - Math.min(1, Math.abs(hour - 6.3) / 1.1);
  const dusk = 1 - Math.min(1, Math.abs(hour - 18) / 1.1);
  return Math.max(0, dawn, dusk);
}

type Stop = [hour: number, rgb: [number, number, number]];

const skyStops: Stop[] = [
  [0, [11, 16, 38]],
  [4.8, [20, 26, 62]],
  [6, [243, 166, 131]],
  [7.5, [158, 205, 243]],
  [12, [134, 192, 240]],
  [16.5, [160, 196, 232]],
  [18, [240, 138, 93]],
  [19.2, [40, 42, 90]],
  [24, [11, 16, 38]],
];

export function skyColor(hour: number): [number, number, number] {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < skyStops.length - 1; i++) {
    const [h0, c0] = skyStops[i];
    const [h1, c1] = skyStops[i + 1];
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * t)) as [number, number, number];
    }
  }
  return skyStops[0][1];
}

export const rgb = (c: [number, number, number], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
