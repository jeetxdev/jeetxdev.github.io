import { JOBS } from "@/data/jobs";
import { SectionLabel } from "./SectionLabel";

export function Work() {
  return (
    <section id="work" className="pt-[104px]">
      <SectionLabel meta={`${JOBS.length} teams · 10 yrs`}>
        Where I&rsquo;ve been
      </SectionLabel>

      <div className="mt-[30px] flex flex-col gap-4">
        {JOBS.map((job) => (
          <article
            key={job.company}
            data-reveal
            data-job
            className="glass-card grid grid-cols-[150px_1fr] gap-[30px] rounded-[18px] px-[30px] py-7 max-[721px]:grid-cols-1 max-[721px]:gap-4 max-[721px]:px-5 max-[721px]:py-6"
          >
            <div
              data-job-rail
              className="font-mono text-[12px] text-text-faint max-[721px]:flex max-[721px]:flex-wrap max-[721px]:items-baseline max-[721px]:gap-[10px]"
            >
              <div
                data-job-year
                className="font-display text-[30px] leading-none font-medium tracking-[-0.03em] text-ink-bright max-[721px]:text-[24px]"
              >
                {job.from}
              </div>
              <div className="mt-1 text-accent max-[721px]:mt-0">{job.to}</div>
              <div className="mt-[10px] max-[721px]:mt-0">{job.place}</div>
            </div>

            <div>
              <h3 className="m-0 font-display text-[24px] font-medium tracking-[-0.02em] text-[#f2f5fb]">
                {job.role}
              </h3>
              <div className="mt-[5px] text-[16px] text-text-dim">
                {job.company}
              </div>

              <ul className="mt-[18px] flex list-none flex-col gap-[10px] p-0">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="grid grid-cols-[18px_1fr] gap-x-0.5 text-[16px] leading-[1.6] text-text-soft"
                  >
                    <span aria-hidden="true" className="text-marker">
                      ▸
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-[18px] flex flex-wrap gap-[6px] font-mono text-[11.5px]">
                {job.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-[10px] py-[5px] text-text-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
