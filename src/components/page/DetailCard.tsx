import type { Job } from "@/data/jobs";

type DetailCardProps = {
  job: Job;
  letter: string;
};

export function DetailCard({ job, letter }: DetailCardProps) {
  const headingId = `detail-${job.slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="relative border-[1.5px] border-dashed border-trace p-6"
    >
      {/* Sits on the dashed border, so it needs the paper colour behind it. */}
      <span className="absolute -top-3 left-4 bg-paper px-2 font-mono text-xs text-accent uppercase">
        Detail {letter}
      </span>
      <p className="font-mono text-xs text-muted">
        {job.from} to {job.to} · {job.place}
      </p>
      <h3
        id={headingId}
        className="mt-2 font-display text-[1.875rem] leading-none font-semibold uppercase"
      >
        {job.company}
      </h3>
      <p className="mt-1.5 text-[0.9375rem] text-soft">{job.role}</p>
      <ul className="mt-4 grid list-disc gap-1 pl-[1.125rem] text-base leading-relaxed">
        {job.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-3.5 font-mono text-xs text-muted uppercase">
        Materials: {job.tech.join(", ")}
      </p>
    </article>
  );
}
