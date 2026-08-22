import { useEffect, useState } from "react";

/**
 * Collapses the observer root to a thin band across the viewport midline, so
 * at most one section intersects at a time and the active id cannot flicker
 * between two sections that both happen to be on screen.
 */
const MIDLINE_BAND = "-45% 0px -55% 0px";

export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: MIDLINE_BAND },
    );

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
