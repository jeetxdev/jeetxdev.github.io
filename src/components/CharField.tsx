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

const SHAPE_SCALE = 1 / 260;
const DETAIL_SCALE = 1 / 110;
const DETAIL_WEIGHT = 0.35;
const DRIFT_PER_SECOND = 0.07;
const VISIBLE_FROM = 0.56;
const FULL_AT = 0.86;
const TINT_FROM = 0.55;

const GLOW_RADIUS_PX = 110;
const GLOW_STRENGTH = 0.9;
const GLOW_FOLLOW = 0.3;
const GLOW_FADE = 0.08;
const GLOW_MIN = 0.01;
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/** Day needs a lighter touch, or the field fights the dark body text. */
const MAX_ALPHA: Record<Theme, number> = { dark: 0.3, light: 0.24 };

type Rgb = [number, number, number];

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

type CharFieldProps = {
  theme: Theme;
  reduceMotion: boolean;
};

/** Scrambling monospace characters, revealed by drifting noise and brightened around the cursor. */
export function CharField({ theme, reduceMotion }: CharFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const shape = createValueNoise();
    const detail = createValueNoise();
    const allowGlow = !reduceMotion && window.matchMedia(FINE_POINTER_QUERY).matches;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, glow: 0, inside: false };
    const startedAt = performance.now();

    let disposed = false;
    let frameId = 0;
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

    const draw = (seconds: number) => {
      if (!atlas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drift = seconds * DRIFT_PER_SECOND;
      const glowRadius = GLOW_RADIUS_PX * dpr;
      const glowRadiusSq = glowRadius * glowRadius;
      const glowing = pointer.glow > GLOW_MIN;

      for (let row = 0; row < rows; row++) {
        const y = row * cellH;
        const cssY = y / dpr;
        for (let col = 0; col < cols; col++) {
          const x = col * cellW;
          const cssX = x / dpr;
          const field =
            shape(cssX * SHAPE_SCALE + drift, cssY * SHAPE_SCALE - drift * 0.6) * (1 - DETAIL_WEIGHT) +
            detail(cssX * DETAIL_SCALE - drift * 1.3, cssY * DETAIL_SCALE + drift * 0.8) * DETAIL_WEIGHT;
          let brightness = smoothstep(VISIBLE_FROM, FULL_AT, field);

          if (glowing) {
            const dx = x + cellW / 2 - pointer.x;
            const dy = y + cellH / 2 - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < glowRadiusSq) {
              const falloff = 1 - Math.sqrt(distSq) / glowRadius;
              brightness = Math.min(1, brightness + falloff * falloff * GLOW_STRENGTH * pointer.glow);
            }
          }

          const level = Math.round(brightness * BRIGHTNESS_LEVELS);
          if (level === 0) continue;
          const glyph = glyphs[row * cols + col];
          ctx.drawImage(atlas, glyph * cellW, (level - 1) * cellH, cellW, cellH, x, y, cellW, cellH);
        }
      }
    };

    // requestAnimationFrame already stops in background tabs, so a hidden tab costs nothing.
    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);
      if (now - lastFrameAt < FRAME_INTERVAL_MS) return;
      lastFrameAt = now;

      scramble();
      pointer.x += (pointer.targetX - pointer.x) * GLOW_FOLLOW;
      pointer.y += (pointer.targetY - pointer.y) * GLOW_FOLLOW;
      pointer.glow += ((pointer.inside ? 1 : 0) - pointer.glow) * GLOW_FADE;
      draw((now - startedAt) / 1000);
    };

    const onResize = () => {
      layout();
      if (reduceMotion) draw(0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX * dpr;
      pointer.targetY = event.clientY * dpr;
      // Entering the window starts the glow at the cursor instead of sliding in from the last exit.
      if (!pointer.inside) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.inside = true;
      }
    };

    const onMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) pointer.inside = false;
    };

    // Measuring before the web font arrives would size every cell for the fallback font.
    document.fonts
      .load(`${FONT_SIZE_PX}px ${FONT_FAMILY}`)
      .catch(() => [])
      .then(() => {
        if (disposed) return;
        layout();
        window.addEventListener("resize", onResize);
        if (reduceMotion) {
          draw(0);
          return;
        }
        if (allowGlow) {
          window.addEventListener("pointermove", onPointerMove);
          document.addEventListener("mouseout", onMouseOut);
        }
        frameId = requestAnimationFrame(tick);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseout", onMouseOut);
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
