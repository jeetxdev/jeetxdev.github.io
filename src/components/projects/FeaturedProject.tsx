import type { Project } from "@/data/projects";
import { TracedEdges } from "@/components/TracedEdges";
import { useScene } from "@/hooks/useScene";
import { ArrowLink } from "./ArrowLink";
import { ProjectPreview } from "./ProjectPreview";
import { StatusText } from "./StatusText";

type FeaturedProjectProps = {
  project: Project;
  letter: string;
};

/** The newest project, drawn large: preview beside everything there is to say about it. */
export function FeaturedProject({ project, letter }: FeaturedProjectProps) {
  const { sceneRef } = useScene<HTMLElement>();
  const headingId = `project-${project.slug}`;

  return (
    <article
      ref={sceneRef}
      aria-labelledby={headingId}
      className="scene traced traced-thin md:grid md:grid-cols-2"
    >
      <TracedEdges />
      <ProjectPreview
        project={project}
        large
        className="traced-fill h-full min-h-80 border-b border-rule md:border-r md:border-b-0"
      />
      <span className="traced-fill absolute -top-3 left-4 bg-paper px-2 font-mono text-xs text-accent uppercase">
        Project {letter}
      </span>
      <div className="traced-fill p-6 md:p-12">
        <p className="font-mono text-xs text-muted uppercase">{project.kind}</p>
        <h3
          id={headingId}
          className="mt-2 font-display text-[clamp(2.25rem,4.6vw,3rem)] leading-none font-bold uppercase"
        >
          {project.name}
        </h3>
        <p className="mt-4 font-mono text-xs uppercase">
          <span className="text-accent">Status:</span>{" "}
          <StatusText status={project.status} /> · Personal project
        </p>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-soft">{project.summary}</p>
        {project.highlights.length > 0 && (
          <ul className="mt-4 grid list-disc gap-2 pl-4 text-base leading-relaxed">
            {project.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
        {project.tech.length > 0 && (
          <p className="mt-4 font-mono text-xs text-muted uppercase">
            Materials: {project.tech.join(", ")}
          </p>
        )}
        {(project.liveUrl || project.codeUrl) && (
          <div className="mt-6 flex flex-wrap gap-4">
            {project.liveUrl && (
              <ArrowLink arrow="out" solid href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                View live site
              </ArrowLink>
            )}
            {project.codeUrl && (
              <ArrowLink arrow="out" href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                Code on GitHub
              </ArrowLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
