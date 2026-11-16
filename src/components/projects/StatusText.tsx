import type { ProjectStatus } from "@/data/projects";

/** "Live" stands out in the accent colour. Work in progress stays muted. */
export function StatusText({ status }: { status: ProjectStatus }) {
  return status === "live" ? <span className="text-accent">Live</span> : <span>In progress</span>;
}
