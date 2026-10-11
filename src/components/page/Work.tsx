import { useState } from "react";
import { JOBS } from "@/data/jobs";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const CAREER_START = Math.min(...JOBS.map((job) => Number(job.from)));

export function Work() {
  const last = JOBS.length - 1;
  // Only the current role opens on load, so the history reads as a scannable list.
  const [openSlugs, setOpenSlugs] = useState<ReadonlySet<string>>(() => new Set([JOBS[0].slug]));

  const toggle = (slug: string) => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (!next.delete(slug)) next.add(slug);
      return next;
    });
  };

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="reveal grid scroll-mt-20 grid-cols-12 gap-x-4 gap-y-6 border-t border-rule py-14 md:gap-x-8"
    >
      <div className="col-span-12 md:col-span-3">
        <SectionHeading id="work-heading" command="$ ls " path="~/work" />
        <p className="mt-1 font-mono text-[12px] text-muted">
          {JOBS.length} teams · {CAREER_START} to now · no gaps
        </p>
      </div>

      <ol className="col-span-12 md:col-span-9">
        {JOBS.map((job, index) => {
          const isOpen = openSlugs.has(job.slug);
          const detailsId = `job-${job.slug}`;

          return (
            <li
              key={job.slug}
              className={cn(
                "grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[8rem_1fr]",
                // Padding stays the same open or closed, so a toggle never moves the row's heading.
                index !== last && "border-b border-dashed border-rule pb-6",
                index !== 0 && "pt-6",
              )}
            >
              <p
                className={cn(
                  "font-mono text-[13px]",
                  index === 0 ? "text-accent" : "text-muted",
                )}
              >
                {job.from} - {job.to}
              </p>
              <article>
                <h3 className="font-mono text-lg font-bold tracking-[-0.02em]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    onClick={() => toggle(job.slug)}
                    className="group flex w-full items-baseline gap-2 text-left hover:text-accent"
                  >
                    <span
                      aria-hidden="true"
                      className="w-7 shrink-0 text-[13px] font-normal text-muted group-hover:text-accent"
                    >
                      {isOpen ? "[-]" : "[+]"}
                    </span>
                    {job.company}
                  </button>
                </h3>
                <p className="pl-9 font-mono text-[13px] text-muted">
                  {job.role} · {job.place}
                </p>
                <div id={detailsId} hidden={!isOpen} className="pl-9">
                  <ul className="mt-4 max-w-measure list-['-_'] space-y-2 pl-4 text-[1.05rem] leading-relaxed">
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-[12px] text-muted">
                    deps: {job.tech.join(", ")}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
