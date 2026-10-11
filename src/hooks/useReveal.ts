import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal:not(.is-visible)";
const VISIBLE_CLASS = "is-visible";
const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";

/**
 * Fades `.reveal` sections in as they scroll into view. Sections are hidden
 * while the terminal view is showing, so observation starts only once the
 * page view is active. Each section reveals once and stays revealed.
 */
export function useReveal(active: boolean, reduceMotion: boolean) {
  useEffect(() => {
    if (!active) return;

    const pending = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
    if (reduceMotion || !("IntersectionObserver" in window)) {
      pending.forEach((node) => node.classList.add(VISIBLE_CLASS));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(VISIBLE_CLASS);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN },
    );

    pending.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [active, reduceMotion]);
}
