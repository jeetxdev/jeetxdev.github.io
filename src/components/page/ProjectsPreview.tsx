import { PROJECTS, PROJECTS_NOTE, projectLetter } from "@/data/projects";
import { SectionRule } from "@/components/SectionRule";
import { ArrowLink } from "@/components/projects/ArrowLink";
import { ComingNextCard } from "@/components/projects/ExtraCards";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useScene } from "@/hooks/useScene";
import { PROJECTS_ID, PROJECTS_URL } from "@/lib/sections";
import { FigureLabel } from "./FigureLabel";

/** How many projects the home page shows before "See all projects". */
const PREVIEW_COUNT = 3;

/** Fig. 4 on the home page: the newest side projects and the way to sheet 2. */
export function ProjectsPreview() {
  // Only the heading is a scene: each card is its own, and scenes must not nest.
  const { sceneRef } = useScene<HTMLDivElement>();
  const shown = PROJECTS.slice(0, PREVIEW_COUNT);

  return (
    <section id={PROJECTS_ID} aria-labelledby="projects-heading" className="scroll-mt-24 pb-12">
      <div ref={sceneRef} className="scene relative flex flex-wrap items-end justify-between gap-6 pt-12">
        <SectionRule />
        <div className="min-w-0">
          <FigureLabel as="h2" id="projects-heading" figure={4} title="Side projects" className="scene-fade" />
          <p className="scene-fade fade-step-1 mt-6 font-display text-[clamp(2.25rem,4.6vw,3.5rem)] leading-none font-bold uppercase">
            Built on my own time.
          </p>
        </div>
        <ArrowLink arrow="next" href={PROJECTS_URL} className="scene-fade fade-step-2">
          See all projects
        </ArrowLink>
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, index) => (
          <ProjectCard key={project.slug} project={project} letter={projectLetter(index)} />
        ))}
        {shown.length < PREVIEW_COUNT && <ComingNextCard />}
      </div>
      <p className="mt-6 max-w-measure font-mono text-xs text-muted uppercase">Note: {PROJECTS_NOTE}</p>
    </section>
  );
}
