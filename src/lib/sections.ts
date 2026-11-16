export const TIMELINE_ID = "timeline";
export const DETAILS_ID = "details";
export const PROJECTS_ID = "projects";
export const FEATURED_ID = "featured";
export const MORE_PROJECTS_ID = "more-projects";
export const CONTACT_ID = "contact";

/** Sheet 1 and sheet 2. The trailing slash is the address GitHub Pages serves the page at. */
export const HOME_URL = "/";
export const PROJECTS_URL = "/projects/";

export type NavLink = {
  label: string;
  href: string;
  /** Set for in-page links: the link is marked current while the reader is in that section. */
  sectionId?: string;
  /** Set for the link to the page the reader is on. */
  isCurrentPage?: boolean;
};

export const HOME_LINKS: readonly NavLink[] = [
  { label: "Timeline", href: `#${TIMELINE_ID}`, sectionId: TIMELINE_ID },
  { label: "Details", href: `#${DETAILS_ID}`, sectionId: DETAILS_ID },
  { label: "Projects", href: PROJECTS_URL },
  { label: "Contact", href: `#${CONTACT_ID}`, sectionId: CONTACT_ID },
];

/**
 * Every section on the home page in page order, including the ones without a menu link,
 * so the menu stops marking a section once the reader has scrolled past it.
 */
export const HOME_SECTION_IDS: readonly string[] = [
  TIMELINE_ID,
  DETAILS_ID,
  PROJECTS_ID,
  CONTACT_ID,
];

export const PROJECTS_LINKS: readonly NavLink[] = [
  { label: "Portfolio", href: HOME_URL },
  { label: "Projects", href: PROJECTS_URL, isCurrentPage: true },
  { label: "Contact", href: `#${CONTACT_ID}`, sectionId: CONTACT_ID },
];

export const PROJECTS_SECTION_IDS: readonly string[] = [FEATURED_ID, MORE_PROJECTS_ID, CONTACT_ID];
