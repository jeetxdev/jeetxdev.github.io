import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  command: string;
  path: string;
  className?: string;
};

/** A shell command as the section title; the command itself is decoration. */
export function SectionHeading({ id, command, path, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cn("font-mono text-xl font-bold tracking-[-0.02em]", className)}>
      <span className="text-muted" aria-hidden="true">
        {command}
      </span>
      {path}
    </h2>
  );
}
