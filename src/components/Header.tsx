import { cn } from "@/lib/utils";

const NAV_LINK_CLASS =
  "inline-flex items-center rounded-[10px] px-[14px] py-[9px] text-text-muted transition-colors duration-200 hover:bg-white/[0.07] hover:text-ink max-[721px]:min-h-11 max-[721px]:px-[10px] max-[721px]:py-[8px] max-[721px]:text-[13px]";

export function Header() {
  return (
    <header
      className={cn(
        "glass-header sticky top-[14px] z-10 mt-[18px] flex flex-wrap items-center justify-between gap-[18px] rounded-2xl py-3 pr-3 pl-[18px]",
        "max-[721px]:top-2 max-[721px]:py-[10px] max-[721px]:pr-[10px] max-[721px]:pl-[14px]",
      )}
    >
      <div className="flex items-center gap-[11px] font-display text-[15px] font-medium tracking-[-0.01em]">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-success shadow-[0_0_12px_rgba(87,227,155,0.9)]"
        />
        Jeet Mukherjee
        <span className="font-normal text-text-dimmer">/ full-stack</span>
      </div>

      <nav
        className="flex items-center gap-2 text-[14px] max-[721px]:gap-1"
        aria-label="Primary"
      >
        <a href="#playground" className={NAV_LINK_CLASS}>
          Playground
        </a>
        <a href="#work" className={NAV_LINK_CLASS}>
          Work
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={NAV_LINK_CLASS}
        >
          Resume
        </a>
        <a
          href="mailto:jeetmukherjee100@gmail.com"
          className="btn-gradient-accent inline-flex items-center rounded-[10px] px-4 py-[10px] font-semibold max-[721px]:min-h-11"
        >
          Get in touch
        </a>
      </nav>
    </header>
  );
}
