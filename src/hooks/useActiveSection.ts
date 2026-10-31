import { useEffect, useState } from "react";

/** A section counts as current once its top passes this share of the viewport. */
const ACTIVATION_RATIO = 0.4;
/** Scroll positions this close to the end count as the bottom of the page. */
const BOTTOM_TOLERANCE_PX = 2;

function findActive(ids: readonly string[]): string | null {
  const { innerHeight, scrollY } = window;
  const atBottom =
    innerHeight + scrollY >= document.documentElement.scrollHeight - BOTTOM_TOLERANCE_PX;
  // The last section can be too short to ever reach the activation line.
  if (atBottom) return ids[ids.length - 1] ?? null;

  let active: string | null = null;
  for (const id of ids) {
    const node = document.getElementById(id);
    if (node && node.getBoundingClientRect().top <= innerHeight * ACTIVATION_RATIO) active = id;
  }
  return active;
}

/** The id of the section the reader is in, or null above the first one. */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(findActive(ids)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return active;
}
