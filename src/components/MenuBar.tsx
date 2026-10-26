import { EMAIL, RESUME_LINK_PROPS } from "@/data/profile";
import { THEME_LABELS, type Theme } from "@/lib/theme";

type MenuBarProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function MenuBar({ theme, onToggleTheme }: MenuBarProps) {
  return (
    // The header spans the viewport, so it lets clicks through to the page beside the menu.
    <header className="pointer-events-none sticky top-2 z-40 mt-2 px-4">
      <nav
        aria-label="Menu"
        className="pointer-events-auto mx-auto flex w-fit items-center gap-1 rounded-lg border border-rule bg-surface/80 p-1 font-mono text-sm backdrop-blur-md"
      >
        <span className="px-2 font-bold">jeet</span>
        <button
          type="button"
          className="menu-item rounded-sm font-semibold"
          aria-pressed={theme === "dark"}
          onClick={onToggleTheme}
        >
          <span className="hidden font-normal text-muted sm:inline">Theme: </span>
          <span className="capitalize">{THEME_LABELS[theme]}</span>
        </button>
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
