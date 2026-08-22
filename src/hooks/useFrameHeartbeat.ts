import { useEffect, type RefObject } from "react";

/**
 * Keeps an empty rAF loop running while the target is on screen.
 *
 * Safari parks its display link once nothing schedules frames, and the first
 * frames after a cold requestAnimationFrame start land irregularly, with gaps
 * well over 100ms, until it spins back up. A stream that only lasts a second or
 * two would otherwise spend most of its life inside that ramp-up. Scoped to
 * visibility so an off-screen section costs nothing, and rAF is already inert
 * in a hidden tab.
 */
export function useFrameHeartbeat(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const target = ref.current;
    if (!enabled || !target) return;

    let frame = 0;

    const beat = () => {
      frame = requestAnimationFrame(beat);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!frame) frame = requestAnimationFrame(beat);
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, enabled]);
}
