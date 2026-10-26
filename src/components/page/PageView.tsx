import { yearsOfExperienceInWords } from "@/data/career";
import { AVAILABILITY } from "@/data/profile";
import { useReveal } from "@/hooks/useReveal";
import { About } from "./About";
import { Contact } from "./Contact";
import { Stack } from "./Stack";
import { Work } from "./Work";

export function PageView() {
  useReveal();

  return (
    <div>
      <section aria-labelledby="page-heading" className="pt-12 pb-8 lg:pt-20">
        <p className="font-mono text-xs font-medium text-muted">
          jeet, senior full stack developer
        </p>
        <h1
          id="page-heading"
          className="hero-gradient mt-6 max-w-hero font-mono text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl"
        >
          {yearsOfExperienceInWords()} years of making the whole stack{" "}
          <em className="text-accent not-italic">behave.</em>
        </h1>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
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
