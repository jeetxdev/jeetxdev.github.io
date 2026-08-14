import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Cursor parallax on the background glows, writing translate offsets
 * directly to each glow's style rather than through state. Only attached
 * when the pointer can hover and reduced motion is off.
 */
export function usePointerParallax(
  glowRefs: RefObject<(HTMLDivElement | null)[]>,
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      glowRefs.current.forEach((glow, i) => {
        if (!glow) return;
        glow.style.translate = `${x * (26 + i * 12)}px ${y * (18 + i * 10)}px`;
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [glowRefs, reducedMotion]);
}
