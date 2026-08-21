import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Duotone ramp, shadow → accent → highlight, matched to the site palette. */
const RAMP = [
  [6, 9, 18],
  [24, 64, 92],
  [90, 175, 205],
  [214, 244, 253],
] as const;

/** Ordered 4x4 Bayer matrix - regular halftone texture instead of noise. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Cell sizes the decode steps through, coarse to fine. */
const DECODE_STEPS = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const STEP_MS = 210;
/** Beat before the decode starts, so it is not already over on first paint. */
const DECODE_DELAY_MS = 450;

/**
 * Ambient pass: once the dots have resolved, a soft band keeps drifting down
 * the portrait so it never sits perfectly still for visitors who arrive after
 * the decode is over.
 */
const AMBIENT_FPS = 12;
const AMBIENT_PERIOD_MS = 9000;
const BAND_WIDTH = 0.17;
const BAND_LIFT = 0.3;
const BREATH_LIFT = 0.07;

/** Tone curve - the source is flat and backlit, so it needs the stretch. */
const TONE_FLOOR = 0.1;
const TONE_SPAN = 0.8;

/** Radial falloff that pushes the leafy background into the shadows. */
const VIGNETTE_CENTER_Y = 0.4;
const VIGNETTE_STRENGTH = 0.62;

/** Crop: keep 80% of the source height, biased up so the face fills the card. */
const CROP_ZOOM = 0.8;
const CROP_FOCAL_Y = 0.28;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Paints one dither pass at the given cell size. The image is first sampled
 * down to one pixel per cell (letting the browser do the box filter), then
 * every sample is tone-mapped, vignetted, and quantised against the Bayer
 * threshold into one of four duotone levels.
 *
 * `phase` runs 0..1 over one ambient cycle and lowers the threshold under a
 * travelling band; pass null for a still frame.
 */
function paintPass(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  sampler: HTMLCanvasElement,
  cell: number,
  phase: number | null,
) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height || !image.naturalWidth) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const backingW = Math.round(width * dpr);
  const backingH = Math.round(height * dpr);
  if (canvas.width !== backingW || canvas.height !== backingH) {
    canvas.width = backingW;
    canvas.height = backingH;
  }

  const ctx = canvas.getContext("2d");
  const sampleCtx = sampler.getContext("2d", { willReadFrequently: true });
  if (!ctx || !sampleCtx) return;

  const cols = Math.max(1, Math.ceil(width / cell));
  const rows = Math.max(1, Math.ceil(height / cell));
  sampler.width = cols;
  sampler.height = rows;

  // Cover-crop the source around the face before sampling.
  const sh = image.naturalHeight * CROP_ZOOM;
  const sw = Math.min(image.naturalWidth, sh * (width / height));
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) * CROP_FOCAL_Y;
  sampleCtx.clearRect(0, 0, cols, rows);
  sampleCtx.drawImage(image, sx, sy, sw, sh, 0, 0, cols, rows);
  const { data } = sampleCtx.getImageData(0, 0, cols, rows);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const bandY = phase === null ? null : phase - Math.floor(phase);
  const breath =
    phase === null ? 0 : (Math.sin(phase * Math.PI * 2) + 1) * 0.5 * BREATH_LIFT;

  // One path per level, so a fine pass costs four fillStyle switches instead
  // of one per cell - cheap enough to repaint on every ambient frame.
  const paths = RAMP.map(() => new Path2D());

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const o = (y * cols + x) * 4;
      const luma =
        (0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]) / 255;

      const dx = (x / cols - 0.5) / 0.5;
      const dy = (y / rows - VIGNETTE_CENTER_Y) / 0.66;
      const falloff = clamp01(1.12 - VIGNETTE_STRENGTH * Math.hypot(dx, dy));
      const value = clamp01((luma - TONE_FLOOR) / TONE_SPAN) * falloff;

      let threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
      if (bandY !== null) {
        // Wrap the distance to the band so it re-enters from the top cleanly.
        let delta = y / rows - bandY;
        if (delta > 0.5) delta -= 1;
        else if (delta < -0.5) delta += 1;
        threshold -= Math.exp(-((delta / BAND_WIDTH) ** 2)) * BAND_LIFT + breath;
      }

      const scaled = value * (RAMP.length - 1);
      const floor = Math.floor(scaled);
      const level = Math.min(
        RAMP.length - 1,
        floor + (scaled - floor > threshold ? 1 : 0),
      );

      paths[level].rect(x * cell, y * cell, cell, cell);
    }
  }

  paths.forEach((path, index) => {
    const [r, g, b] = RAMP[index];
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fill(path);
  });
}

type DitherPortraitProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * The hero portrait, rendered as a duotone halftone that resolves from coarse
 * blocks to fine dots when it scrolls into view, keeps a slow scan drifting
 * through the dots afterwards, and develops back into the real photograph on
 * hover, tap, or keyboard activation.
 */
export function DitherPortrait({ src, alt, className }: DitherPortraitProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const samplerRef = useRef<HTMLCanvasElement | null>(null);
  const cellRef = useRef(DECODE_STEPS[0]);
  const phaseRef = useRef<number | null>(null);
  const [developed, setDeveloped] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [onScreen, setOnScreen] = useState(false);

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !image.complete || !image.naturalWidth) return;
    if (!samplerRef.current)
      samplerRef.current = document.createElement("canvas");
    try {
      paintPass(
        canvas,
        image,
        samplerRef.current,
        cellRef.current,
        phaseRef.current,
      );
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Decode once the card is on screen: coarse cells settling into 1px dots.
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    let frame = 0;
    let timer = 0;
    let started = false;

    const runDecode = () => {
      if (started) return;
      started = true;

      if (reducedMotion) {
        cellRef.current = 1;
        repaint();
        return;
      }

      let step = 0;
      const advance = () => {
        cellRef.current = DECODE_STEPS[step];
        frame = requestAnimationFrame(repaint);
        step += 1;
        if (step < DECODE_STEPS.length)
          timer = window.setTimeout(advance, STEP_MS);
      };
      timer = window.setTimeout(advance, DECODE_DELAY_MS);
    };

    const onReady = () => {
      cellRef.current = started ? cellRef.current : DECODE_STEPS[0];
      repaint();
      if (started) return;
      io.observe(canvas);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io.disconnect();
          runDecode();
        }
      },
      { rootMargin: "-6% 0px -6%" },
    );

    if (image.complete && image.naturalWidth) onReady();
    else image.addEventListener("load", onReady, { once: true });

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      image.removeEventListener("load", onReady);
    };
  }, [reducedMotion, repaint]);

  // Track visibility separately from the decode trigger, so the ambient loop
  // can idle whenever the portrait is scrolled away.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver((entries) =>
      setOnScreen(entries.some((entry) => entry.isIntersecting)),
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  const showPhoto = developed || failed;

  // The ambient scan. It runs alongside the decode as well, so the dots are
  // already moving while they resolve, and pauses while the photo is showing.
  useEffect(() => {
    if (reducedMotion || showPhoto || !onScreen) return;

    let frame = 0;
    let timer = 0;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      phaseRef.current = (elapsed % AMBIENT_PERIOD_MS) / AMBIENT_PERIOD_MS;
      repaint();
      timer = window.setTimeout(() => {
        frame = requestAnimationFrame(tick);
      }, 1000 / AMBIENT_FPS);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [onScreen, reducedMotion, repaint, showPhoto]);

  return (
    <button
      type="button"
      aria-pressed={showPhoto}
      onPointerEnter={(e) => e.pointerType !== "touch" && setDeveloped(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setDeveloped(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setDeveloped(true)}
      onBlur={() => setDeveloped(false)}
      onClick={() => !canHover && setDeveloped((prev) => !prev)}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.03] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.95)] transition-colors duration-300 hover:border-accent/[0.45]",
        className,
      )}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={132}
        height={168}
        onLoad={repaint}
        onError={() => setFailed(true)}
        // Matches the canvas crop exactly: scaling by 1/CROP_ZOOM about
        // CROP_FOCAL_Y reproduces the same source window, so the crossfade
        // registers instead of jumping.
        style={{
          transform: `scale(${1 / CROP_ZOOM})`,
          transformOrigin: `50% ${CROP_FOCAL_Y * 100}%`,
        }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
          showPhoto ? "opacity-100" : "opacity-0",
        )}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ease-out",
          showPhoto ? "opacity-0" : "opacity-100",
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2 text-center font-mono text-[10px] tracking-[0.06em] text-text-muted transition-opacity duration-300",
          showPhoto ? "opacity-0" : "opacity-100",
        )}
      >
        {canHover ? "hover to develop" : "tap to develop"}
      </span>
    </button>
  );
}
