import { useCallback, useState } from "react";
import { applyTheme, readPaintedTheme, storeTheme, type Theme } from "@/lib/theme";

type UseTheme = {
  theme: Theme;
  setTheme: (next: Theme) => void;
};

export function useTheme(): UseTheme {
  const [theme, setThemeState] = useState<Theme>(readPaintedTheme);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    storeTheme(next);
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}
