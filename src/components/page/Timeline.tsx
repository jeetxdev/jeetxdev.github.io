import type { CSSProperties } from "react";
import { CAREER_START } from "@/data/career";
import { TIMELINE_ID } from "@/lib/sections";
import { timelineBars, timelineYears } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { DimensionLine } from "./DimensionLine";
import { FigureLabel } from "./FigureLabel";

/** Column count and spans come from the data, so they travel as CSS variables. */
type GridVars = CSSProperties & { "--cols"?: string; "--span"?: number };

/** One-year bars get a smaller label so long words like "Chartered" still fit. */
const NARROW_SPAN_YEARS = 1;

export function Timeline() {
  const years = timelineYears();
  const bars = timelineBars();
  const gridVars: GridVars = { "--cols": `repeat(${years}, minmax(0, 1fr))` };

  return (
    <section
      id={TIMELINE_ID}
      aria-labelledby="timeline-heading"
      className="reveal scroll-mt-24 border-t border-rule py-12"
    >
      <FigureLabel as="h2" id="timeline-heading" figure={2} title="Career timeline" />
      <DimensionLine
        className="mt-6"
        label={`${years} years · ${CAREER_START} to ${CAREER_START + years}`}
      />
      {/* Drawn to scale only where a one-year column is wide enough for a company
          name with the standard bar padding. Narrower screens list the jobs instead. */}
      <ol className="mt-4 grid grid-cols-1 gap-2 xl:grid-cols-(--cols)" style={gridVars}>
        {bars.map(({ job, spanYears, isCurrent }) => {
          const spanVars: GridVars = { "--span": spanYears };
          const isNarrow = spanYears <= NARROW_SPAN_YEARS;
          return (
            <li
              key={job.slug}
              style={spanVars}
              className={cn(
                "min-h-[4.75rem] border-2 p-3 xl:col-span-(--span)",
                isCurrent ? "border-accent" : "border-ink",
              )}
            >
              <p className={cn("font-mono text-xs text-muted", isNarrow && "xl:text-[0.6875rem]")}>
                {job.from}→{job.to}
              </p>
              <p
                className={cn(
                  "mt-2 font-display text-[1.1875rem] leading-[1.05] font-bold uppercase hyphens-auto",
                  isNarrow && "xl:text-[0.875rem]",
                )}
              >
                {job.company}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
