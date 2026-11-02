import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/media";

const SCRAMBLE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/·-";
const MS_PER_CHAR = 22;
/** Spreads the pre-play placeholder across the character set without randomness in render. */
const PLACEHOLDER_STEP = 7;

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function placeholder(text: string): string {
  return Array.from(text, (char, index) =>
    char === " " ? char : SCRAMBLE_CHARS[(index * PLACEHOLDER_STEP) % SCRAMBLE_CHARS.length],
  ).join("");
}

function partlyDecoded(text: string, settled: number): string {
  return Array.from(text, (char, index) =>
    index < settled || char === " " ? char : randomChar(),
  ).join("");
}

type DecodeTextProps = {
  text: string;
  play: boolean;
};

/** Text that resolves left to right out of scrambled characters once `play` turns true. */
export function DecodeText({ text, play }: DecodeTextProps) {
  const [skip] = useState(prefersReducedMotion);
  const [shown, setShown] = useState(() => (skip ? text : placeholder(text)));

  useEffect(() => {
    if (skip || !play) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const settled = Math.floor((now - start) / MS_PER_CHAR);
      if (settled >= text.length) {
        setShown(text);
        return;
      }
      setShown(partlyDecoded(text, settled));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [play, skip, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </>
  );
}
