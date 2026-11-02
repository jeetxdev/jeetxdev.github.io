import { yearsOfExperienceInWords } from "@/data/career";
import { NAME } from "@/data/profile";
import { useScene } from "@/hooks/useScene";
import { FigureLabel } from "./FigureLabel";
import { LayersDiagram } from "./LayersDiagram";
import { PlottedText } from "./PlottedText";
import { StatusLine } from "./StatusLine";

export function Hero() {
  // The headline triggers the replay, so it plays when the name is back on screen,
  // not as soon as the bottom of the diagram peeks in.
  const { sceneRef, triggerRef, visit } = useScene<HTMLElement, HTMLHeadingElement>();

  return (
    <section
      ref={sceneRef}
      aria-labelledby="hero-heading"
      className="scene flex flex-wrap gap-12 py-12"
    >
      <div className="min-w-0 flex-[1_1_26rem]">
        <FigureLabel figure={1} title="General arrangement" className="intro-label" />
        {/* w-fit keeps the pen line's travel to the width of the text. */}
        <h1
          ref={triggerRef}
          id="hero-heading"
          className="relative mt-6 w-fit font-display text-[clamp(3.5rem,7.6vw,6.5rem)] leading-[0.92] font-bold tracking-[0.01em] uppercase"
        >
          <PlottedText>
            {NAME},
            <br />
            full stack.
          </PlottedText>
        </h1>
        <p className="intro-copy mt-6 max-w-[29rem] text-[1.1875rem] leading-relaxed text-soft">
          Senior developer in Bangalore. {yearsOfExperienceInWords()} years designing and
          building web applications end to end, from the interface down to the data.
        </p>
        <StatusLine visit={visit} />
      </div>
      <LayersDiagram />
    </section>
  );
}
