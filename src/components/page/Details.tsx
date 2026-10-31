import { JOBS } from "@/data/jobs";
import { DETAILS_ID } from "@/lib/sections";
import { DetailCard } from "./DetailCard";
import { FigureLabel } from "./FigureLabel";

const FIRST_DETAIL_CODE = "A".charCodeAt(0);

export function Details() {
  return (
    <section
      id={DETAILS_ID}
      aria-labelledby="details-heading"
      className="reveal scroll-mt-24 border-t border-rule py-12"
    >
      <FigureLabel as="h2" id="details-heading" figure={3} title="Details" />
      <div className="mt-6 grid grid-cols-1 items-start gap-6 md:grid-cols-2">
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
