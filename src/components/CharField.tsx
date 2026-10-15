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

/** The hotspot stays grey, while burst characters carry the accent at every brightness. */
const HOTSPOT_PALETTE = 0;
const BURST_PALETTE = 1;
const BURST_TINT_MIN = 0.7;
/** The burst core saturates, so a good share of its characters reach full brightness. */
const BURST_GAIN = 1.3;

/** Pointer movement leaves heat behind. More movement means more heat, which lasts longer. */
const HEAT_CELL_PX = 20;
const HEAT_RADIUS_PX = 130;
const HEAT_PER_PX = 0.008;
const HEAT_STAMP_SPACING_PX = 16;
const HEAT_MAX = 3;
const HEAT_DECAY_PER_SECOND = 0.6;
const HEAT_EPSILON = 0.01;

/** Heat sets how dense the hotspot is, but brightness stops rising at one unit of heat. */
const HOTSPOT_BRIGHTNESS = 0.35;
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
 * A click lights a small patch of characters that scramble, then settle and
 * fade, like text decoding. The patch grows a little as it appears.
 */
const BURST_START_RADIUS_PX = 45;
const BURST_RADIUS_PX = 85;
const BURST_GROW_SECONDS = 0.15;
const BURST_CORE = 0.35;
const BURST_RISE_SECONDS = 0.05;
const BURST_FADE_FROM_SECONDS = 0.08;
const BURST_LIFETIME_SECONDS = 0.55;
/** Characters churn fast at first and slow to a stop as the burst fades, which reads as decoding. */
const BURST_SCRAMBLE_PER_SECOND = 30;
const BURST_SCRAMBLE_FROM = 0.05;
const MAX_BURSTS = 8;

/** Fine noise keeps the burst edge ragged instead of a clean circle. */
const RAGGED_SCALE = 1 / 40;
const RAGGED_PX = 9;

/** Each lit cell keeps a random weight, so a burst reads as scattered characters, not a solid disc. */
const SPARKLE_MIN = 0.25;

/** The square root skews weights towards 1, so most burst characters stay bright and a few drop out. */
const randomSparkle = () => Math.sqrt(Math.random());

/** Pointer activity inside these elements, such as the terminal window, never reaches the field. */
export const QUIET_ZONE_ATTRIBUTE = "data-char-field-quiet";
const QUIET_ZONE_SELECTOR = `[${QUIET_ZONE_ATTRIBUTE}]`;

/** Day needs a lighter touch, or the field fights the dark body text. */
const MAX_ALPHA: Record<Theme, number> = { dark: 0.55, light: 0.45 };

type Rgb = [number, number, number];

type Burst = {
  x: number;
  y: number;
  bornAt: number;
};

/** Everything about a burst that is the same for every character in one frame. */
type BurstFrame = {
  x: number;
  y: number;
  radius: number;
  strength: number;
  scrambleRate: number;
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

  for (const palette of [HOTSPOT_PALETTE, BURST_PALETTE]) {
    for (let level = 1; level <= BRIGHTNESS_LEVELS; level++) {
      const strength = level / BRIGHTNESS_LEVELS;
      const tint = palette === BURST_PALETTE ? BURST_TINT_MIN + (1 - BURST_TINT_MIN) * strength : 0;
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
 * and every click lights a small patch of characters that decode and fade.
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
    const edge = createValueNoise();
    const bursts: Burst[] = [];
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
    let sparkle = new Float32Array(0);
    let raggedField = new Float32Array(0);
    let frameInterval = FRAME_INTERVAL_MS;
    let workMs = 0;
    let burstFrames: BurstFrame[] = [];
    // What each cell currently shows on the canvas, so unchanged cells are never redrawn.
    let shown = new Int16Array(0);
    let atlas: HTMLCanvasElement | null = null;
    let heatCols = 0;
    let heatRows = 0;
    let heat = new Float32Array(0);
    let hottest = 0;
    let pointer: { x: number; y: number } | null = null;

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
      sparkle = Float32Array.from({ length: cols * rows }, randomSparkle);
      shown = new Int16Array(cols * rows).fill(EMPTY_CELL);
      // Edge noise never moves, so it is sampled once per layout instead of every frame.
      raggedField = new Float32Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        const cssY = (row * cellH + cellH / 2) / dpr;
        for (let col = 0; col < cols; col++) {
          const cssX = (col * cellW + cellW / 2) / dpr;
          const index = row * cols + col;
          raggedField[index] = (edge(cssX * RAGGED_SCALE, cssY * RAGGED_SCALE) - 0.5) * 2 * RAGGED_PX;
        }
      }
      atlas = buildAtlas(cellW, cellH, dpr, theme);
      heatCols = Math.ceil(window.innerWidth / HEAT_CELL_PX) + 1;
      heatRows = Math.ceil(window.innerHeight / HEAT_CELL_PX) + 1;
      heat = new Float32Array(heatCols * heatRows);
      hottest = 0;
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

    const prepareBursts = (now: number) => {
      burstFrames = bursts.map((burst) => {
        const age = (now - burst.bornAt) / 1000;
        const progress = Math.min(1, age / BURST_LIFETIME_SECONDS);
        const grow = 1 - Math.exp(-age / BURST_GROW_SECONDS);
        return {
          x: burst.x,
          y: burst.y,
          radius: BURST_START_RADIUS_PX + (BURST_RADIUS_PX - BURST_START_RADIUS_PX) * grow,
          strength:
            smoothstep(0, BURST_RISE_SECONDS, age) *
            (1 - smoothstep(BURST_FADE_FROM_SECONDS, BURST_LIFETIME_SECONDS, age)),
          scrambleRate: BURST_SCRAMBLE_PER_SECOND * (1 - progress),
        };
      });
    };

    const draw = (now: number, seconds: number) => {
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
          let burst = 0;
          let scrambleRate = 0;
          for (const frame of burstFrames) {
            const distance = Math.hypot(cssX - frame.x, cssY - frame.y) + raggedField[index];
            if (distance > frame.radius) continue;
            const reach = frame.strength * (1 - smoothstep(frame.radius * BURST_CORE, frame.radius, distance));
            if (reach > burst) {
              burst = reach;
              scrambleRate = frame.scrambleRate;
            }
          }
          // Burst characters churn fast and settle as the burst fades, while the hotspot only flickers.
          if (burst > BURST_SCRAMBLE_FROM && Math.random() < scrambleRate * seconds) {
            glyphs[index] = randomGlyph();
            sparkle[index] = randomSparkle();
          }
          const sparkled = Math.min(1, BURST_GAIN * burst * (SPARKLE_MIN + (1 - SPARKLE_MIN) * sparkle[index]));
          const hotspot = warm ? hotspotAt(cssX, cssY, drift) : 0;
          const palette = sparkled >= hotspot ? BURST_PALETTE : HOTSPOT_PALETTE;
          const level = Math.round(Math.max(sparkled, hotspot) * BRIGHTNESS_LEVELS);
          const tile = level === 0 ? EMPTY_CELL : (palette * BRIGHTNESS_LEVELS + level - 1) * GLYPHS.length + glyphs[index];
          if (tile === shown[index]) continue;
          if (shown[index] !== EMPTY_CELL) ctx.clearRect(x, y, cellW, cellH);
          shown[index] = tile;
          if (tile === EMPTY_CELL) continue;
          const atlasY = (palette * BRIGHTNESS_LEVELS + level - 1) * cellH;
          ctx.drawImage(atlas, glyphs[index] * cellW, atlasY, cellW, cellH, x, y, cellW, cellH);
        }
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
        const expiresBefore = now - BURST_LIFETIME_SECONDS * 1000;
        while (bursts.length > 0 && bursts[0].bornAt < expiresBefore) bursts.shift();
        prepareBursts(now);
        flicker(seconds);
        draw(now, seconds);
        workMs += (performance.now() - workStartedAt - workMs) * WORK_SMOOTHING;
        if (workMs > SLOW_WORK_MS) frameInterval = SLOW_FRAME_INTERVAL_MS;
        else if (workMs < FAST_WORK_MS) frameInterval = FRAME_INTERVAL_MS;
      }
      // Once the heat is gone and no burst is left, the loop stops until the pointer acts again.
      if (hottest > HEAT_EPSILON || bursts.length > 0) {
        frameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shown.fill(EMPTY_CELL);
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
      if (inQuietZone(event)) return;
      if (bursts.length >= MAX_BURSTS) bursts.shift();
      bursts.push({ x: event.clientX, y: event.clientY, bornAt: performance.now() });
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
