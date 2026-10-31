import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_IDS, NAV_ITEMS } from "@/lib/sections";

const DRAWING_NUMBER_PREFIX = "DWG JM";

export function SiteHeader() {
  const active = useActiveSection(NAV_IDS);

  return (
    // Bleeds over the sheet's side padding so the sticky bar covers the grid edge to edge.
    <header className="sticky top-0 z-40 -mx-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule bg-paper px-5 py-5 font-mono text-[0.8125rem] uppercase sm:-mx-10 sm:px-10">
      <a href="#main" className="nav-link">
        {DRAWING_NUMBER_PREFIX}-{new Date().getFullYear()} · Portfolio
      </a>
      <nav aria-label="Sections">
        <ul className="flex flex-wrap gap-6">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="nav-link"
                aria-current={active === id ? "location" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
