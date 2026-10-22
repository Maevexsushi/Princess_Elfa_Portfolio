import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * Live screens. Each is a 2D canvas redrawn a few times a second and used as
 * a texture. The editor types real code from this portfolio, one character
 * per keystroke the avatar makes — so the hands and the screen agree.
 */

const MONO = "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

export function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return { canvas, ctx, texture };
}

/* ---------------------------------------------------------------------------
   Code — real excerpts from this repository
--------------------------------------------------------------------------- */

const SNIPPETS: { file: string; code: string }[] = [
  {
    file: "IdBadge.tsx",
    code: `/** Pull two points to at most \`len\` apart. */
function constrain(a: Point, b: Point, len: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 0.0001;
  if (d <= len) return;
  const diff = (d - len) / d;
  a.x += dx * diff * 0.5;
  a.y += dy * diff * 0.5;
  b.x -= dx * diff * 0.5;
  b.y -= dy * diff * 0.5;
}

function step() {
  for (let i = 1; i <= SEGMENTS; i++) integrate(rope[i]);
  integrate(tail);
  for (let k = 0; k < ITERATIONS; k++) {
    rope[0].x = anchor.x;
    rope[0].y = anchor.y;
  }
}`,
  },
  {
    file: "insights.ts",
    code: `/** How many projects each technology appears in. */
export function techUsage(): TechUsage[] {
  const map = new Map<string, TechUsage>();
  for (const p of projects) {
    for (const raw of new Set(p.technologies.map(normalizeTech))) {
      const entry = map.get(raw) ?? { name: raw, count: 0, projects: [] };
      entry.count += 1;
      entry.projects.push(p.title);
      map.set(raw, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

// "Next.js 16" and "Next.js" are the same tool.
export function normalizeTech(name: string) {
  return name.replace(/\\s+v?\\d+(\\.\\d+)*$/i, "").trim();
}`,
  },
  {
    file: "room.ts",
    code: `export const daySchedule = [
  { from: 0, activity: "sleep" },
  { from: 7, activity: "coffee" },
  { from: 8, activity: "work" },
  { from: 12, activity: "rest" },
  { from: 13, activity: "work" },
  { from: 18, activity: "rest" },
  { from: 21, activity: "code" },
];

export function activityAt(hour: number): Activity {
  let current = daySchedule[0].activity;
  for (const slot of daySchedule) {
    if (hour >= slot.from) current = slot.activity;
  }
  return current;
}`,
  },
];

type Token = { text: string; color: string };

const KEYWORDS = new Set([
  "const", "let", "function", "return", "if", "for", "of", "new", "export", "import", "from", "type", "as", "true", "false",
]);
const THEME = {
  bg: "#0f1014",
  panel: "#16171c",
  border: "#23252c",
  text: "#eef0f4",
  muted: "#5c6370",
  keyword: "#c792ea",
  string: "#c3e88d",
  number: "#f78c6c",
  comment: "#8a91b8",
  fn: "#82aaff",
  punct: "#89ddff",
};

/** A small, forgiving highlighter — enough to read as code from across a room. */
function tokenize(line: string): Token[] {
  const out: Token[] = [];
  const comment = line.search(/\/\/|\/\*\*|\*\//);
  const body = comment >= 0 ? line.slice(0, comment) : line;
  const re = /("[^"]*"|'[^']*'|`[^`]*`|\b\d+(\.\d+)?\b|\b[A-Za-z_]\w*\b|\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    const t = m[0];
    let color = THEME.text;
    if (/^["'`]/.test(t)) color = THEME.string;
    else if (/^\d/.test(t)) color = THEME.number;
    else if (KEYWORDS.has(t)) color = THEME.keyword;
    else if (/^[A-Za-z_]/.test(t) && body[m.index + t.length] === "(") color = THEME.fn;
    else if (/^[{}()[\];,.=<>+\-*/?:!&|]$/.test(t)) color = THEME.punct;
    out.push({ text: t, color });
  }
  if (comment >= 0) out.push({ text: line.slice(comment), color: THEME.comment });
  return out;
}

/* ---------------------------------------------------------------------------
   Editor
--------------------------------------------------------------------------- */

export class EditorScreen {
  private snippet = 0;
  private typed = 0;
  private lastStrokes = 0;
  private holdUntil = 0;
  private scroll = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private w: number,
    private h: number,
  ) {}

  /** Advance by the keystrokes made since last time. */
  update(strokes: number, time: number) {
    const code = SNIPPETS[this.snippet].code;
    const fresh = strokes - this.lastStrokes;
    this.lastStrokes = strokes;
    if (time < this.holdUntil) return;
    if (this.typed >= code.length) {
      // Finished: pause on the full file, then start the next one.
      this.holdUntil = time + 2.5;
      this.snippet = (this.snippet + 1) % SNIPPETS.length;
      this.typed = 0;
      this.scroll = 0;
      return;
    }
    // Leading whitespace is free: editors auto-indent.
    let n = fresh;
    while (n > 0 && this.typed < code.length) {
      this.typed++;
      if (code[this.typed - 1] !== " ") n--;
    }
  }

  draw(time: number, idle: boolean) {
    const { ctx, w, h } = this;
    const { file, code } = SNIPPETS[this.snippet];
    ctx.fillStyle = THEME.bg;
    ctx.fillRect(0, 0, w, h);

    // Activity bar and explorer
    ctx.fillStyle = THEME.panel;
    ctx.fillRect(0, 0, 44, h);
    ctx.fillRect(44, 0, 150, h);
    ctx.fillStyle = THEME.border;
    ctx.fillRect(194, 0, 1, h);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i === 0 ? "#d7dae0" : "#3a3d46";
      ctx.fillRect(14, 18 + i * 40, 16, 16);
    }
    ctx.font = `600 11px ${SANS}`;
    ctx.fillStyle = THEME.muted;
    ctx.fillText("EXPLORER", 58, 24);
    const files = ["components", "  IdBadge.tsx", "  Panel.tsx", "lib", "  insights.ts", "data", "  room.ts", "  projects.ts"];
    files.forEach((f, i) => {
      const active = f.trim() === file;
      if (active) {
        ctx.fillStyle = "#23252c";
        ctx.fillRect(44, 38 + i * 22, 150, 22);
      }
      ctx.fillStyle = active ? "#ffffff" : f.startsWith(" ") ? "#9aa0ab" : "#6b717d";
      ctx.font = `${active ? 600 : 400} 12px ${SANS}`;
      ctx.fillText(f, 58, 53 + i * 22);
    });

    // Tab bar
    ctx.fillStyle = THEME.panel;
    ctx.fillRect(195, 0, w - 195, 32);
    ctx.fillStyle = THEME.bg;
    ctx.fillRect(195, 0, 130, 32);
    ctx.fillStyle = "#ffffff";
    ctx.font = `12px ${SANS}`;
    ctx.fillText(file, 212, 21);
    ctx.fillStyle = THEME.muted;
    ctx.fillText("●", 306, 21);

    // Code
    const lines = code.slice(0, this.typed).split("\n");
    const lineH = 25;
    const top = 58;
    const visible = Math.floor((h - top - 30) / lineH);
    const target = Math.max(0, lines.length - visible + 2);
    this.scroll += (target - this.scroll) * 0.2;
    const first = Math.floor(this.scroll);
    ctx.save();
    ctx.beginPath();
    ctx.rect(195, 34, w - 255, h - 60);
    ctx.clip();
    ctx.font = `500 18px ${MONO}`;
    for (let i = first; i < Math.min(lines.length, first + visible + 1); i++) {
      const y = top + (i - this.scroll) * lineH;
      const current = i === lines.length - 1;
      if (current) {
        ctx.fillStyle = "#1a1c22";
        ctx.fillRect(195, y - 18, w - 255, lineH);
      }
      ctx.fillStyle = current ? "#e0e3e8" : "#5a606c";
      ctx.textAlign = "right";
      ctx.fillText(String(i + 1), 230, y);
      ctx.textAlign = "left";
      let x = 248;
      for (const tok of tokenize(lines[i])) {
        ctx.fillStyle = tok.color;
        ctx.fillText(tok.text, x, y);
        x += ctx.measureText(tok.text).width;
      }
      if (current && (idle ? Math.floor(time * 2) % 2 === 0 : Math.floor(time * 3) % 3 !== 0)) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 1, y - 17, 3, 22);
      }
    }
    ctx.restore();

    // Minimap
    ctx.fillStyle = THEME.panel;
    ctx.fillRect(w - 60, 32, 60, h - 54);
    code.split("\n").forEach((line, i) => {
      const len = line.trimStart().length;
      if (!len) return;
      ctx.fillStyle = i < lines.length ? "#3d4250" : "#262931";
      ctx.fillRect(w - 52 + (line.length - len) * 1.2, 40 + i * 3.2, Math.min(44, len * 1.1), 2);
    });

    // Status bar
    ctx.fillStyle = "#1b1d23";
    ctx.fillRect(0, h - 22, w, 22);
    ctx.fillStyle = "#9aa0ab";
    ctx.font = `11px ${SANS}`;
    const last = lines[lines.length - 1] ?? "";
    ctx.fillText("⎇ main   ✓ 0 problems", 12, h - 7);
    ctx.textAlign = "right";
    ctx.fillText(`Ln ${lines.length}, Col ${last.length + 1}   TypeScript React   Prettier`, w - 12, h - 7);
    ctx.textAlign = "left";
  }
}

/* ---------------------------------------------------------------------------
   Acadify — the app I'm building, alive
--------------------------------------------------------------------------- */

export function drawAcadify(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = "#f6f6f6";
  ctx.fillRect(0, 0, w, h);
  // Sidebar
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 150, h);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `700 18px ${SANS}`;
  ctx.fillText("Acadify", 20, 34);
  ["Dashboard", "Subjects", "Quizzes", "Planner", "Progress"].forEach((label, i) => {
    if (i === 4) {
      ctx.fillStyle = "#ededed";
      ctx.beginPath();
      ctx.roundRect(10, 58 + i * 34, 130, 28, 6);
      ctx.fill();
    }
    ctx.fillStyle = i === 4 ? "#0a0a0a" : "#707070";
    ctx.font = `${i === 4 ? 600 : 400} 14px ${SANS}`;
    ctx.fillText(label, 22, 77 + i * 34);
  });
  // Header
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `600 22px ${SANS}`;
  ctx.fillText("Progress", 175, 42);
  ctx.fillStyle = "#707070";
  ctx.font = `14px ${SANS}`;
  ctx.fillText("Sprint 62 of 84 · Deadlines that know how ready you are", 175, 64);

  const card = (x: number, y: number, cw: number, ch: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x, y, cw, ch, 10);
    ctx.fill();
    ctx.strokeStyle = "#e6e6e6";
    ctx.stroke();
  };

  // Ring: roadmap progress, drawing in on a loop
  card(175, 82, 200, 200);
  const p = 0.74 * Math.min(1, ((t % 8) / 2.2) ** 0.7);
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#ececec";
  ctx.beginPath();
  ctx.arc(275, 182, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(275, 182, 62, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `700 30px ${SANS}`;
  ctx.textAlign = "center";
  ctx.fillText(`${Math.round(p * 100)}%`, 275, 192);
  ctx.textAlign = "left";

  // Mastery by topic: bars that breathe
  card(390, 82, w - 410, 200);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `600 14px ${SANS}`;
  ctx.fillText("Topic mastery", 408, 108);
  const topics = [0.82, 0.64, 0.91, 0.47, 0.73, 0.58];
  const bw = (w - 450) / topics.length;
  topics.forEach((v, i) => {
    const val = v * (0.92 + 0.08 * Math.sin(t * 1.4 + i));
    const bh = 130 * val;
    ctx.fillStyle = v < 0.6 ? "#c9c9c9" : "#0a0a0a";
    ctx.beginPath();
    ctx.roundRect(410 + i * bw, 262 - bh, bw - 14, bh, 4);
    ctx.fill();
  });

  // Ticks: one per sprint
  card(175, 296, w - 195, 110);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `600 14px ${SANS}`;
  ctx.fillText("Roadmap", 193, 322);
  const ticks = 84;
  const tw = (w - 231) / ticks;
  for (let i = 0; i < ticks; i++) {
    const live = i === 61 && Math.floor(t * 2) % 2 === 0;
    ctx.fillStyle = i < 61 ? "#0a0a0a" : live || i === 61 ? "#0a0a0a" : "#e4e4e4";
    if (i === 61 && !live) ctx.fillStyle = "#9a9a9a";
    ctx.fillRect(193 + i * tw, 338, tw - 1.5, 46);
  }

  // A cursor wandering the dashboard
  const cx = 420 + Math.sin(t * 0.7) * 180;
  const cy = 200 + Math.sin(t * 1.1) * 110;
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + 18);
  ctx.lineTo(cx + 5, cy + 13);
  ctx.lineTo(cx + 12, cy + 13);
  ctx.closePath();
  ctx.fill();
}

/* ---------------------------------------------------------------------------
   This portfolio, on the monitor, with a cursor exploring it
--------------------------------------------------------------------------- */

export function drawPortfolio(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 150, h);
  ctx.fillStyle = "#e5e5e5";
  ctx.fillRect(150, 0, 1, h);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `600 14px ${SANS}`;
  ctx.fillText("Princess Elfa", 18, 30);
  const active = Math.floor(t / 2.5) % 5;
  ["Overview", "Projects", "Experience", "Stack", "Setup"].forEach((label, i) => {
    if (i === active) {
      ctx.fillStyle = "#ededed";
      ctx.beginPath();
      ctx.roundRect(10, 56 + i * 32, 130, 26, 6);
      ctx.fill();
    }
    ctx.fillStyle = i === active ? "#0a0a0a" : "#707070";
    ctx.font = `13px ${SANS}`;
    ctx.fillText(label, 22, 74 + i * 32);
  });
  const panel = (x: number, y: number, pw: number, ph: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x, y, pw, ph, 8);
    ctx.fill();
    ctx.strokeStyle = "#e5e5e5";
    ctx.stroke();
  };
  // ID badge panel with a tiny swinging badge
  panel(168, 18, 170, 250);
  const swing = Math.sin(t * 1.6) * 0.12;
  ctx.save();
  ctx.translate(253, 30);
  ctx.rotate(swing);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(-3, 0, 6, 60);
  ctx.beginPath();
  ctx.roundRect(-48, 60, 96, 140, 8);
  ctx.fill();
  ctx.fillStyle = "#7a8aa3";
  ctx.fillRect(-38, 78, 76, 76);
  ctx.restore();
  // Intro
  panel(352, 18, w - 370, 120);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `600 24px ${SANS}`;
  ctx.fillText("Princess Mae D. Elfa", 372, 62);
  ctx.fillStyle = "#707070";
  ctx.font = `15px ${SANS}`;
  ctx.fillText("Full-stack & AI web developer", 372, 88);
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.roundRect(372, 102, 110, 24, 12);
  ctx.fill();
  // KPI tiles
  const kw = (w - 370 - 30) / 4;
  ["4", "2+", "30%", "15%"].forEach((v, i) => {
    panel(352 + i * (kw + 10), 150, kw, 118);
    ctx.fillStyle = "#0a0a0a";
    ctx.font = `600 28px ${SANS}`;
    ctx.fillText(v, 368 + i * (kw + 10), 222);
  });
  // Projects table
  panel(168, 282, w - 186, h - 300);
  const hover = Math.floor(t / 1.5) % 4;
  for (let r = 0; r < 4; r++) {
    const y = 306 + r * 28;
    if (r === hover) {
      ctx.fillStyle = "#f2f2f2";
      ctx.fillRect(169, y - 16, w - 188, 26);
    }
    ctx.fillStyle = "#d9d9d9";
    ctx.fillRect(184, y - 8, 34, 16);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(228, y - 6, 140, 9);
    ctx.fillStyle = r === 1 ? "#0a0a0a" : "#e1e1e1";
    ctx.beginPath();
    ctx.roundRect(420, y - 9, 80, 16, 8);
    ctx.fill();
  }
  // Cursor gliding between rows
  const cx = 300 + Math.sin(t * 0.9) * 40;
  const cy = 306 + hover * 28 + Math.sin(t * 3) * 2;
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + 16);
  ctx.lineTo(cx + 4, cy + 12);
  ctx.lineTo(cx + 11, cy + 12);
  ctx.closePath();
  ctx.fill();
}

/* ---------------------------------------------------------------------------
   Laptop: a dev server's log, scrolling
--------------------------------------------------------------------------- */

const LOG = [
  "$ npm run dev",
  "▲ Next.js 16 (Turbopack)",
  "- Local:  http://localhost:3000",
  "✓ Ready in 1.1s",
  "○ Compiling /setup ...",
  "✓ Compiled in 640ms",
  " GET /setup 200 in 38ms",
  " GET / 200 in 22ms",
  " GET /projects 200 in 19ms",
  "✓ Compiled in 212ms",
  " GET /projects/acadify 200 in 27ms",
  " GET /stack 200 in 18ms",
];

export function drawTerminal(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = "#0b0c0f";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1a1c21";
  ctx.fillRect(0, 0, w, 20);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(12 + i * 14, 10, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  const shown = Math.floor(t / 0.9);
  const lineH = 17;
  const max = Math.floor((h - 28) / lineH);
  ctx.font = `12px ${MONO}`;
  for (let i = 0; i < max; i++) {
    const idx = shown - max + 1 + i;
    if (idx < 0) continue;
    const line = idx < 4 ? LOG[idx] : LOG[4 + ((idx - 4) % (LOG.length - 4))];
    ctx.fillStyle = line.startsWith("✓") ? "#7ee787" : line.startsWith("$") ? "#ffffff" : line.startsWith("▲") ? "#ffffff" : "#8b929e";
    ctx.fillText(line, 10, 38 + i * lineH);
  }
  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, 38 + Math.min(max, shown + 1) * lineH - 12, 7, 13);
  }
}
