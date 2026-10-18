import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";
import { createValueNoise } from "@/lib/valueNoise";

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FONT_FAMILY = '"JetBrains Mono", ui-monospace, monospace';
const FONT_SIZE_PX = 12;
const LINE_HEIGHT_PX = 15;
const MAX_DPR = 2;
const FRAME_INTERVAL_MS = 1000 / 60;
/** Slow machines fall back to 30fps when a frame's own work gets expensive, and recover when it eases. */
const SLOW_FRAME_INTERVAL_MS = 1000 / 30;
const SLOW_WORK_MS = 9;
const FAST_WORK_MS = 4;
const WORK_SMOOTHING = 0.1;
const MAX_FRAME_SECONDS = 0.1;
const BRIGHTNESS_LEVELS = 12;
const EMPTY_CELL = -1;

/** The hotspot stays grey, while scattered characters carry the accent at every brightness. */
const HOTSPOT_PALETTE = 0;
const SHARD_PALETTE = 1;
const SHARD_TINT_MIN = 0.7;

/** Pointer movement leaves heat behind. More movement means more heat, which lasts longer. */
const HEAT_CELL_PX = 20;
const HEAT_RADIUS_PX = 140;
const HEAT_PER_PX = 0.008;
const HEAT_STAMP_SPACING_PX = 16;
const HEAT_MAX = 3;
const HEAT_DECAY_PER_SECOND = 0.6;
const HEAT_EPSILON = 0.01;

/** Heat sets how dense the hotspot is, but brightness stops rising at one unit of heat. */
const HOTSPOT_BRIGHTNESS = 0.45;
const HOTSPOT_SPARSE_FROM = 0.55;
const HOTSPOT_DENSE_FROM = 0.25;
const HOTSPOT_FULL_DENSITY_HEAT = 1.5;
const HOTSPOT_FEATHER = 0.2;
const HOTSPOT_SHAPE_SCALE = 1 / 260;
const HOTSPOT_DETAIL_SCALE = 1 / 110;
const HOTSPOT_DETAIL_WEIGHT = 0.35;
const HOTSPOT_DRIFT_PER_SECOND = 0.15;
/** Share of all characters swapped per second, so the flicker rate does not depend on frame rate. */
const HOTSPOT_SCRAMBLE_PER_SECOND = 0.9;

/**
 * A click throws the characters around the pointer outward. They slow down,
 * drift slightly downward and fade, moving freely instead of along the grid.
 */
const SCATTER_RADIUS_PX = 55;
/** Skipping some cells keeps the scatter loose instead of a solid disc. */
const SCATTER_KEEP = 0.65;
const SCATTER_MIN_SPEED_PX = 60;
const SCATTER_SPEED_RANGE_PX = 180;
/** Characters at the rim travel half as far as those under the pointer. */
const SCATTER_RIM_SLOWDOWN = 0.5;
const SCATTER_LIFT_PX = 40;
/** Drag makes each character cover its full distance early and then ease to a stop. */
const SCATTER_DRAG = 3;
const SCATTER_GRAVITY_PX = 240;
const SCATTER_MIN_LIFE_SECONDS = 0.5;
const SCATTER_LIFE_RANGE_SECONDS = 0.4;
const SCATTER_BRIGHTNESS = 0.95;
const SCATTER_FADE_POWER = 1.5;
const MAX_SHARDS = 480;

/** Pointer activity inside these elements, such as the terminal window, never reaches the field. */
export const QUIET_ZONE_ATTRIBUTE = "data-char-field-quiet";
const QUIET_ZONE_SELECTOR = `[${QUIET_ZONE_ATTRIBUTE}]`;

/** Day needs a lighter touch, or the field fights the dark body text. */
const MAX_ALPHA: Record<Theme, number> = { dark: 0.55, light: 0.45 };

type Rgb = [number, number, number];

/** One scattered character. Positions and velocities are in canvas pixels. */
type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  glyph: number;
  bornAt: number;
  life: number;
};

function inQuietZone(event: PointerEvent): boolean {
  return event.target instanceof Element && event.target.closest(QUIET_ZONE_SELECTOR) !== null;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** The theme tokens in index.css are always six-digit hex. */
function readColorToken(name: string): Rgb {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().slice(1);
  const value = parseInt(hex, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Pre-renders every glyph at every brightness in both palettes, so a frame is only drawImage calls. */
function buildAtlas(cellW: number, cellH: number, dpr: number, theme: Theme): HTMLCanvasElement {
  const atlas = document.createElement("canvas");
  atlas.width = GLYPHS.length * cellW;
  atlas.height = 2 * BRIGHTNESS_LEVELS * cellH;
  const ctx = atlas.getContext("2d");
  if (!ctx) return atlas;

  const dim = readColorToken("--muted");
  const bright = readColorToken("--accent");
  ctx.font = `${FONT_SIZE_PX * dpr}px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const palette of [HOTSPOT_PALETTE, SHARD_PALETTE]) {
    for (let level = 1; level <= BRIGHTNESS_LEVELS; level++) {
      const strength = level / BRIGHTNESS_LEVELS;
      const tint = palette === SHARD_PALETTE ? SHARD_TINT_MIN + (1 - SHARD_TINT_MIN) * strength : 0;
      const [r, g, b] = dim.map((channel, i) => Math.round(channel + (bright[i] - channel) * tint));
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${strength * MAX_ALPHA[theme]})`;
      const y = (palette * BRIGHTNESS_LEVELS + level - 1) * cellH + cellH / 2;
      for (let i = 0; i < GLYPHS.length; i++) {
        ctx.fillText(GLYPHS[i], i * cellW + cellW / 2, y);
      }
    }
  }
  return atlas;
}

type CharFieldProps = {
  theme: Theme;
  reduceMotion: boolean;
};

/**
 * Faint characters gather where the pointer moves and fade once it rests,
 * and every click scatters the nearby characters outward.
 */
export function CharField({ theme, reduceMotion }: CharFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Both layers exist only to answer pointer motion, so reduced motion shows nothing.
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const shape = createValueNoise();
    const detail = createValueNoise();
    const startedAt = performance.now();

    let disposed = false;
    let frameId = 0;
    let running = false;
    let lastFrameAt = 0;
    let dpr = 1;
    let cellW = 1;
    let cellH = 1;
    let cols = 0;
    let rows = 0;
    let glyphs = new Uint8Array(0);
    let frameInterval = FRAME_INTERVAL_MS;
    let workMs = 0;
    // What each cell currently shows on the canvas, so unchanged cells are never redrawn.
    let shown = new Int16Array(0);
    let atlas: HTMLCanvasElement | null = null;
    let heatCols = 0;
    let heatRows = 0;
    let heat = new Float32Array(0);
    let hottest = 0;
    let pointer: { x: number; y: number } | null = null;
    let shards: Shard[] = [];
    // Top-left corners of the shards drawn last frame, as x, y pairs, so only those spots are cleared.
    let trail: number[] = [];

    const randomGlyph = () => Math.floor(Math.random() * GLYPHS.length);

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.font = `${FONT_SIZE_PX * dpr}px ${FONT_FAMILY}`;
      cellW = Math.ceil(ctx.measureText("M").width);
      cellH = Math.round(LINE_HEIGHT_PX * dpr);
      cols = Math.ceil(canvas.width / cellW);
      rows = Math.ceil(canvas.height / cellH);
      glyphs = Uint8Array.from({ length: cols * rows }, randomGlyph);
      shown = new Int16Array(cols * rows).fill(EMPTY_CELL);
      atlas = buildAtlas(cellW, cellH, dpr, theme);
      heatCols = Math.ceil(window.innerWidth / HEAT_CELL_PX) + 1;
      heatRows = Math.ceil(window.innerHeight / HEAT_CELL_PX) + 1;
      heat = new Float32Array(heatCols * heatRows);
      hottest = 0;
      shards = [];
      trail = [];
    };

    const stampHeat = (cx: number, cy: number, amount: number) => {
      const reach = Math.ceil(HEAT_RADIUS_PX / HEAT_CELL_PX);
      const centerCol = Math.round(cx / HEAT_CELL_PX);
      const centerRow = Math.round(cy / HEAT_CELL_PX);
      const sigmaSq = (HEAT_RADIUS_PX / 2) ** 2;
      for (let row = Math.max(0, centerRow - reach); row <= Math.min(heatRows - 1, centerRow + reach); row++) {
        for (let col = Math.max(0, centerCol - reach); col <= Math.min(heatCols - 1, centerCol + reach); col++) {
          const dx = col * HEAT_CELL_PX - cx;
          const dy = row * HEAT_CELL_PX - cy;
          const distSq = dx * dx + dy * dy;
          if (distSq > HEAT_RADIUS_PX * HEAT_RADIUS_PX) continue;
          const index = row * heatCols + col;
          heat[index] = Math.min(HEAT_MAX, heat[index] + amount * Math.exp(-distSq / (2 * sigmaSq)));
          hottest = Math.max(hottest, heat[index]);
        }
      }
    };

    const coolHeat = (seconds: number) => {
      const loss = HEAT_DECAY_PER_SECOND * seconds;
      hottest = 0;
      for (let i = 0; i < heat.length; i++) {
        if (heat[i] === 0) continue;
        heat[i] = Math.max(0, heat[i] - loss);
        hottest = Math.max(hottest, heat[i]);
      }
    };

    /** Bilinear lookup, so the hotspot edge does not show the coarse heat grid. */
    const heatAt = (cssX: number, cssY: number): number => {
      const gx = Math.min(cssX / HEAT_CELL_PX, heatCols - 1.001);
      const gy = Math.min(cssY / HEAT_CELL_PX, heatRows - 1.001);
      const col = Math.floor(gx);
      const row = Math.floor(gy);
      const fx = gx - col;
      const fy = gy - row;
      const i = row * heatCols + col;
      const top = heat[i] + (heat[i + 1] - heat[i]) * fx;
      const bottom = heat[i + heatCols] + (heat[i + heatCols + 1] - heat[i + heatCols]) * fx;
      return top + (bottom - top) * fy;
    };

    const hotspotAt = (cssX: number, cssY: number, drift: number): number => {
      const warmth = heatAt(cssX, cssY);
      if (warmth < HEAT_EPSILON) return 0;
      const field =
        shape(cssX * HOTSPOT_SHAPE_SCALE + drift, cssY * HOTSPOT_SHAPE_SCALE - drift * 0.6) * (1 - HOTSPOT_DETAIL_WEIGHT) +
        detail(cssX * HOTSPOT_DETAIL_SCALE - drift * 1.3, cssY * HOTSPOT_DETAIL_SCALE + drift * 0.8) * HOTSPOT_DETAIL_WEIGHT;
      const density = Math.min(1, warmth / HOTSPOT_FULL_DENSITY_HEAT);
      const visibleFrom = HOTSPOT_SPARSE_FROM + (HOTSPOT_DENSE_FROM - HOTSPOT_SPARSE_FROM) * density;
      return HOTSPOT_BRIGHTNESS * Math.min(1, warmth) * smoothstep(visibleFrom, visibleFrom + HOTSPOT_FEATHER, field);
    };

    const scatter = (cssX: number, cssY: number, now: number) => {
      const x = cssX * dpr;
      const y = cssY * dpr;
      const radius = SCATTER_RADIUS_PX * dpr;
      const col0 = Math.max(0, Math.floor((x - radius) / cellW));
      const col1 = Math.min(cols - 1, Math.ceil((x + radius) / cellW));
      const row0 = Math.max(0, Math.floor((y - radius) / cellH));
      const row1 = Math.min(rows - 1, Math.ceil((y + radius) / cellH));
      for (let row = row0; row <= row1; row++) {
        for (let col = col0; col <= col1; col++) {
          const dx = col * cellW + cellW / 2 - x;
          const dy = row * cellH + cellH / 2 - y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance > radius || Math.random() > SCATTER_KEEP) continue;
          const speed =
            (SCATTER_MIN_SPEED_PX + Math.random() * SCATTER_SPEED_RANGE_PX) *
            (1 - (distance / radius) * SCATTER_RIM_SLOWDOWN) *
            dpr;
          shards.push({
            x: col * cellW,
            y: row * cellH,
            vx: (dx / distance) * speed * SCATTER_DRAG,
            vy: (dy / distance) * speed * SCATTER_DRAG - SCATTER_LIFT_PX * dpr,
            glyph: glyphs[row * cols + col],
            bornAt: now,
            life: SCATTER_MIN_LIFE_SECONDS + Math.random() * SCATTER_LIFE_RANGE_SECONDS,
          });
        }
      }
      if (shards.length > MAX_SHARDS) shards.splice(0, shards.length - MAX_SHARDS);
    };

    /** Clears the cells under last frame's shards and marks them for the grid pass to redraw. */
    const eraseTrail = () => {
      for (let i = 0; i < trail.length; i += 2) {
        const col0 = Math.floor(trail[i] / cellW);
        const row0 = Math.floor(trail[i + 1] / cellH);
        for (let row = Math.max(0, row0); row <= Math.min(rows - 1, row0 + 1); row++) {
          for (let col = Math.max(0, col0); col <= Math.min(cols - 1, col0 + 1); col++) {
            ctx.clearRect(col * cellW, row * cellH, cellW, cellH);
            shown[row * cols + col] = EMPTY_CELL;
          }
        }
      }
      trail = [];
    };

    const drawGrid = (now: number) => {
      if (!atlas) return;
      const drift = ((now - startedAt) / 1000) * HOTSPOT_DRIFT_PER_SECOND;
      const warm = hottest > HEAT_EPSILON;

      for (let row = 0; row < rows; row++) {
        const y = row * cellH;
        const cssY = (y + cellH / 2) / dpr;
        for (let col = 0; col < cols; col++) {
          const x = col * cellW;
          const cssX = (x + cellW / 2) / dpr;
          const index = row * cols + col;
          const level = warm ? Math.round(hotspotAt(cssX, cssY, drift) * BRIGHTNESS_LEVELS) : 0;
          const tile = level === 0 ? EMPTY_CELL : (level - 1) * GLYPHS.length + glyphs[index];
          if (tile === shown[index]) continue;
          if (shown[index] !== EMPTY_CELL) ctx.clearRect(x, y, cellW, cellH);
          shown[index] = tile;
          if (tile === EMPTY_CELL) continue;
          const atlasY = (HOTSPOT_PALETTE * BRIGHTNESS_LEVELS + level - 1) * cellH;
          ctx.drawImage(atlas, glyphs[index] * cellW, atlasY, cellW, cellH, x, y, cellW, cellH);
        }
      }
    };

    const drawShards = (now: number) => {
      if (!atlas) return;
      shards = shards.filter((shard) => now - shard.bornAt < shard.life * 1000);
      const gravity = SCATTER_GRAVITY_PX * dpr;
      for (const shard of shards) {
        const age = (now - shard.bornAt) / 1000;
        const level = Math.round(SCATTER_BRIGHTNESS * (1 - age / shard.life) ** SCATTER_FADE_POWER * BRIGHTNESS_LEVELS);
        if (level === 0) continue;
        const travel = (1 - Math.exp(-age * SCATTER_DRAG)) / SCATTER_DRAG;
        const x = Math.round(shard.x + shard.vx * travel);
        const y = Math.round(shard.y + shard.vy * travel + 0.5 * gravity * age * age);
        const atlasY = (SHARD_PALETTE * BRIGHTNESS_LEVELS + level - 1) * cellH;
        ctx.drawImage(atlas, shard.glyph * cellW, atlasY, cellW, cellH, x, y, cellW, cellH);
        trail.push(x, y);
      }
    };

    const flicker = (seconds: number) => {
      const swaps = glyphs.length * HOTSPOT_SCRAMBLE_PER_SECOND * seconds;
      for (let i = 0; i < swaps; i++) {
        glyphs[Math.floor(Math.random() * glyphs.length)] = randomGlyph();
      }
    };

    const tick = (now: number) => {
      if (now - lastFrameAt >= frameInterval) {
        const seconds = Math.min((now - lastFrameAt) / 1000, MAX_FRAME_SECONDS);
        lastFrameAt = now;
        const workStartedAt = performance.now();
        coolHeat(seconds);
        flicker(seconds);
        eraseTrail();
        drawGrid(now);
        drawShards(now);
        workMs += (performance.now() - workStartedAt - workMs) * WORK_SMOOTHING;
        if (workMs > SLOW_WORK_MS) frameInterval = SLOW_FRAME_INTERVAL_MS;
        else if (workMs < FAST_WORK_MS) frameInterval = FRAME_INTERVAL_MS;
      }
      // Once the heat is gone and no shard is left, the loop stops until the pointer acts again.
      if (hottest > HEAT_EPSILON || shards.length > 0) {
        frameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shown.fill(EMPTY_CELL);
        trail = [];
        running = false;
      }
    };

    const start = () => {
      if (running || disposed || !atlas) return;
      running = true;
      lastFrameAt = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Forgetting the last point stops a trail from jumping across the quiet zone on exit.
      if (inQuietZone(event)) {
        pointer = null;
        return;
      }
      const next = { x: event.clientX, y: event.clientY };
      if (pointer) {
        const distance = Math.hypot(next.x - pointer.x, next.y - pointer.y);
        const stamps = Math.max(1, Math.ceil(distance / HEAT_STAMP_SPACING_PX));
        const amount = (distance * HEAT_PER_PX) / stamps;
        for (let i = 1; i <= stamps; i++) {
          const t = i / stamps;
          stampHeat(pointer.x + (next.x - pointer.x) * t, pointer.y + (next.y - pointer.y) * t, amount);
        }
      }
      pointer = next;
      start();
    };

    const onPointerLeave = () => {
      pointer = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (inQuietZone(event) || !atlas) return;
      scatter(event.clientX, event.clientY, performance.now());
      start();
    };

    // Measuring before the web font arrives would size every cell for the fallback font.
    document.fonts
      .load(`${FONT_SIZE_PX}px ${FONT_FAMILY}`)
      .catch(() => [])
      .then(() => {
        if (disposed) return;
        layout();
        window.addEventListener("resize", layout);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerdown", onPointerDown);
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [theme, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="char-field pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
