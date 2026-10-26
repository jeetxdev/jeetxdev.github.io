import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  readPaintedTheme,
  readStoredTheme,
  storeTheme,
  systemThemeQuery,
  type Theme,
} from "@/lib/theme";

type UseTheme = {
  theme: Theme;
  setTheme: (next: Theme) => void;
};

export function useTheme(): UseTheme {
  const [theme, setThemeState] = useState<Theme>(readPaintedTheme);

  // Until the visitor picks a theme, the page follows system changes live.
  useEffect(() => {
    const query = systemThemeQuery();
    const onChange = () => {
      if (readStoredTheme()) return;
      const next: Theme = query.matches ? "dark" : "light";
      applyTheme(next);
      setThemeState(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    storeTheme(next);
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}
