import { useEffect } from "react";

/**
 * One shared IntersectionObserver drives every [data-reveal] node on the
 * page (attached after the whole tree has mounted, since effects run
 * bottom-up). Each element is unobserved once it reveals — the animation
 * never reverses. Stagger delay is (index-in-document % 3) * 80ms.
 */
export function useReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "-6% 0px -6%" },
    );

    elements.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);
}
