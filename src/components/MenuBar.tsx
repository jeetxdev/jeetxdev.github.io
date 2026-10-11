import { EMAIL, RESUME_URL } from "@/data/profile";
import { THEME_LABELS, type Theme } from "@/lib/theme";
import type { View } from "@/lib/view";
import { cn } from "@/lib/utils";
import { Clock } from "./Clock";

/** `target` is the view the label switches to. */
const VIEW_LABELS: { target: View; short: string; long: string }[] = [
  { target: "page", short: "Regular page →", long: "View as a regular page →" },
  { target: "terminal", short: "← Back to terminal", long: "← Back to terminal" },
];

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
        {/* Each view offers only the way out to the other one. Both labels share
            one grid cell, so the button keeps the wider label's width and the
            items after it never shift under a quick second click. */}
        <button
          type="button"
          className="view-cta grid text-center"
          onClick={() => onSwitchView(view === "terminal" ? "page" : "terminal")}
        >
          {VIEW_LABELS.map((label) => (
            <span
              key={label.target}
              aria-hidden={label.target === view}
              className={cn("col-start-1 row-start-1", label.target === view && "invisible")}
            >
              <span className="sm:hidden">{label.short}</span>
              <span className="hidden sm:inline">{label.long}</span>
            </span>
          ))}
        </button>
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
