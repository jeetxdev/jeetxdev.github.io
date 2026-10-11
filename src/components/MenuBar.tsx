import { EMAIL, RESUME_URL } from "@/data/profile";
import { THEME_LABELS, type Theme } from "@/lib/theme";
import type { View } from "@/lib/view";
import { Clock } from "./Clock";

type MenuBarProps = {
  view: View;
  theme: Theme;
  onSwitchView: (next: View) => void;
  onToggleTheme: () => void;
};

export function MenuBar({ view, theme, onSwitchView, onToggleTheme }: MenuBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-surface">
      <nav
        aria-label="Menu"
        className="flex h-8 items-center gap-2 px-3 font-mono text-[12px] sm:gap-4 sm:px-5"
      >
        <span className="pr-1 font-bold">jeet</span>
        {/* Each view offers only the way out to the other one. */}
        {view === "terminal" ? (
          <button type="button" className="view-cta" onClick={() => onSwitchView("page")}>
            <span className="sm:hidden">Regular page →</span>
            <span className="hidden sm:inline">View as a regular page →</span>
          </button>
        ) : (
          <button type="button" className="view-cta" onClick={() => onSwitchView("terminal")}>
            ← Back to terminal
          </button>
        )}
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
        <a className="menu-item" href={RESUME_URL}>
          Résumé
        </a>
        <Clock />
      </nav>
    </header>
  );
}
