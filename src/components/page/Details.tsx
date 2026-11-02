import { JOBS } from "@/data/jobs";
import { SectionRule } from "@/components/SectionRule";
import { useScene } from "@/hooks/useScene";
import { DETAILS_ID } from "@/lib/sections";
import { DetailCard } from "./DetailCard";
import { FigureLabel } from "./FigureLabel";

const FIRST_DETAIL_CODE = "A".charCodeAt(0);

export function Details() {
  // Only the heading is a scene: each card is its own, and scenes must not nest.
  const { sceneRef } = useScene<HTMLDivElement>();

  return (
    <section
      id={DETAILS_ID}
      aria-labelledby="details-heading"
      className="scroll-mt-24 pb-12"
    >
      <div ref={sceneRef} className="scene relative pt-12">
        <SectionRule />
        <FigureLabel
          as="h2"
          id="details-heading"
          figure={3}
          title="Details"
          className="scene-fade"
        />
      </div>
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
