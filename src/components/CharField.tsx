import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";
import { createValueNoise } from "@/lib/valueNoise";

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FONT_FAMILY = '"JetBrains Mono", ui-monospace, monospace';
const FONT_SIZE_PX = 12;
const LINE_HEIGHT_PX = 15;
const MAX_DPR = 2;
const FRAME_INTERVAL_MS = 1000 / 30;
const BRIGHTNESS_LEVELS = 12;
const SCRAMBLE_RATIO = 0.3;
const TINT_FROM = 0.55;

/** Radius follows SPEED * age^EXPONENT, measured from the Claude Code desktop ripple. */
const RIPPLE_SPEED_PX = 340;
const RIPPLE_GROWTH_EXPONENT = 0.7;
const RIPPLE_LIFETIME_SECONDS = 1.8;
const RIPPLE_FADE_FROM = 0.4;
const RIPPLE_FRONT_PX = 14;
const RIPPLE_WAKE_PX = 70;
const RIPPLE_WAKE_BRIGHTNESS = 0.45;
const MAX_RIPPLES = 8;

/** Noise bends the ring more as it ages, so it breaks into wavy arcs. */
const WARP_SCALE = 1 / 150;
const WARP_PX_PER_SECOND = 110;

/** Day needs a lighter touch, or the field fights the dark body text. */
const MAX_ALPHA: Record<Theme, number> = { dark: 0.55, light: 0.45 };

type Rgb = [number, number, number];

type Ripple = {
  x: number;
  y: number;
  bornAt: number;
  warpOffset: number;
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

/** A bright leading edge with a dimmer wake trailing inside the ring. */
function waveProfile(offset: number): number {
  if (offset > 0) return Math.exp(-((offset / RIPPLE_FRONT_PX) ** 2));
  return Math.max(Math.exp(offset / RIPPLE_FRONT_PX), RIPPLE_WAKE_BRIGHTNESS * Math.exp(offset / RIPPLE_WAKE_PX));
}

type CharFieldProps = {
  theme: Theme;
  reduceMotion: boolean;
};

/** Scrambling monospace characters that only show where a click sends a ripple across the page. */
export function CharField({ theme, reduceMotion }: CharFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // The field shows nothing until a ripple runs, and ripples are pure motion.
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const warp = createValueNoise();
    const ripples: Ripple[] = [];

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
    };

    const scramble = () => {
      const swaps = glyphs.length * SCRAMBLE_RATIO;
      for (let i = 0; i < swaps; i++) {
        glyphs[Math.floor(Math.random() * glyphs.length)] = randomGlyph();
      }
    };

    const brightnessAt = (cssX: number, cssY: number, now: number): number => {
      let brightness = 0;
      for (const ripple of ripples) {
        const age = (now - ripple.bornAt) / 1000;
        const radius = RIPPLE_SPEED_PX * age ** RIPPLE_GROWTH_EXPONENT;
        const strength = 1 - smoothstep(RIPPLE_FADE_FROM, 1, age / RIPPLE_LIFETIME_SECONDS);
        const bend =
          (warp(cssX * WARP_SCALE + ripple.warpOffset, cssY * WARP_SCALE) - 0.5) * 2 * WARP_PX_PER_SECOND * age;
        const distance = Math.hypot(cssX - ripple.x, cssY - ripple.y) + bend;
        brightness = Math.max(brightness, strength * waveProfile(distance - radius));
      }
      return brightness;
    };

    const draw = (now: number) => {
      if (!atlas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < rows; row++) {
        const y = row * cellH;
        const cssY = (y + cellH / 2) / dpr;
        for (let col = 0; col < cols; col++) {
          const x = col * cellW;
          const level = Math.round(brightnessAt((x + cellW / 2) / dpr, cssY, now) * BRIGHTNESS_LEVELS);
          if (level === 0) continue;
          const glyph = glyphs[row * cols + col];
          ctx.drawImage(atlas, glyph * cellW, (level - 1) * cellH, cellW, cellH, x, y, cellW, cellH);
        }
      }
    };

    const tick = (now: number) => {
      if (now - lastFrameAt >= FRAME_INTERVAL_MS) {
        lastFrameAt = now;
        const expiresBefore = now - RIPPLE_LIFETIME_SECONDS * 1000;
        while (ripples.length > 0 && ripples[0].bornAt < expiresBefore) ripples.shift();
        scramble();
        draw(now);
      }
      // The loop stops once the last ripple fades, so an idle page costs nothing.
      if (ripples.length > 0) {
        frameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        running = false;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!atlas) return;
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({
        x: event.clientX,
        y: event.clientY,
        bornAt: performance.now(),
        warpOffset: Math.random() * 100,
      });
      if (!running) {
        running = true;
        frameId = requestAnimationFrame(tick);
      }
    };

    const onResize = () => layout();

    // Measuring before the web font arrives would size every cell for the fallback font.
    document.fonts
      .load(`${FONT_SIZE_PX}px ${FONT_FAMILY}`)
      .catch(() => [])
      .then(() => {
        if (disposed) return;
        layout();
        window.addEventListener("resize", onResize);
        window.addEventListener("pointerdown", onPointerDown);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", onPointerDown);
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
