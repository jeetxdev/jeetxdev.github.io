const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * The four sides of a `.traced` box, drawn over its transparent border. Inside a `.scene`
 * they are traced clockwise when the scene comes into view.
 */
export function TracedEdges() {
  return (
    <>
      {SIDES.map((side) => (
        <span key={side} aria-hidden="true" className={`edge edge-${side}`} />
      ))}
    </>
  );
}
