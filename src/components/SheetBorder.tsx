/**
 * The drawing border as four separate edges, so the top and sides can be traced in on load.
 * The parent must be positioned and keep a 2px transparent border to reserve the space.
 */
export function SheetBorder() {
  return (
    <>
      <span
        aria-hidden="true"
        className="sheet-edge-top pointer-events-none absolute -inset-x-0.5 -top-0.5 h-0.5 bg-ink"
      />
      <span
        aria-hidden="true"
        className="sheet-edge-side pointer-events-none absolute -inset-y-0.5 -left-0.5 w-0.5 bg-ink"
      />
      <span
        aria-hidden="true"
        className="sheet-edge-side pointer-events-none absolute -inset-y-0.5 -right-0.5 w-0.5 bg-ink"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-0.5 -bottom-0.5 h-0.5 bg-ink"
      />
    </>
  );
}
