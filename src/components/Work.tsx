import type { CSSProperties } from "react";
import { JOBS } from "@/data/jobs";
import { withAlpha } from "@/lib/utils";
import { SectionLabel } from "./SectionLabel";

const OLDEST = Number(JOBS[JOBS.length - 1].from);
const YEARS = new Date().getFullYear() - OLDEST;

/**
 * How much of each element survives at the oldest role. Everything fades
 * toward the page background rather than toward a fixed colour, so the ramp
 * holds in both themes.
 */
const FADE_FLOOR = {
  year: 0.6,
  date: 0.7,
  node: 0.4,
  cardBorder: 0.36,
  cardSurface: 0.44,
  role: 0.72,
  company: 0.8,
  point: 0.78,
  marker: 0.65,
  tech: 0.84,
} as const;

/** 1 at the current role, easing to the element's floor at the oldest. */
const fade = (depth: number, floor: number) => 1 - depth * (1 - floor);

/**
 * Roles hang off one continuous spine rather than sitting in five detached
 * cards - the same "eleven years, no gaps" idea the hero tenure bar draws,
 * paid off at full length. Everything ramps with `depth` (0 = current role,
 * 1 = oldest): the node, the card surface and the type all step back as the
 * work recedes, so the current role reads as current without being shouted.
 */
export function Work() {
  const last = JOBS.length - 1;

  return (
    <section id="work" className="pt-[104px]">
      <SectionLabel meta={`${JOBS.length} teams · ${YEARS} yrs`}>
        Where I&rsquo;ve been
      </SectionLabel>

      <div className="relative mt-[34px]">
        <span
          aria-hidden="true"
          className="job-spine absolute top-0 bottom-0 left-[84px] w-px -translate-x-1/2 max-[721px]:left-[53px]"
        />

        {JOBS.map((job, index) => {
          const depth = index / last;
          const live = index === 0;

          return (
            <article
              key={job.company}
              data-reveal
              className="relative grid grid-cols-[68px_32px_1fr] pb-[18px] last:pb-0 max-[721px]:grid-cols-[44px_18px_1fr]"
            >
              <div className="min-w-0 pt-[3px] text-right font-mono text-[11.5px]">
                <div
                  className="font-display text-[30px] leading-none font-medium tracking-[-0.03em] max-[721px]:text-[17px]"
                  style={{
                    color: withAlpha(
                      "var(--color-ink-brightest)",
                      fade(depth, FADE_FLOOR.year),
                    ),
                  }}
                >
                  {job.from}
                </div>
                <div
                  className="mt-[6px] max-[721px]:mt-[4px] max-[721px]:text-[10.5px]"
                  style={{
                    color: live
                      ? "var(--color-accent)"
                      : withAlpha(
                          "var(--color-text-faint)",
                          fade(depth, FADE_FLOOR.date),
                        ),
                  }}
                >
                  {job.to}
                </div>
              </div>

              <div className="flex justify-center">
                <span
                  aria-hidden="true"
                  className={
                    live
                      ? "job-node job-node-live mt-[9px] h-[11px] w-[11px] max-[721px]:mt-[3px] max-[721px]:h-[9px] max-[721px]:w-[9px]"
                      : "job-node mt-[11px] h-[7px] w-[7px] max-[721px]:mt-[5px] max-[721px]:h-[6px] max-[721px]:w-[6px]"
                  }
                  style={
                    live
                      ? undefined
                      : {
                          borderColor: withAlpha(
                            "var(--color-accent)",
                            0.5 * fade(depth, FADE_FLOOR.node),
                          ),
                        }
                  }
                />
              </div>

              <div
                className="job-card rounded-[16px] px-[26px] py-[22px] max-[721px]:px-[18px] max-[721px]:py-[18px]"
                style={{
                  "--job-border": withAlpha(
                    "var(--color-line-strong)",
                    fade(depth, FADE_FLOOR.cardBorder),
                  ),
                  "--job-bg": withAlpha(
                    "var(--color-surface)",
                    fade(depth, FADE_FLOOR.cardSurface),
                  ),
                } as CSSProperties}
              >
                <h3
                  className="m-0 font-display text-[22px] font-medium tracking-[-0.02em] max-[721px]:text-[19px]"
                  style={{
                    color: withAlpha(
                      "var(--color-ink-brightest)",
                      fade(depth, FADE_FLOOR.role),
                    ),
                  }}
                >
                  {job.role}
                </h3>

                <div className="mt-[6px] flex flex-wrap items-baseline gap-x-[10px] gap-y-[2px]">
                  <span
                    className="text-[16px] max-[721px]:text-[15px]"
                    style={{
                      color: withAlpha(
                        "var(--color-text-dim)",
                        fade(depth, FADE_FLOOR.company),
                      ),
                    }}
                  >
                    {job.company}
                  </span>
                  <span className="font-mono text-[11.5px] text-text-faintest">
                    {job.place}
                  </span>
                </div>

                <ul className="mt-[16px] flex list-none flex-col gap-[10px] p-0">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="grid grid-cols-[20px_1fr] text-[16px] leading-[1.6] max-[721px]:text-[15px]"
                      style={{
                        color: withAlpha(
                          "var(--color-text-soft)",
                          fade(depth, FADE_FLOOR.point),
                        ),
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.72em] block h-px w-[9px]"
                        style={{
                          background: withAlpha(
                            "var(--color-marker)",
                            fade(depth, FADE_FLOOR.marker),
                          ),
                        }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-[16px] font-mono text-[11.5px] leading-[1.7] lowercase"
                  style={{
                    color: withAlpha(
                      "var(--color-text-dim)",
                      fade(depth, FADE_FLOOR.tech),
                    ),
                  }}
                >
                  {job.tech.join(" · ")}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
