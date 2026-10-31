import { Fragment } from "react";
import { STACK } from "@/data/profile";

/** The three layers drawn as boxes, top to bottom, each fed by its STACK entry. */
const DIAGRAM_LAYERS = [
  { layer: "frontend", label: "Interface" },
  { layer: "backend", label: "API" },
  { layer: "data", label: "Data" },
] as const;

const CRAFT_LAYER = "craft";

function toolsFor(layer: string): string[] {
  return STACK.find((entry) => entry.layer === layer)?.tools ?? [];
}

export function LayersDiagram() {
  const craft = toolsFor(CRAFT_LAYER);

  return (
    <figure aria-labelledby="layers-caption" className="m-0 flex min-w-0 flex-[1_1_25rem] flex-col">
      {DIAGRAM_LAYERS.map(({ layer, label }, index) => (
        <Fragment key={layer}>
          {index > 0 && <DownArrow />}
          <div className="flex items-baseline justify-between gap-4 border-2 border-ink bg-paper/85 px-6 py-4">
            <span className="font-display text-[1.625rem] font-semibold uppercase">{label}</span>
            <span className="text-right font-mono text-xs text-muted">
              {toolsFor(layer).join(" · ")}
            </span>
          </div>
        </Fragment>
      ))}
      <figcaption id="layers-caption" className="mt-4 font-mono text-xs text-muted uppercase">
        Note: I work across all three layers.
        {craft.length > 0 && ` Craft: ${craft.join(", ")}.`}
      </figcaption>
    </figure>
  );
}

function DownArrow() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="40"
      viewBox="0 0 20 40"
      className="mx-auto block text-ink"
    >
      <path d="M10 0 V 34" stroke="currentColor" strokeWidth="2" />
      <path d="M3 27 L10 37 L17 27" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
