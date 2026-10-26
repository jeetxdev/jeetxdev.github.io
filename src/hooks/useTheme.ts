import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  readPaintedTheme,
  readPreference,
  resolveTheme,
  storePreference,
  systemThemeQuery,
  type Theme,
  type ThemePreference,
} from "@/lib/theme";

type UseTheme = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
};

export function useTheme(): UseTheme {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);
  const [theme, setThemeState] = useState<Theme>(readPaintedTheme);

  // On Auto, the page follows system changes live.
  useEffect(() => {
    if (preference !== "system") return;
    const query = systemThemeQuery();
    const onChange = () => {
      const next = resolveTheme("system");
      applyTheme(next);
      setThemeState(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    const resolved = resolveTheme(next);
    storePreference(next);
    applyTheme(resolved);
    setPreferenceState(next);
    setThemeState(resolved);
  }, []);

  return { theme, preference, setPreference };
}
