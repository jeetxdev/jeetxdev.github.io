import { useEffect, useRef, useState } from "react";
import { hasFinePointer } from "@/lib/media";

const LIT_CLASS = "is-lit";
const MOUSE_POINTER = "mouse";

/**
 * Lights the page grid around the mouse. Must sit inside a positioned box that starts at
 * the document origin, so page coordinates line its grid up with the body grid.
 */
export function GridLamp() {
  const [enabled] = useState(hasFinePointer);
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lamp = lampRef.current;
    if (!lamp) return;

    let clientX = 0;
    let clientY = 0;
    let frame = 0;

    const paint = () => {
      lamp.style.setProperty("--lamp-x", `${clientX + window.scrollX}px`);
      lamp.style.setProperty("--lamp-y", `${clientY + window.scrollY}px`);
    };
    // Scrolling moves the page under a still mouse, so the lamp follows scroll too.
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== MOUSE_POINTER) return;
      clientX = event.clientX;
      clientY = event.clientY;
      lamp.classList.add(LIT_CLASS);
      schedule();
    };
    // A null relatedTarget means the pointer left the window.
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) lamp.classList.remove(LIT_CLASS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div ref={lampRef} className="grid-lamp absolute top-0 left-0" />
    </div>
  );
}
