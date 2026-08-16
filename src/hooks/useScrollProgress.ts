import { useEffect, type RefObject } from "react";

/**
 * Writes scroll progress straight to the bar's style on a passive scroll
 * listener instead of React state, so the page never re-renders per frame.
 */
export function useScrollProgress(barRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const onScroll = () => {
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [barRef]);
}
