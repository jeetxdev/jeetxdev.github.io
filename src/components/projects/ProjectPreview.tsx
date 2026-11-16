import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectPreviewProps = {
  project: Project;
  /** Sets the panel's height. */
  className?: string;
  large?: boolean;
};

/** The project's screenshot, or until there is one, its name on its own brand colour. */
export function ProjectPreview({ project, className, large = false }: ProjectPreviewProps) {
  if (project.image) {
    return (
      <img
        src={project.image.src}
        alt={project.image.alt}
        loading="lazy"
        className={cn("block w-full object-cover object-top", className)}
      />
    );
  }

  const swatch: CSSProperties = { backgroundColor: project.swatch };
  return (
    // The name is repeated in the card's heading, so the drawn panel is decoration.
    <div
      aria-hidden="true"
      style={swatch}
      className={cn("flex flex-col items-center justify-center gap-2 p-6 text-center", className)}
    >
      <span
        className={cn(
          "font-display leading-none font-bold text-[#fef3c7] uppercase",
          large ? "text-[3.5rem]" : "text-[2.25rem]",
        )}
      >
        {project.name}
      </span>
      {project.tagline && <span className="text-sm text-[#cfe3df]">{project.tagline}</span>}
    </div>
  );
}
