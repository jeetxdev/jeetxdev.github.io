import { JOBS } from "@/data/jobs";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const CAREER_START = Math.min(...JOBS.map((job) => Number(job.from)));

export function Work() {
  const last = JOBS.length - 1;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="reveal grid scroll-mt-20 grid-cols-12 gap-x-4 md:gap-x-8 gap-y-6 border-t border-rule py-14"
    >
      <div className="col-span-12 md:col-span-3">
        <SectionHeading id="work-heading" command="$ ls " path="~/work" />
        <p className="mt-1 font-mono text-[12px] text-muted">
          {JOBS.length} teams · {CAREER_START} to now · no gaps
        </p>
      </div>

      <ol className="col-span-12 md:col-span-9">
        {JOBS.map((job, index) => (
          <li
            key={job.slug}
            className={cn(
              "grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[8rem_1fr]",
              index !== last && "border-b border-dashed border-rule pb-10",
              index !== 0 && "pt-10",
            )}
          >
            <p className={cn("font-mono text-[13px]", index === 0 ? "text-accent" : "text-muted")}>
              {job.from} - {job.to}
            </p>
            <article>
              <h3 className="font-mono text-lg font-bold tracking-[-0.02em]">{job.company}</h3>
              <p className="font-mono text-[13px] text-muted">
                {job.role} · {job.place}
              </p>
              <ul className="mt-4 max-w-measure list-['-_'] space-y-2 pl-4 text-[1.05rem] leading-relaxed">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-[12px] text-muted">deps: {job.tech.join(", ")}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
