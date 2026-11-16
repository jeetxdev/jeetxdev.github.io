export type ProjectStatus = "live" | "in progress";

export type Project = {
  slug: string;
  name: string;
  /** What kind of thing it is, e.g. "Restaurant website". */
  kind: string;
  summary: string;
  status: ProjectStatus;
  liveUrl?: string;
  codeUrl?: string;
  highlights: string[];
  /** Leave empty to hide the "Materials" line. */
  tech: string[];
  /** Screenshot under public/, e.g. "/projects/angaar.webp". Without one, the preview panel is drawn. */
  image?: { src: string; alt: string };
  /** The drawn preview panel: the project's own brand colour behind its name. */
  swatch: string;
  tagline?: string;
};

/** Newest first. The first project is the featured one on the projects page. */
export const PROJECTS: Project[] = [
  {
    slug: "angaar",
    name: "Angaar",
    kind: "Restaurant website",
    tagline: "Indian kitchen & tandoor",
    summary:
      "A website for a neighbourhood Indian restaurant. Guests can see the menu, browse photos and book a table online.",
    status: "live",
    liveUrl: "https://angaar.modularhq.app",
    highlights: [
      "Table booking and contact through WhatsApp, with no backend",
      "Menu with share, print and delivery links",
      "Photo gallery with filters and a larger view on click",
    ],
    tech: [
      "ReactJS",
      "Vite",
      "Cloudflare Pages",
      "CSS Modules",
      "TypeScript",
      "React Router",
    ],
    swatch: "#0f3b36",
  },
];

/** Shown wherever projects are listed, so nobody mistakes them for work done for an employer. */
export const PROJECTS_NOTE =
  "My day job is internal banking software that I can't show publicly. I built these on my own time. They are not work I did for any company I work or worked for.";

const FIRST_PROJECT_CODE = "A".charCodeAt(0);

/** "A" for the first project, "B" for the next, like the detail cards. */
export function projectLetter(index: number): string {
  return String.fromCharCode(FIRST_PROJECT_CODE + index);
}
