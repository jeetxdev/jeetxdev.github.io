import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal:not(.is-visible)";
const VISIBLE_CLASS = "is-visible";
const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";

/**
 * Fades `.reveal` sections in as they scroll into view. Each section reveals
 * once and stays revealed. Reduced motion keeps the fade and drops the rise in CSS.
 */
export function useReveal() {
  useEffect(() => {
    const pending = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
    if (!("IntersectionObserver" in window)) {
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
  }, []);
}
