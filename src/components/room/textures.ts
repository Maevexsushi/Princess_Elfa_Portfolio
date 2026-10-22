import { CanvasTexture, SRGBColorSpace } from "three";
import { daylight, rgb, skyColor } from "./daylight";

/**
 * Everything readable in the room — screens, the clock, the poster, the
 * diploma, the view from the window — is drawn on a 2D canvas and used as a
 * texture. Each helper returns the texture and a function to repaint it.
 */
export function canvasTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  const paint = (draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
    ctx.clearRect(0, 0, width, height);
    draw(ctx, width, height);
    texture.needsUpdate = true;
  };
  return { texture, paint };
}

const SANS = "system-ui, -apple-system, Segoe UI, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Consolas, monospace";

/** The wall clock's digits. */
export function drawClock(text: string, suffix: string) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = `600 ${h * 0.56}px ${MONO}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w * 0.47, h * 0.54);
    if (suffix) {
      ctx.font = `600 ${h * 0.18}px ${MONO}`;
      ctx.fillStyle = "#9a9a9a";
      ctx.fillText(suffix, w * 0.9, h * 0.3);
    }
  };
}

export function drawPoster(motto: string) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, w - 48, h - 48);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = motto.split("\n");
    ctx.font = `800 ${w * 0.16}px ${SANS}`;
    lines.forEach((line, i) => ctx.fillText(line, w / 2, h / 2 + (i - (lines.length - 1) / 2) * w * 0.19));
    ctx.font = `600 ${w * 0.05}px ${MONO}`;
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("— P.E.", w / 2, h - 70);
  };
}

export function drawDiploma() {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#f6f1e4";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#b89b5e";
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.fillStyle = "#3a3123";
    ctx.textAlign = "center";
    ctx.font = `600 ${w * 0.05}px Georgia, serif`;
    ctx.fillText("BULACAN STATE UNIVERSITY", w / 2, h * 0.2);
    ctx.font = `${w * 0.035}px Georgia, serif`;
    ctx.fillText("confers upon", w / 2, h * 0.32);
    ctx.font = `italic 600 ${w * 0.072}px Georgia, serif`;
    ctx.fillText("Princess Mae D. Elfa", w / 2, h * 0.46);
    ctx.font = `${w * 0.036}px Georgia, serif`;
    ctx.fillText("Bachelor of Science in Information Technology", w / 2, h * 0.6);
    ctx.font = `italic 600 ${w * 0.05}px Georgia, serif`;
    ctx.fillText("Cum Laude · 2026", w / 2, h * 0.72);
    ctx.fillStyle = "#c8a24a";
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.82, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
  };
}

/**
 * The view through the window: sky by the hour, a sun or moon, stars at
 * night, a city skyline whose windows light up after dark, and cloud cover.
 */
export function drawWindowView(hour: number, cloudy: number) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const sky = skyColor(hour);
    const top: [number, number, number] = [sky[0] * 0.7, sky[1] * 0.7, sky[2] * 0.75];
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, rgb(top));
    grad.addColorStop(1, rgb(sky));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const day = daylight(hour);
    // Stars
    if (day < 0.4) {
      let seed = 3;
      const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - day / 0.4) * (1 - cloudy)})`;
      for (let i = 0; i < 40; i++) ctx.fillRect(rand() * w, rand() * h * 0.55, 2, 2);
    }
    // Sun or moon, travelling across the window through the day / night
    const isDay = hour >= 6 && hour < 18;
    const t = isDay ? (hour - 6) / 12 : ((hour + 6) % 24) / 12;
    const cx = w * (0.1 + 0.8 * t);
    const cy = h * (0.62 - Math.sin(t * Math.PI) * 0.45);
    ctx.fillStyle = isDay ? "rgba(255,240,200,0.95)" : "rgba(240,240,255,0.9)";
    ctx.beginPath();
    ctx.arc(cx, cy, isDay ? 26 : 18, 0, Math.PI * 2);
    ctx.fill();
    // Clouds
    if (cloudy > 0) {
      ctx.fillStyle = day > 0.3 ? `rgba(255,255,255,${0.75 * cloudy})` : `rgba(90,96,120,${0.8 * cloudy})`;
      const blobs = [
        [0.2, 0.25, 70],
        [0.32, 0.22, 55],
        [0.7, 0.3, 80],
        [0.82, 0.27, 60],
        [0.5, 0.15, 50],
      ];
      for (const [bx, by, r] of blobs) {
        ctx.beginPath();
        ctx.ellipse(bx * w, by * h, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Skyline
    let seed = 11;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let x = 0;
    while (x < w) {
      const bw = 40 + rand() * 70;
      const bh = h * (0.18 + rand() * 0.32);
      ctx.fillStyle = day > 0.5 ? "#5d6779" : "#141826";
      ctx.fillRect(x, h - bh, bw - 4, bh);
      if (day < 0.6) {
        for (let wy = h - bh + 10; wy < h - 8; wy += 16) {
          for (let wx = x + 6; wx < x + bw - 12; wx += 12) {
            if (rand() > 0.55) {
              ctx.fillStyle = `rgba(255,214,140,${0.85 * (1 - day / 0.6)})`;
              ctx.fillRect(wx, wy, 5, 7);
            }
          }
        }
      }
      x += bw;
    }
  };
}
