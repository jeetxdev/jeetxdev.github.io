import { useRef } from "react";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function Background() {
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  usePointerParallax(glowRefs);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        ref={(el) => {
          glowRefs.current[0] = el;
        }}
        className="bg-glow bg-glow-1"
      />
      <div
        ref={(el) => {
          glowRefs.current[1] = el;
        }}
        className="bg-glow bg-glow-2"
      />
      <div
        ref={(el) => {
          glowRefs.current[2] = el;
        }}
        className="bg-glow bg-glow-3"
      />
      <div className="bg-grid-overlay" />
    </div>
  );
}

export function ProgressRail() {
  const barRef = useRef<HTMLDivElement>(null);
  useScrollProgress(barRef);

  return <div ref={barRef} className="progress-rail" />;
}
