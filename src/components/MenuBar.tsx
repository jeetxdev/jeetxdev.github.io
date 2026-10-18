import { EMAIL, RESUME_LINK_PROPS } from "@/data/profile";
import { THEME_LABELS, type Theme } from "@/lib/theme";
import { Clock } from "./Clock";

type MenuBarProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function MenuBar({ theme, onToggleTheme }: MenuBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-surface">
      <nav
        aria-label="Menu"
        className="flex h-8 items-center gap-2 px-3 font-mono text-[12px] sm:gap-4 sm:px-5"
      >
        <span className="pr-1 font-bold">jeet</span>
        <button
          type="button"
          className="menu-item"
          aria-pressed={theme === "dark"}
          onClick={onToggleTheme}
        >
          <span className="hidden text-muted sm:inline">Theme: </span>
          <span className="capitalize">{THEME_LABELS[theme]}</span>
        </button>
        <a className="menu-item" href={`mailto:${EMAIL}`}>
          Mail
        </a>
        <a className="menu-item" {...RESUME_LINK_PROPS}>
          Résumé
        </a>
        <Clock />
      </nav>
    </header>
  );
}
