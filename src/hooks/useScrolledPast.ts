import { useEffect, useState } from "react";

export function useScrolledPast(offset: number): boolean {
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolledPast(window.scrollY > offset);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return hasScrolledPast;
}
