import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** "out" for a link that leaves the site, "next" for one to another sheet. */
  arrow: "out" | "next";
  /** Filled in the accent colour instead of outlined. */
  solid?: boolean;
};

/** A link drawn as the header's résumé button: mono caps in an accent outline. */
export function ArrowLink({ arrow, solid = false, className, children, ...anchor }: ArrowLinkProps) {
  const opensNewTab = anchor.target === "_blank";
  return (
    <a
      {...anchor}
      className={cn(
        "inline-flex items-center gap-2 border-[1.5px] border-accent px-3 py-2 font-mono text-xs uppercase transition-colors duration-300 ease-base",
        solid
          ? "bg-accent text-paper hover:bg-transparent hover:text-accent"
          : "text-accent hover:bg-accent hover:text-paper",
        className,
      )}
    >
      {children}
      {opensNewTab && <span className="sr-only"> (opens in a new tab)</span>}
      {arrow === "out" ? <OutIcon /> : <NextIcon />}
    </a>
  );
}

function OutIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="shrink-0">
      <path d="M2 10 L10 2" />
      <path d="M4 2 H10 V8" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg aria-hidden="true" width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="shrink-0">
      <path d="M1 5 H14" />
      <path d="M10 1 L14 5 L10 9" />
    </svg>
  );
}
