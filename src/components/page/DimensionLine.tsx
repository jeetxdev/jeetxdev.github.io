import { cn } from "@/lib/utils";

type DimensionLineProps = {
  label: string;
  className?: string;
};

/** A drafting dimension: end ticks, arrowheads and the measurement in the middle. */
export function DimensionLine({ label, className }: DimensionLineProps) {
  return (
    <div className={cn("flex items-center font-mono text-xs", className)}>
      <span aria-hidden="true" className="h-[22px] w-0.5 bg-ink" />
      <ArrowHead pointsLeft />
      <span aria-hidden="true" className="h-0.5 flex-1 bg-ink" />
      <span className="px-3 text-accent uppercase">{label}</span>
      <span aria-hidden="true" className="h-0.5 flex-1 bg-ink" />
      <ArrowHead />
      <span aria-hidden="true" className="h-[22px] w-0.5 bg-ink" />
    </div>
  );
}

function ArrowHead({ pointsLeft = false }: { pointsLeft?: boolean }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="shrink-0 text-ink">
      <path
        d={pointsLeft ? "M13 2 L2 7 L13 12" : "M1 2 L12 7 L1 12"}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
