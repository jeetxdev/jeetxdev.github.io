import type { ReactNode } from "react";
import { SheetBorder } from "@/components/SheetBorder";

type SheetProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

/** One drawing sheet: the border, the sticky header, the page content and the title block. */
export function Sheet({ header, footer, children }: SheetProps) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="p-4 sm:p-6">
        {/* The drawing border: everything on the page sits inside one sheet. */}
        <div className="relative mx-auto max-w-sheet border-2 border-transparent px-6 sm:px-12">
          <SheetBorder />
          {header}
          <main id="main">{children}</main>
          {footer}
        </div>
      </div>
    </>
  );
}
