import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "playground", label: "Playground" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = SECTIONS.map((section) => section.id);

/** Roughly the header's height, so the rail takes over as the header leaves. */
const REVEAL_OFFSET_PX = 140;

const CONTACT_EMAIL = "mailto:jeetmukherjee100@gmail.com";

export function SideRail() {
  const activeId = useActiveSection(SECTION_IDS);
  const isVisible = useScrolledPast(REVEAL_OFFSET_PX);

  return (
    <nav
      aria-label="Sections"
      className={cn(
        "fixed top-1/2 right-[26px] z-10 hidden -translate-y-1/2 flex-col items-end gap-[2px] transition-opacity duration-500 rail:flex",
        !isVisible && "pointer-events-none invisible opacity-0",
      )}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = id === activeId;

        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={isActive ? "location" : undefined}
            className="group flex items-center gap-3 rounded-md py-[7px] pl-3"
          >
            <span
              className={cn(
                "font-mono text-[11px] tracking-[0.06em] transition-all duration-300",
                isActive
                  ? "text-text-muted"
                  : "translate-x-1 text-text-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
              )}
            >
              {label}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "h-[7px] w-[7px] rounded-full transition-all duration-300",
                isActive
                  ? "scale-125 bg-accent shadow-[0_0_12px_rgba(122,214,238,0.85)]"
                  : "bg-white/25 group-hover:bg-white/60",
              )}
            />
          </a>
        );
      })}

      <span aria-hidden="true" className="my-[10px] mr-[3px] h-8 w-px bg-white/[0.12]" />

      <a
        href={CONTACT_EMAIL}
        aria-label="Get in touch"
        className="btn-gradient-accent mr-[-4px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[15px] w-[15px]"
        >
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      </a>
    </nav>
  );
}
