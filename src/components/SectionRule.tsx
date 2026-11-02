/** The hairline across the top of a section. Its parent must be positioned and a `.scene`. */
export function SectionRule() {
  return (
    <span
      aria-hidden="true"
      className="scene-rule pointer-events-none absolute inset-x-0 top-0 h-px bg-rule"
    />
  );
}
