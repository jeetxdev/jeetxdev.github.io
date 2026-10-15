import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";
import { createValueNoise } from "@/lib/valueNoise";

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FONT_FAMILY = '"JetBrains Mono", ui-monospace, monospace';
const FONT_SIZE_PX = 12;
const LINE_HEIGHT_PX = 15;
const MAX_DPR = 2;
const FRAME_INTERVAL_MS = 1000 / 30;
const MAX_FRAME_SECONDS = 0.1;
const BRIGHTNESS_LEVELS = 12;
const TINT_FROM = 0.55;

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
const HOTSPOT_SCRAMBLE_RATIO = 0.03;

/** Ring radius follows SPEED * age^EXPONENT, measured from the Claude Code desktop ripple. */
const RIPPLE_SPEED_PX = 340;
const RIPPLE_GROWTH_EXPONENT = 0.7;
const RIPPLE_LIFETIME_SECONDS = 1.8;
const RIPPLE_FADE_FROM = 0.4;
const RIPPLE_SCRAMBLE_FROM = 0.05;
const RIPPLE_SCRAMBLE_CHANCE = 0.5;
const MAX_RIPPLES = 8;

/** One click sends a train of rings, each later and fainter, so smaller rings sit inside larger ones. */
const RING_DELAYS_SECONDS = [0, 0.18, 0.36];
const RING_STRENGTHS = [1, 0.7, 0.45];
const RIPPLE_TOTAL_SECONDS = RIPPLE_LIFETIME_SECONDS + RING_DELAYS_SECONDS[RING_DELAYS_SECONDS.length - 1];

/** Each ring is a hollow band that thickens as it grows, softer on its inner side. */
const RING_WIDTH_PX = 8;
const RING_WIDTH_PER_RADIUS = 0.03;
const RING_INNER_SOFTNESS = 1.2;

/** Low harmonics give every ripple its own lopsided outline, kept by all its rings as they grow. */
const SHAPE_HARMONICS = [1, 2, 3, 4];
const SHAPE_AMPLITUDE_MAX = [0.06, 0.12, 0.08, 0.04];
const SHAPE_AMPLITUDE_MIN_RATIO = 0.4;
const SHAPE_STRETCH_MAX = 1 + SHAPE_AMPLITUDE_MAX.reduce((sum, amplitude) => sum + amplitude, 0);

/** Noise bends the rings a little more as they age, so they break into wavy arcs. */
const WARP_SCALE = 1 / 150;
const WARP_PX_PER_SECOND = 50;

/** Day needs a lighter touch, or the field fights the dark body text. */
const MAX_ALPHA: Record<Theme, number> = { dark: 0.55, light: 0.45 };

type Rgb = [number, number, number];

type Ripple = {
  x: number;
  y: number;
  bornAt: number;
  warpOffset: number;
  amplitudes: number[];
  phases: number[];
};

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

/** Pre-renders every glyph at every brightness, so a frame is only drawImage calls. */
function buildAtlas(cellW: number, cellH: number, dpr: number, theme: Theme): HTMLCanvasElement {
  const atlas = document.createElement("canvas");
  atlas.width = GLYPHS.length * cellW;
  atlas.height = BRIGHTNESS_LEVELS * cellH;
  const ctx = atlas.getContext("2d");
  if (!ctx) return atlas;

  const dim = readColorToken("--muted");
  const bright = readColorToken("--accent");
  ctx.font = `${FONT_SIZE_PX * dpr}px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let level = 1; level <= BRIGHTNESS_LEVELS; level++) {
    const strength = level / BRIGHTNESS_LEVELS;
    const tint = smoothstep(TINT_FROM, 1, strength);
    const [r, g, b] = dim.map((channel, i) => Math.round(channel + (bright[i] - channel) * tint));
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${strength * MAX_ALPHA[theme]})`;
    const y = (level - 1) * cellH + cellH / 2;
    for (let i = 0; i < GLYPHS.length; i++) {
      ctx.fillText(GLYPHS[i], i * cellW + cellW / 2, y);
    }
  }
  return atlas;
}

function ringRadius(age: number): number {
  return RIPPLE_SPEED_PX * age ** RIPPLE_GROWTH_EXPONENT;
}

function ringBand(offset: number, radius: number): number {
  const width = RING_WIDTH_PX + radius * RING_WIDTH_PER_RADIUS;
  const side = offset > 0 ? width : width * RING_INNER_SOFTNESS;
  return Math.exp(-((offset / side) ** 2));
}

function shapeStretch(ripple: Ripple, angle: number): number {
  let stretch = 1;
  for (let i = 0; i < SHAPE_HARMONICS.length; i++) {
    stretch += ripple.amplitudes[i] * Math.sin(SHAPE_HARMONICS[i] * angle + ripple.phases[i]);
  }
  return stretch;
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
        const outer = ringRadius(age);
        const reach =
          outer * SHAPE_STRETCH_MAX + RING_WIDTH_PX * 3 + outer * RING_WIDTH_PER_RADIUS * 3 + WARP_PX_PER_SECOND * age;
        if (distance > reach) continue;

        // Dividing by the stretch maps the lopsided outline back onto a circle, so every ring shares it.
        const bend =
          (warp(cssX * WARP_SCALE + ripple.warpOffset, cssY * WARP_SCALE) - 0.5) * 2 * WARP_PX_PER_SECOND * age;
        const shaped = distance / shapeStretch(ripple, Math.atan2(dy, dx)) + bend;
        for (let ring = 0; ring < RING_DELAYS_SECONDS.length; ring++) {
          const ringAge = age - RING_DELAYS_SECONDS[ring];
          if (ringAge <= 0) continue;
          const radius = ringRadius(ringAge);
          const strength =
            RING_STRENGTHS[ring] * (1 - smoothstep(RIPPLE_FADE_FROM, 1, ringAge / RIPPLE_LIFETIME_SECONDS));
          brightness = Math.max(brightness, strength * ringBand(shaped - radius, radius));
        }
      }
      return brightness;
    };

    const draw = (now: number) => {
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
          if (ripple > RIPPLE_SCRAMBLE_FROM && Math.random() < RIPPLE_SCRAMBLE_CHANCE) {
            glyphs[index] = randomGlyph();
          }
          const brightness = Math.max(ripple, warm ? hotspotAt(cssX, cssY, drift) : 0);
          const level = Math.round(brightness * BRIGHTNESS_LEVELS);
          if (level === 0) continue;
          ctx.drawImage(atlas, glyphs[index] * cellW, (level - 1) * cellH, cellW, cellH, x, y, cellW, cellH);
        }
      }
    };

    const flicker = () => {
      const swaps = glyphs.length * HOTSPOT_SCRAMBLE_RATIO;
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
        flicker();
        draw(now);
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
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({
        x: event.clientX,
        y: event.clientY,
        bornAt: performance.now(),
        warpOffset: Math.random() * 100,
        amplitudes: SHAPE_AMPLITUDE_MAX.map(
          (max) => max * (SHAPE_AMPLITUDE_MIN_RATIO + Math.random() * (1 - SHAPE_AMPLITUDE_MIN_RATIO)),
        ),
        phases: SHAPE_HARMONICS.map(() => Math.random() * Math.PI * 2),
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
