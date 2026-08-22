import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Cursor parallax on the background glows, writing translate offsets
 * directly to each glow's style rather than through state. Only attached
 * when the pointer can hover and reduced motion is off.
 *
 * Pointer events fire faster than the display refreshes, so moves are
 * coalesced into a single rAF write per frame; otherwise each event dirties
 * the glow layers that the backdrop-filtered panels sample from.
 */
export function usePointerParallax(
  glowRefs: RefObject<(HTMLDivElement | null)[]>,
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      frame = 0;
      glowRefs.current.forEach((glow, i) => {
        if (!glow) return;
        glow.style.translate = `${pendingX * (26 + i * 12)}px ${pendingY * (18 + i * 10)}px`;
      });
    };

    const onMove = (e: MouseEvent) => {
      pendingX = e.clientX / window.innerWidth - 0.5;
      pendingY = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [glowRefs, reducedMotion]);
}
