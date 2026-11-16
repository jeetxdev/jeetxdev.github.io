import { TracedEdges } from "@/components/TracedEdges";
import { useScene } from "@/hooks/useScene";
import { CONTACT_ID } from "@/lib/sections";

/** Holds a grid slot until the next project is ready. */
export function ComingNextCard() {
  const { sceneRef } = useScene<HTMLDivElement>();

  return (
    <div
      ref={sceneRef}
      className="scene traced traced-thin traced-dashed traced-faint flex min-h-48 flex-col md:min-h-[18rem] justify-center p-6"
    >
      <TracedEdges />
      <p className="traced-fill font-mono text-xs text-muted uppercase">Next project · On the drawing board</p>
      <p className="traced-fill mt-4 text-base leading-relaxed text-soft">
        More projects are in progress. Check back soon.
      </p>
    </div>
  );
}

/** The last slot in the grid: an invitation to hire me for something similar. */
export function HireCard() {
  const { sceneRef } = useScene<HTMLElement>();

  return (
    <article
      ref={sceneRef}
      aria-labelledby="hire-heading"
      className="scene traced traced-thin traced-accent flex min-h-48 flex-col md:min-h-[18rem] justify-center p-6"
    >
      <TracedEdges />
      <p className="traced-fill font-mono text-xs text-accent uppercase">Your project?</p>
      <h3
        id="hire-heading"
        className="traced-fill mt-2 font-display text-[1.875rem] leading-none font-bold uppercase"
      >
        Need something like this?
      </h3>
      <p className="traced-fill mt-2 text-base leading-relaxed text-soft">
        I can build a site or web app like these for your business.
      </p>
      <a href={`#${CONTACT_ID}`} className="sheet-link traced-fill mt-4 self-start font-mono text-xs uppercase">
        Let's talk
      </a>
    </article>
  );
}
