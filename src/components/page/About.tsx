import { NAME } from "@/data/profile";
import { Bio } from "../Bio";
import { SectionHeading } from "./SectionHeading";

const PORTRAIT_WIDTH = 150;
const PORTRAIT_HEIGHT = 188;

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="reveal grid grid-cols-12 gap-x-4 gap-y-6 border-t border-rule pt-12 pb-16 md:gap-x-8"
    >
      <SectionHeading
        id="about-heading"
        command="$ cat "
        path="~/about"
        className="col-span-12 md:col-span-3"
      />
      <figure className="col-span-6 sm:col-span-4 md:col-span-2">
        <div className="dither aspect-[4/5] border border-ink">
          <img
            className="dither-day"
            src="/profile-dither-day.png"
            alt={`Portrait of ${NAME}`}
            width={PORTRAIT_WIDTH}
            height={PORTRAIT_HEIGHT}
          />
          <img
            className="dither-night"
            src="/profile-dither-night.png"
            alt={`Portrait of ${NAME}`}
            width={PORTRAIT_WIDTH}
            height={PORTRAIT_HEIGHT}
          />
        </div>
      </figure>
      <div className="col-span-12 max-w-measure space-y-4 text-lg md:col-span-7">
        <Bio />
      </div>
    </section>
  );
}
