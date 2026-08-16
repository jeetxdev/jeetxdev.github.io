import type { ReactNode } from "react";

export function SectionLabel({
  children,
  meta,
}: {
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div data-reveal className="flex items-baseline gap-[14px]">
      <h2 className="m-0 font-mono text-[12.5px] font-normal tracking-[0.16em] text-text-dimmer uppercase">
        {children}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-white/[0.09]" />
      {meta ? (
        <span className="font-mono text-[12px] text-text-faintest">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
