import type { Project } from "@/data/projects";
import { TracedEdges } from "@/components/TracedEdges";
import { useScene } from "@/hooks/useScene";
import { ProjectPreview } from "./ProjectPreview";
import { StatusText } from "./StatusText";

type ProjectCardProps = {
  project: Project;
  letter: string;
};

/** A project in a grid: preview on top, then what it is and a link to try it. */
export function ProjectCard({ project, letter }: ProjectCardProps) {
  const { sceneRef } = useScene<HTMLElement>();
  const headingId = `project-card-${project.slug}`;

  return (
    <article
      ref={sceneRef}
      aria-labelledby={headingId}
      className="scene traced traced-thin flex flex-col"
    >
      <TracedEdges />
      <ProjectPreview project={project} className="traced-fill h-44 border-b border-rule" />
      {/* Sits on the border over the preview, so it needs the paper colour behind it. */}
      <span className="traced-fill absolute -top-3 left-4 bg-paper px-2 font-mono text-xs text-accent uppercase">
        Project {letter}
      </span>
      <div className="traced-fill flex flex-1 flex-col p-6">
        <p className="font-mono text-xs text-muted uppercase">
          {project.kind} · <StatusText status={project.status} />
        </p>
        <h3 id={headingId} className="mt-2 font-display text-[1.875rem] leading-none font-bold uppercase">
          {project.name}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-soft">{project.summary}</p>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sheet-link mt-auto self-start pt-4 font-mono text-xs uppercase"
          >
            View live site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
