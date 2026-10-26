import { useState } from "react";
import { CAREER_START } from "@/data/career";
import { JOBS } from "@/data/jobs";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

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
      className="reveal grid scroll-mt-20 grid-cols-12 gap-x-4 gap-y-6 border-t border-rule pt-12 pb-16 md:gap-x-8"
    >
      <div className="col-span-12 md:col-span-3">
        <SectionHeading id="work-heading" command="$ ls " path="~/work" />
        <p className="mt-1 font-mono text-xs text-muted">
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
                  "font-mono text-xs font-medium tabular-nums",
                  index === 0 ? "text-accent" : "text-muted",
                )}
              >
                {job.from} to {job.to}
              </p>
              <article>
                <h3 className="font-mono text-lg font-bold tracking-tight">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    onClick={() => toggle(job.slug)}
                    className="group flex w-full items-baseline gap-2 text-left transition duration-300 ease-base hover:text-accent active:translate-y-px"
                  >
                    <span
                      aria-hidden="true"
                      className="w-8 shrink-0 text-xs font-normal text-muted transition-colors duration-300 ease-base group-hover:text-accent"
                    >
                      {isOpen ? "[-]" : "[+]"}
                    </span>
                    {job.company}
                  </button>
                </h3>
                <p className="pl-10 font-mono text-xs text-muted">
                  {job.role} · {job.place}
                </p>
                <div id={detailsId} hidden={!isOpen} className="pl-10">
                  <ul className="mt-4 max-w-measure list-['·_'] space-y-2 pl-4 text-base">
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-xs text-muted">
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
