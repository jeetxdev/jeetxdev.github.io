import { useState, type AnimationEvent } from "react";
import { DecodeText } from "@/components/DecodeText";
import { AVAILABILITY } from "@/data/profile";

type StatusLineProps = {
  /** Bumps each time the hero comes back into view, which scrambles the text again. */
  visit: number;
};

/** The availability line. It decodes once its own entrance animation has finished. */
export function StatusLine({ visit }: StatusLineProps) {
  const [decodedVisit, setDecodedVisit] = useState(-1);

  const onAnimationEnd = (event: AnimationEvent<HTMLParagraphElement>) => {
    if (event.target === event.currentTarget) setDecodedVisit(visit);
  };

  return (
    <p className="intro-copy mt-6 font-mono text-xs uppercase" onAnimationEnd={onAnimationEnd}>
      <span className="text-accent">Status:</span>{" "}
      <DecodeText key={visit} text={AVAILABILITY} play={decodedVisit === visit} />
    </p>
  );
}
