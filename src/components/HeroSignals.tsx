import { Fragment } from "react";
import { JOBS } from "@/data/jobs";
import { withAlpha } from "@/lib/utils";

/**
 * The working stack, grouped by layer rather than listed flat - the
 * Playground's /stack payload is the exhaustive version, this is the glance.
 */
const STACK = [
  { layer: "ui", tools: ["react", "typescript"] },
  { layer: "style", tools: ["scss", "tailwind"] },
  { layer: "api", tools: ["node", "express"] },
  { layer: "data", tools: ["postgres", "mysql"] },
  { layer: "ops", tools: ["ci/cd", "docker"] },
];

/** Tenure segments, oldest first, each running until the next role starts. */
const TIMELINE = [...JOBS]
  .sort((a, b) => Number(a.from) - Number(b.from))
  .map((job, index, all) => {
    const from = Number(job.from);
    const next = all[index + 1];
    return {
      company: job.company,
      from,
      to: next ? Number(next.from) : new Date().getFullYear(),
    };
  });

const CAREER_START = TIMELINE[0].from;
const CAREER_YEARS = new Date().getFullYear() - CAREER_START;
const CURRENT = TIMELINE[TIMELINE.length - 1];
const CURRENT_YEAR_OF = new Date().getFullYear() - CURRENT.from + 1;

/** Tenure segments brighten toward the present, oldest role faintest. */
const SEGMENT_MIN_ALPHA = 0.22;
const SEGMENT_ALPHA_SPAN = 0.72;

/**
 * The panel beside the hero portrait: what the work is built with, and
 * eleven years shown as tenure rather than asserted as a number.
 */
export function HeroSignals() {
  return (
    <div className="flex flex-1 flex-col gap-[10px] font-mono text-[12px] text-text-dim">
      <div className="glass-stat rounded-xl px-[14px] py-3">
        <dl className="grid grid-cols-[44px_1fr] gap-y-[3px] text-[11.5px] max-[721px]:grid-cols-[38px_1fr] max-[721px]:text-[11px]">
          {STACK.map(({ layer, tools }) => (
            <Fragment key={layer}>
              <dt className="text-text-faint">{layer}</dt>
              <dd className="m-0 text-text-soft">{tools.join(" · ")}</dd>
            </Fragment>
          ))}
        </dl>
      </div>

      <div className="glass-stat rounded-xl px-[14px] py-3">
        <div className="flex items-baseline justify-between gap-2 text-[10.5px] text-text-faint">
          <span>{CAREER_START}</span>
          <span className="text-text-dim">
            {CAREER_YEARS} yrs · {TIMELINE.length} teams
          </span>
          <span>now</span>
        </div>

        <div
          role="img"
          aria-label={`${CAREER_YEARS} years across ${TIMELINE.length} teams, ${CAREER_START} to now, with no gaps.`}
          className="mt-[9px] flex h-[7px] gap-[3px]"
        >
          {TIMELINE.map((entry, index) => (
            <span
              key={entry.company}
              title={`${entry.company} · ${entry.from}–${
                index === TIMELINE.length - 1 ? "now" : entry.to
              }`}
              style={{
                flexGrow: Math.max(0.5, entry.to - entry.from),
                background: withAlpha(
                  "var(--color-accent)",
                  SEGMENT_MIN_ALPHA +
                    (index / (TIMELINE.length - 1)) * SEGMENT_ALPHA_SPAN,
                ),
              }}
              className="rounded-full transition-[filter] duration-200 hover:brightness-125"
            />
          ))}
        </div>

        <div className="mt-[9px] text-text-faint">
          {CURRENT.company} · year {CURRENT_YEAR_OF}
        </div>
      </div>
    </div>
  );
}
