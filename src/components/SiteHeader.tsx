import { RESUME_LINK_PROPS } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { NavLink } from "@/lib/sections";

const DRAWING_NUMBER_PREFIX = "DWG JM";

type SiteHeaderProps = {
  /** Follows the drawing number, e.g. "Portfolio". */
  title: string;
  links: readonly NavLink[];
  /** Every section on the page in order. Pass a constant: a new array restarts the scroll listener. */
  sectionIds: readonly string[];
};

export function SiteHeader({ title, links, sectionIds }: SiteHeaderProps) {
  const active = useActiveSection(sectionIds);

  return (
    // Bleeds over the sheet's side padding so the sticky bar covers the grid edge to edge.
    // On phones the résumé button shares the first row with the drawing number and the
    // links take the second row. From lg up everything sits on one row.
    <header className="intro-header sticky top-0 z-40 -mx-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-rule bg-paper px-6 py-4 font-mono text-xs uppercase sm:-mx-12 sm:px-12">
      <a href="#main" className="nav-link">
        {DRAWING_NUMBER_PREFIX}-{new Date().getFullYear()}
        {/* Dropped on phones so the résumé button fits beside the drawing number. */}
        <span className="hidden sm:inline"> · {title}</span>
      </a>
      <nav aria-label="Main" className="order-last w-full lg:order-none lg:ml-auto lg:w-auto">
        <ul className="flex flex-wrap gap-6">
          {links.map(({ label, href, sectionId, isCurrentPage }) => (
            <li key={href}>
              <a href={href} className="nav-link" aria-current={currentState(isCurrentPage, sectionId, active)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* On the single-row layout, -my-2 cancels the button's own padding so the header keeps its height. */}
      <a
        {...RESUME_LINK_PROPS}
        className="ml-auto inline-flex items-center gap-2 border-[1.5px] border-accent px-3 py-2 text-accent transition-colors duration-300 ease-base hover:bg-accent hover:text-paper lg:-my-2 lg:ml-0"
      >
        <DownloadIcon />
        Résumé
        <span className="sr-only"> (PDF download)</span>
      </a>
    </header>
  );
}

function currentState(
  isCurrentPage: boolean | undefined,
  sectionId: string | undefined,
  active: string | null,
): "page" | "location" | undefined {
  if (isCurrentPage) return "page";
  if (sectionId && sectionId === active) return "location";
  return undefined;
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className="shrink-0"
    >
      <path d="M7 1 V9" />
      <path d="M3.5 5.5 L7 9 L10.5 5.5" />
      <path d="M1.5 12.5 H12.5" />
    </svg>
  );
}
