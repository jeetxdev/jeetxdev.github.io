import { useEffect } from "react";

/**
 * One shared IntersectionObserver drives every [data-reveal] node on the
 * page (attached after the whole tree has mounted, since effects run
 * bottom-up). Each element is unobserved once it reveals - the animation
 * never reverses. Stagger delay is (index-in-document % 3) * 80ms.
 *
 * The observer alone is not enough on a deep link. Landing on /#work sends
 * the browser jumping down the page around the same time the observer takes
 * its first reading, and whatever it misses in that race stays at opacity 0
 * for good, because a revealed element is unobserved and never looked at
 * again. So we also sweep the viewport by hand: once after the first paint
 * (so the entrance transition still plays rather than being skipped), and
 * once more on `load`, by which point fonts and images have settled the
 * layout and may have pushed something else into view.
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

    /** Reveal anything currently on screen without waiting on the observer. */
    const sweep = () => {
      for (const el of elements) {
        if (el.classList.contains("is-revealed")) continue;

        const { top, bottom } = el.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) {
          el.classList.add("is-revealed");
          io.unobserve(el);
        }
      }
    };

    // Two frames: the first paints the opacity-0 state, the second reveals,
    // so the transition has something to animate from.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(sweep);
    });

    if (document.readyState === "complete") {
      sweep();
    } else {
      window.addEventListener("load", sweep);
    }

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.removeEventListener("load", sweep);
      io.disconnect();
    };
  }, []);
}
