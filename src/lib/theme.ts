export type Theme = "light" | "dark";

/** "system" is never stored: an empty key means the page follows the OS. */
export type ThemePreference = Theme | "system";

export const THEME_PREFERENCES: readonly ThemePreference[] = ["light", "dark", "system"];

export const PREFERENCE_LABELS: Record<ThemePreference, string> = {
  light: "Day",
  dark: "Night",
  system: "Auto",
};

/** Kept in sync with the pre-paint script in index.html. */
export const THEME_STORAGE_KEY = "jeetxdev-theme";
export const THEME_ATTRIBUTE = "data-theme";

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';

/** Browser chrome tint, matched to each theme's page background. */
const THEME_COLORS: Record<Theme, string> = {
  light: "#faf8f5",
  dark: "#131209",
};

/** The pre-paint script already resolved the theme, so the attribute is the truth. */
export function readPaintedTheme(): Theme {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "dark"
    ? "dark"
    : "light";
}

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export function systemThemeQuery(): MediaQueryList {
  return window.matchMedia(DARK_SCHEME_QUERY);
}

export function readPreference(): ThemePreference {
  return readStoredTheme() ?? "system";
}

export function resolveTheme(preference: ThemePreference): Theme {
  if (preference !== "system") return preference;
  return systemThemeQuery().matches ? "dark" : "light";
}

export function storePreference(preference: ThemePreference): void {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
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
