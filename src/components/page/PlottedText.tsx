import type { ReactNode } from "react";

/**
 * Text that starts as an outline and is filled in behind a moving pen line.
 * The parent must be positioned and as wide as the text.
 */
export function PlottedText({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="plot-outline absolute inset-0">
        {children}
      </span>
      <span className="plot-fill relative block">{children}</span>
      <span
        aria-hidden="true"
        className="plot-pen pointer-events-none absolute -inset-y-2 left-0 w-0.5 bg-accent"
      />
    </>
  );
}
