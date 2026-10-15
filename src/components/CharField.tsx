import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";
import { createValueNoise, type Noise2D } from "@/lib/valueNoise";

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FONT_FAMILY = '"JetBrains Mono", ui-monospace, monospace';
const FONT_SIZE_PX = 12;
const LINE_HEIGHT_PX = 15;
const MAX_DPR = 2;
const FRAME_INTERVAL_MS = 1000 / 60;
const MAX_FRAME_SECONDS = 0.1;
const BRIGHTNESS_LEVELS = 12;

/** The hotspot stays grey, while ripple characters carry the accent at every brightness. */
const HOTSPOT_PALETTE = 0;
const RIPPLE_PALETTE = 1;
const RIPPLE_TINT_MIN = 0.7;
/** Ring bands saturate, so a good share of their characters reach full brightness. */
const RIPPLE_GAIN = 1.5;

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
 * Measured from a Claude Code recording: the outer ring starts at 36px and
 * eases towards 564px, so it keeps slowing down like a wave on water.
 */
const RIPPLE_START_PX = 36;
const RIPPLE_REACH_PX = 528;
const RIPPLE_EASE_SECONDS = 1.15;
/**
 * Brightness falls as 1 / (1 + age / DECAY). The recording showed about 55% at
 * 0.5s, 38% at 1s and 28% at 1.5s. DECAY sits a little slower than that fit,
 * because scattered characters and broken arcs already dim the ring on average.
 */
const RIPPLE_DECAY_SECONDS = 1;
const RIPPLE_FADE_FROM_SECONDS = 1.8;
const RIPPLE_LIFETIME_SECONDS = 2.6;
const RIPPLE_SCRAMBLE_FROM = 0.05;
const RIPPLE_SCRAMBLE_PER_SECOND = 12;
const MAX_RIPPLES = 8;

/** The inner ring starts later and travels slower, so the two rings drift apart like water waves. */
const RING_DELAYS_SECONDS = [0, 0.2];
const RING_SPEEDS = [1, 0.75];
const RING_STRENGTHS = [1, 0.9];
const RIPPLE_TOTAL_SECONDS = RIPPLE_LIFETIME_SECONDS + RING_DELAYS_SECONDS[RING_DELAYS_SECONDS.length - 1];

/** Each ring is a hollow band that thickens as it grows, softer on its inner side. */
const RING_WIDTH_PX = 8;
const RING_WIDTH_PER_RADIUS = 0.03;
const RING_INNER_SOFTNESS = 1.2;

/**
 * Noise sampled around a circle gives each ripple an irregular outline, and
 * moving through the noise over time keeps that outline morphing.
 */
const SHAPE_NOISE_RADIUS = 1.2;
const SHAPE_MORPH_PER_SECOND = 0.5;
const SHAPE_STRETCH_BASE = 0.06;
const SHAPE_STRETCH_PER_SECOND = 0.06;
const SHAPE_STRETCH_MAX = 1 + SHAPE_STRETCH_BASE + SHAPE_STRETCH_PER_SECOND * RIPPLE_TOTAL_SECONDS;

/** Noise bends the rings a little more as they age, so they break into wavy arcs. */
const WARP_SCALE = 1 / 150;
const WARP_PX_PER_SECOND = 25;

/** Fine noise keeps the ring edge ragged instead of a clean vector outline. */
const RAGGED_SCALE = 1 / 40;
const RAGGED_PX = 9;

/** Brightness wanders around each ring, and the dim stretches deepen with age, so rings break into arcs. */
const ARC_NOISE_RADIUS = 1.5;
const ARC_MORPH_PER_SECOND = 0.7;
const ARC_BREAK_FROM_SECONDS = 0.15;
const ARC_BREAK_FULL_SECONDS = 1.1;
const ARC_BREAK_DEPTH = 0.6;

/** Each lit cell keeps a random weight, so ring bands read as scattered characters, not solid strokes. */
const SPARKLE_MIN = 0.25;

/** The square root skews weights towards 1, so most ring characters stay bright and a few drop out. */
const randomSparkle = () => Math.sqrt(Math.random());

/** Pointer activity inside these elements, such as the terminal window, never reaches the field. */
export const QUIET_ZONE_ATTRIBUTE = "data-char-field-quiet";
const QUIET_ZONE_SELECTOR = `[${QUIET_ZONE_ATTRIBUTE}]`;

/** Day needs a lighter touch, or the field fights the dark body text. */
const MAX_ALPHA: Record<Theme, number> = { dark: 0.55, light: 0.45 };

type Rgb = [number, number, number];

type Ripple = {
  x: number;
  y: number;
  bornAt: number;
  warpOffset: number;
  shapeSeed: number;
  arcSeed: number;
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

  for (const palette of [HOTSPOT_PALETTE, RIPPLE_PALETTE]) {
    for (let level = 1; level <= BRIGHTNESS_LEVELS; level++) {
      const strength = level / BRIGHTNESS_LEVELS;
      const tint = palette === RIPPLE_PALETTE ? RIPPLE_TINT_MIN + (1 - RIPPLE_TINT_MIN) * strength : 0;
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

function ringRadius(age: number, speed: number): number {
  return speed * (RIPPLE_START_PX + RIPPLE_REACH_PX * (1 - Math.exp(-age / RIPPLE_EASE_SECONDS)));
}

function ringStrength(age: number): number {
  const decay = 1 / (1 + age / RIPPLE_DECAY_SECONDS);
  return decay * (1 - smoothstep(RIPPLE_FADE_FROM_SECONDS, RIPPLE_LIFETIME_SECONDS, age));
}

function ringBand(offset: number, radius: number): number {
  const width = RING_WIDTH_PX + radius * RING_WIDTH_PER_RADIUS;
  const side = offset > 0 ? width : width * RING_INNER_SOFTNESS;
  return Math.exp(-((offset / side) ** 2));
}

/** Samples noise on a circle, so the value wraps smoothly around the ring with no seam. */
function aroundRing(noise: Noise2D, seed: number, cos: number, sin: number, radius: number, drift: number): number {
  return noise(seed + cos * radius + drift, seed + sin * radius - drift);
}

type CharFieldProps = {
  theme: Theme;
  reduceMotion: boolean;
};

/**
 * Faint characters gather where the pointer moves and fade once it rests,
 * and every click sends a ripple of scrambling characters across the page.
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
    const warp = createValueNoise();
    const outline = createValueNoise();
    const arcNoise = createValueNoise();
    const ripples: Ripple[] = [];
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

    const rippleAt = (cssX: number, cssY: number, now: number): number => {
      let brightness = 0;
      for (const ripple of ripples) {
        const age = (now - ripple.bornAt) / 1000;
        const dx = cssX - ripple.x;
        const dy = cssY - ripple.y;
        const distance = Math.hypot(dx, dy);
        const outer = ringRadius(age, RING_SPEEDS[0]);
        const reach =
          outer * SHAPE_STRETCH_MAX +
          RING_WIDTH_PX * 3 +
          outer * RING_WIDTH_PER_RADIUS * 3 +
          WARP_PX_PER_SECOND * age +
          RAGGED_PX;
        if (distance > reach) continue;
        const lastRing = RING_DELAYS_SECONDS.length - 1;
        const innerAge = age - RING_DELAYS_SECONDS[lastRing];
        const innerRadius = innerAge > 0 ? ringRadius(innerAge, RING_SPEEDS[lastRing]) : 0;
        const hollow =
          innerRadius * (1 - SHAPE_STRETCH_MAX + 1) -
          (RING_WIDTH_PX + innerRadius * RING_WIDTH_PER_RADIUS) * RING_INNER_SOFTNESS * 3 -
          WARP_PX_PER_SECOND * age -
          RAGGED_PX;
        if (distance < hollow) continue;

        // Dividing by the stretch maps the irregular outline back onto a circle, so every ring shares it.
        const cos = distance > 0 ? dx / distance : 1;
        const sin = distance > 0 ? dy / distance : 0;
        const stretchAmount = SHAPE_STRETCH_BASE + SHAPE_STRETCH_PER_SECOND * age;
        const stretch =
          1 +
          (aroundRing(outline, ripple.shapeSeed, cos, sin, SHAPE_NOISE_RADIUS, age * SHAPE_MORPH_PER_SECOND) - 0.5) *
            2 *
            stretchAmount;
        const bend =
          (warp(cssX * WARP_SCALE + ripple.warpOffset, cssY * WARP_SCALE) - 0.5) * 2 * WARP_PX_PER_SECOND * age +
          (warp(cssX * RAGGED_SCALE - ripple.warpOffset, cssY * RAGGED_SCALE) - 0.5) * 2 * RAGGED_PX;
        const shaped = distance / stretch + bend;
        const breakDepth = ARC_BREAK_DEPTH * smoothstep(ARC_BREAK_FROM_SECONDS, ARC_BREAK_FULL_SECONDS, age);
        const presence = aroundRing(arcNoise, ripple.arcSeed, cos, sin, ARC_NOISE_RADIUS, age * ARC_MORPH_PER_SECOND);
        const arcs = 1 - breakDepth * (1 - smoothstep(0.25, 0.75, presence));
        for (let ring = 0; ring < RING_DELAYS_SECONDS.length; ring++) {
          const ringAge = age - RING_DELAYS_SECONDS[ring];
          if (ringAge <= 0) continue;
          const radius = ringRadius(ringAge, RING_SPEEDS[ring]);
          const strength = RING_STRENGTHS[ring] * ringStrength(ringAge);
          brightness = Math.max(brightness, arcs * strength * ringBand(shaped - radius, radius));
        }
      }
      return brightness;
    };

    const draw = (now: number, seconds: number) => {
      const scrambleChance = Math.min(1, RIPPLE_SCRAMBLE_PER_SECOND * seconds);
      if (!atlas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const drift = ((now - startedAt) / 1000) * HOTSPOT_DRIFT_PER_SECOND;
      const warm = hottest > HEAT_EPSILON;

      for (let row = 0; row < rows; row++) {
        const y = row * cellH;
        const cssY = (y + cellH / 2) / dpr;
        for (let col = 0; col < cols; col++) {
          const x = col * cellW;
          const cssX = (x + cellW / 2) / dpr;
          const index = row * cols + col;
          const ripple = ripples.length > 0 ? rippleAt(cssX, cssY, now) : 0;
          // Characters inside a ripple churn fast, while the hotspot only flickers.
          if (ripple > RIPPLE_SCRAMBLE_FROM && Math.random() < scrambleChance) {
            glyphs[index] = randomGlyph();
            sparkle[index] = randomSparkle();
          }
          const sparkled = Math.min(1, RIPPLE_GAIN * ripple * (SPARKLE_MIN + (1 - SPARKLE_MIN) * sparkle[index]));
          const hotspot = warm ? hotspotAt(cssX, cssY, drift) : 0;
          const palette = sparkled >= hotspot ? RIPPLE_PALETTE : HOTSPOT_PALETTE;
          const level = Math.round(Math.max(sparkled, hotspot) * BRIGHTNESS_LEVELS);
          if (level === 0) continue;
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
      if (now - lastFrameAt >= FRAME_INTERVAL_MS) {
        const seconds = Math.min((now - lastFrameAt) / 1000, MAX_FRAME_SECONDS);
        lastFrameAt = now;
        coolHeat(seconds);
        const expiresBefore = now - RIPPLE_TOTAL_SECONDS * 1000;
        while (ripples.length > 0 && ripples[0].bornAt < expiresBefore) ripples.shift();
        flicker(seconds);
        draw(now, seconds);
      }
      // Once the heat is gone and no ripple is left, the loop stops until the pointer acts again.
      if (hottest > HEAT_EPSILON || ripples.length > 0) {
        frameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({
        x: event.clientX,
        y: event.clientY,
        bornAt: performance.now(),
        warpOffset: Math.random() * 100,
        shapeSeed: Math.random() * 100,
        arcSeed: Math.random() * 100,
      });
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
