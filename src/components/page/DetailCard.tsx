import type { Job } from "@/data/jobs";
import { TracedEdges } from "@/components/TracedEdges";
import { useScene } from "@/hooks/useScene";

type DetailCardProps = {
  job: Job;
  letter: string;
};

export function DetailCard({ job, letter }: DetailCardProps) {
  const { sceneRef } = useScene<HTMLElement>();
  const headingId = `detail-${job.slug}`;

  return (
    <article
      ref={sceneRef}
      aria-labelledby={headingId}
      className="scene traced traced-thin traced-dashed traced-faint p-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-x-10"
    >
      <TracedEdges />
      {/* Sits on the dashed border, so it needs the paper colour behind it.
          left-4 plus px-2 lines its text up with the card's 24px padding. */}
      <span className="traced-fill absolute -top-3 left-4 bg-paper px-2 font-mono text-xs text-accent uppercase">
        Detail {letter}
      </span>
      <header className="traced-fill">
        <p className="font-mono text-xs text-muted">
          {job.from} to {job.to} · {job.place}
        </p>
        <h3
          id={headingId}
          className="mt-2 font-display text-[1.875rem] leading-none font-bold uppercase"
        >
          {job.company}
        </h3>
        <p className="mt-2 text-[0.9375rem] text-soft">{job.role}</p>
      </header>
      <div className="traced-fill">
        <ul className="mt-4 grid list-disc gap-2 pl-4 text-base leading-relaxed md:mt-0">
          {job.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-xs text-muted uppercase">
          Materials: {job.tech.join(", ")}
        </p>
      </div>
    </article>
  );
}

