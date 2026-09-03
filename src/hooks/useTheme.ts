import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  DARK_SCHEME_QUERY,
  readStoredMode,
  resolveTheme,
  storeMode,
  THEME_ATTRIBUTE,
  type ResolvedTheme,
  type ThemeMode,
} from "@/lib/theme";

type UseTheme = {
  mode: ThemeMode;
  theme: ResolvedTheme;
  setMode: (next: ThemeMode) => void;
};

/**
 * Owns the theme choice. The document attribute is already stamped by the
 * pre-paint script in index.html, so this only has to keep it in step with
 * later changes: an explicit pick, or the OS flipping while on `system`.
 */
export function useTheme(): UseTheme {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [theme, setTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredMode()),
  );

  useEffect(() => {
    const next = resolveTheme(mode);
    setTheme(next);
    applyTheme(next);

    if (mode !== "system") return;

    const mql = window.matchMedia(DARK_SCHEME_QUERY);
    const onChange = () => {
      const resolved: ResolvedTheme = mql.matches ? "dark" : "light";
      setTheme(resolved);
      applyTheme(resolved);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    storeMode(next);
    setModeState(next);
  }, []);

  return { mode, theme, setMode };
}

/**
 * Read-only view of the painted theme for components that render colours in
 * JS rather than CSS. It watches the document attribute instead of taking a
 * second copy of the theme state, so there is only ever one source of truth.
 */
export function useResolvedTheme(): ResolvedTheme {
  const [theme, setTheme] = useState<ResolvedTheme>(
    () => resolveTheme(readStoredMode()),
  );

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.getAttribute(THEME_ATTRIBUTE) === "light" ? "light" : "dark");

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributeFilter: [THEME_ATTRIBUTE] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
