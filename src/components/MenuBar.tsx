import { EMAIL, RESUME_LINK_PROPS } from "@/data/profile";
import { PREFERENCE_LABELS, THEME_PREFERENCES, type ThemePreference } from "@/lib/theme";

type MenuBarProps = {
  preference: ThemePreference;
  onChangePreference: (next: ThemePreference) => void;
};

export function MenuBar({ preference, onChangePreference }: MenuBarProps) {
  return (
    // The header spans the viewport, so it lets clicks through to the page beside the menu.
    <header className="pointer-events-none sticky top-2 z-40 mt-2 px-4">
      <nav
        aria-label="Menu"
        className="pointer-events-auto mx-auto flex w-fit items-center gap-1 rounded-lg border border-rule bg-surface/80 p-1 font-mono text-sm backdrop-blur-md"
      >
        <span className="hidden px-2 font-bold sm:inline">jeet</span>
        <div role="group" aria-label="Theme" className="flex items-center gap-1">
          {THEME_PREFERENCES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={preference === option}
              onClick={() => onChangePreference(option)}
              className="menu-item theme-option rounded-sm"
            >
              {PREFERENCE_LABELS[option]}
            </button>
          ))}
        </div>
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-rule" />
        <a className="menu-item rounded-sm font-semibold" href={`mailto:${EMAIL}`}>
          Mail
        </a>
        <a className="menu-item rounded-sm font-semibold" {...RESUME_LINK_PROPS}>
          Résumé
        </a>
      </nav>
    </header>
  );
}
