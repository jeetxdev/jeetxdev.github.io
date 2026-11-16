import { PROJECTS, PROJECTS_NOTE, projectLetter } from "@/data/projects";
import { SectionRule } from "@/components/SectionRule";
import { TracedEdges } from "@/components/TracedEdges";
import { FigureLabel } from "@/components/page/FigureLabel";
import { useScene } from "@/hooks/useScene";
import { FEATURED_ID, HOME_URL, MORE_PROJECTS_ID } from "@/lib/sections";
import { ComingNextCard, HireCard } from "./ExtraCards";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";

export function ProjectsView() {
  const [featured, ...rest] = PROJECTS;

  return (
    <>
      <Intro />
      {featured && (
        <section id={FEATURED_ID} aria-labelledby="featured-heading" className="scroll-mt-24 pb-12">
          <SectionHeading id="featured-heading" figure={2} title="Featured" />
          <div className="mt-8">
            <FeaturedProject project={featured} letter={projectLetter(0)} />
          </div>
        </section>
      )}
      <section id={MORE_PROJECTS_ID} aria-labelledby="more-heading" className="scroll-mt-24 pb-12">
        <SectionHeading id="more-heading" figure={3} title="More projects" />
        <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, index) => (
            <ProjectCard key={project.slug} project={project} letter={projectLetter(index + 1)} />
          ))}
          <ComingNextCard />
          <HireCard />
        </div>
      </section>
    </>
  );
}

function Intro() {
  const { sceneRef } = useScene<HTMLElement>();

  return (
    <section
      ref={sceneRef}
      aria-labelledby="projects-heading"
      className="scene flex flex-wrap items-end gap-12 py-12"
    >
      <div className="min-w-0 flex-[1_1_30rem]">
        <a
          href={HOME_URL}
          className="nav-link scene-fade inline-flex items-center gap-2 font-mono text-xs text-muted uppercase"
        >
          <BackIcon />
          Back to sheet 1 · Portfolio
        </a>
        <FigureLabel figure={1} title="Project index" className="scene-fade fade-step-1 mt-6" />
        <h1
          id="projects-heading"
          className="scene-fade fade-step-2 mt-6 font-display text-[clamp(3.5rem,7.6vw,6.5rem)] leading-[0.92] font-bold tracking-[0.01em] uppercase"
        >
          Side projects,
          <br />
          built end to end.
        </h1>
        <p className="scene-fade fade-step-3 mt-6 max-w-[32rem] text-[1.1875rem] leading-relaxed text-soft">
          Small, complete products I design and build on my own time. Each one is live, so you
          can click around and judge the work yourself.
        </p>
      </div>
      <aside
        aria-label="Note"
        className="traced traced-thin traced-accent min-w-0 flex-[1_1_20rem] p-6"
      >
        <TracedEdges />
        <p className="traced-fill font-mono text-xs text-accent uppercase">Note</p>
        <p className="traced-fill mt-2 font-mono text-xs leading-relaxed uppercase">{PROJECTS_NOTE}</p>
      </aside>
    </section>
  );
}

function SectionHeading({ id, figure, title }: { id: string; figure: number; title: string }) {
  const { sceneRef } = useScene<HTMLDivElement>();

  return (
    <div ref={sceneRef} className="scene relative pt-12">
      <SectionRule />
      <FigureLabel as="h2" id={id} figure={figure} title={title} className="scene-fade" />
    </div>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="shrink-0">
      <path d="M15 5 H2" />
      <path d="M6 1 L2 5 L6 9" />
    </svg>
  );
}
