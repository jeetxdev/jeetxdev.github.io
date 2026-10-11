export type Theme = "light" | "dark";

/** The menu bar and the terminal both speak of day and night. */
export const THEME_LABELS: Record<Theme, string> = {
  light: "day",
  dark: "night",
};

/** Kept in sync with the pre-paint script in index.html. */
export const THEME_STORAGE_KEY = "jeetxdev-theme";
export const THEME_ATTRIBUTE = "data-theme";

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';

/** Browser chrome tint, matched to each theme's page background. */
const THEME_COLORS: Record<Theme, string> = {
  light: "#faf8f5",
  dark: "#161410",
};

/** The pre-paint script already resolved the theme, so the attribute is the truth. */
export function readPaintedTheme(): Theme {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "light"
    ? "light"
    : "dark";
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private browsing or blocked storage: the choice lasts for this visit only.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  document
    .querySelector(THEME_COLOR_META_SELECTOR)
    ?.setAttribute("content", THEME_COLORS[theme]);
}
