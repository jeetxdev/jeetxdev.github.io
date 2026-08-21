import { JOBS } from "@/data/jobs";
import { SectionLabel } from "./SectionLabel";

const OLDEST = Number(JOBS[JOBS.length - 1].from);
const YEARS = new Date().getFullYear() - OLDEST;

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
                  style={{ color: `rgba(242, 245, 251, ${1 - depth * 0.4})` }}
                >
                  {job.from}
                </div>
                <div
                  className="mt-[6px] max-[721px]:mt-[4px] max-[721px]:text-[10.5px]"
                  style={{
                    color: live
                      ? "var(--color-accent)"
                      : `rgba(111, 125, 153, ${1 - depth * 0.3})`,
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
                          borderColor: `rgba(122, 214, 238, ${(
                            0.5 -
                            depth * 0.3
                          ).toFixed(2)})`,
                        }
                  }
                />
              </div>

              <div
                className="job-card rounded-[16px] px-[26px] py-[22px] max-[721px]:px-[18px] max-[721px]:py-[18px]"
                style={{
                  "--job-border": `rgba(255, 255, 255, ${(
                    0.14 -
                    depth * 0.09
                  ).toFixed(3)})`,
                  "--job-bg": `rgba(255, 255, 255, ${(
                    0.05 -
                    depth * 0.028
                  ).toFixed(3)})`,
                } as React.CSSProperties}
              >
                <h3
                  className="m-0 font-display text-[22px] font-medium tracking-[-0.02em] max-[721px]:text-[19px]"
                  style={{ color: `rgba(242, 245, 251, ${1 - depth * 0.28})` }}
                >
                  {job.role}
                </h3>

                <div className="mt-[6px] flex flex-wrap items-baseline gap-x-[10px] gap-y-[2px]">
                  <span
                    className="text-[16px] max-[721px]:text-[15px]"
                    style={{ color: `rgba(139, 154, 181, ${1 - depth * 0.2})` }}
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
                        color: `rgba(195, 205, 226, ${1 - depth * 0.22})`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.72em] block h-px w-[9px]"
                        style={{
                          background: `rgba(79, 110, 168, ${1 - depth * 0.35})`,
                        }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-[16px] font-mono text-[11.5px] leading-[1.7] lowercase"
                  style={{ color: `rgba(139, 154, 181, ${1 - depth * 0.16})` }}
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
