import { JOBS } from "@/data/jobs";
import { useScene } from "@/hooks/useScene";
import { DETAILS_ID } from "@/lib/sections";
import { DetailCard } from "./DetailCard";
import { FigureLabel } from "./FigureLabel";

const FIRST_DETAIL_CODE = "A".charCodeAt(0);

export function Details() {
  const { sceneRef } = useScene<HTMLElement>();

  return (
    <section
      ref={sceneRef}
      id={DETAILS_ID}
      aria-labelledby="details-heading"
      className="reveal scene scroll-mt-24 border-t border-rule py-12"
    >
      <FigureLabel as="h2" id="details-heading" figure={3} title="Details" />
      <div className="mt-6 grid gap-8">
        {JOBS.map((job, index) => (
          <DetailCard
            key={job.slug}
            job={job}
            letter={String.fromCharCode(FIRST_DETAIL_CODE + index)}
          />
        ))}
      </div>
    </section>
  );
}
