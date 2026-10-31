export const TIMELINE_ID = "timeline";
export const DETAILS_ID = "details";
export const CONTACT_ID = "contact";

export type NavItem = {
  id: string;
  label: string;
};

/** In page order, so the last one is the section at the bottom of the sheet. */
export const NAV_ITEMS: readonly NavItem[] = [
  { id: TIMELINE_ID, label: "Timeline" },
  { id: DETAILS_ID, label: "Details" },
  { id: CONTACT_ID, label: "Contact" },
];

export const NAV_IDS: readonly string[] = NAV_ITEMS.map(({ id }) => id);
