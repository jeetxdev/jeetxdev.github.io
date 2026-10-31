import { yearsOfExperienceInWords } from "@/data/career";
import { AVAILABILITY, NAME } from "@/data/profile";
import { FigureLabel } from "./FigureLabel";
import { LayersDiagram } from "./LayersDiagram";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="flex flex-wrap gap-12 py-12">
      <div className="min-w-0 flex-[1_1_26rem]">
        <FigureLabel figure={1} title="General arrangement" />
        <h1
          id="hero-heading"
          className="mt-6 font-display text-[clamp(3.5rem,7.6vw,6.5rem)] leading-[0.92] font-semibold tracking-[0.01em] uppercase"
        >
          {NAME},
          <br />
          full stack.
        </h1>
        <p className="mt-6 max-w-[29rem] text-[1.1875rem] leading-relaxed text-soft">
          Senior developer in Bangalore. {yearsOfExperienceInWords()} years designing and
          building web applications end to end, from the interface down to the data.
        </p>
        <p className="mt-6 font-mono text-[0.8125rem] uppercase">
          <span className="text-accent">Status:</span> {AVAILABILITY}
        </p>
      </div>
      <LayersDiagram />
    </section>
  );
}
