import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { THEME_MODES, type ThemeMode } from "@/lib/theme";

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-[15px] w-[15px] shrink-0",
} as const;

const SunIcon = () => (
  <svg {...ICON_PROPS} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const SystemIcon = () => (
  <svg {...ICON_PROPS} aria-hidden="true">
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </svg>
);

const MoonIcon = () => (
  <svg {...ICON_PROPS} aria-hidden="true">
    <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5a8.5 8.5 0 1 0 10.9 10.9Z" />
  </svg>
);

const CheckIcon = () => (
  <svg {...ICON_PROPS} aria-hidden="true" className="ml-auto h-[13px] w-[13px]">
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

const MODE_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  system: "System",
  dark: "Dark",
};

const MODE_ICONS: Record<ThemeMode, () => ReactNode> = {
  light: SunIcon,
  system: SystemIcon,
  dark: MoonIcon,
};

/**
 * An icon that reads as one more nav item, opening a named menu. A bare
 * cycling icon would be smaller still, but `system` is undiscoverable when
 * the only way to find it is to keep clicking.
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  // Opening moves focus onto the current mode, so the menu is immediately
  // walkable with the arrow keys.
  useEffect(() => {
    if (isOpen) itemRefs.current[THEME_MODES.indexOf(mode)]?.focus();
  }, [isOpen, mode]);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    items[(current + step + items.length) % items.length]?.focus();
  };

  const TriggerIcon = MODE_ICONS[mode];

  return (
    <div
      ref={rootRef}
      // The nav row has no spare width on phones, but the brand row's right
      // half is empty, so the control is lifted out of flow into it.
      className={cn(
        "relative shrink-0",
        "max-[721px]:absolute max-[721px]:top-[13px] max-[721px]:right-[12px]",
      )}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Theme: ${MODE_LABELS[mode]}`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex cursor-pointer items-center rounded-[10px] px-[10px] py-[9px] transition-colors duration-200",
          "hover:bg-surface-hover hover:text-ink",
          isOpen ? "bg-surface-hover text-ink" : "text-text-muted",
          "max-[721px]:px-2 max-[721px]:py-2",
        )}
      >
        <TriggerIcon />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Colour theme"
          onKeyDown={onMenuKeyDown}
          className="menu-surface absolute top-[calc(100%+8px)] right-0 z-20 min-w-[152px] rounded-xl p-[5px]"
        >
          {THEME_MODES.map((option, index) => {
            const Icon = MODE_ICONS[option];
            const isActive = option === mode;

            return (
              <button
                key={option}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setMode(option);
                  close();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-[10px] rounded-lg px-[10px] py-[7px] text-left text-[13px] transition-colors duration-200",
                  "hover:bg-surface-hover hover:text-ink",
                  isActive ? "text-ink" : "text-text-muted",
                )}
              >
                <Icon />
                {MODE_LABELS[option]}
                {isActive ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
