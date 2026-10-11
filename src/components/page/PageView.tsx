import { useEffect, useRef } from "react";
import { AVAILABILITY } from "@/data/profile";
import { useReveal } from "@/hooks/useReveal";
import { About } from "./About";
import { Contact } from "./Contact";
import { Stack } from "./Stack";
import { Work } from "./Work";

type PageViewProps = {
  active: boolean;
  reduceMotion: boolean;
};

export function PageView({ active, reduceMotion }: PageViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasActive = useRef(active);

  useReveal(active, reduceMotion);

  // Screen readers land on the new view's heading after a switch.
  useEffect(() => {
    if (active && !wasActive.current) {
      headingRef.current?.focus({ preventScroll: true });
    }
    wasActive.current = active;
  }, [active]);

  return (
    <div hidden={!active}>
      <section aria-labelledby="page-heading" className="pt-14 pb-6 lg:pt-20">
        <p className="font-mono text-[13px] text-muted">
          jeet - senior full-stack developer
        </p>
        <h1
          id="page-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 max-w-[20ch] font-mono text-[2.5rem] leading-[1.04] font-extrabold tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]"
        >
          Eleven years of making the whole stack{" "}
          <em className="font-serif text-[1.4em] leading-[0.7] font-normal tracking-[-0.01em] text-accent italic">
            behave.
          </em>
        </h1>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[13px] text-muted">
          <span>React, Node, and API platforms for fintech and banking · Bangalore</span>
          <span className="text-ink">
            <span className="text-accent">●</span> {AVAILABILITY}
          </span>
        </p>
      </section>

      <About />
      <Work />
      <Stack />
      <Contact />
    </div>
  );
}
