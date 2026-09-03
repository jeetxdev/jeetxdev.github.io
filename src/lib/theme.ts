export const THEME_MODES = ["light", "system", "dark"] as const;

/** What the visitor picked. `system` follows the OS preference live. */
export type ThemeMode = (typeof THEME_MODES)[number];

/** What actually gets painted, after `system` is resolved. */
export type ResolvedTheme = "light" | "dark";

/** Kept in sync with the pre-paint script in index.html. */
export const THEME_STORAGE_KEY = "jeetxdev-theme";
export const THEME_ATTRIBUTE = "data-theme";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';

/** Browser chrome tint, matched to each theme's page background. */
const THEME_COLORS: Record<ResolvedTheme, string> = {
  dark: "#060912",
  light: "#f4f7fc",
};

export function isThemeMode(value: unknown): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}

export function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function storeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Private browsing or blocked storage: the choice just will not persist.
  }
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_SCHEME_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode;
}

export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  document
    .querySelector(THEME_COLOR_META_SELECTOR)
    ?.setAttribute("content", THEME_COLORS[theme]);
}
