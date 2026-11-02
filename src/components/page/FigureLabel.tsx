import { cn } from "@/lib/utils";

type FigureLabelProps = {
  figure: number;
  title: string;
  id?: string;
  as?: "h2" | "p";
  className?: string;
};

/** The small "FIG. n · TITLE" caption a drawing puts above each view. */
export function FigureLabel({ figure, title, id, as: Tag = "p", className }: FigureLabelProps) {
  return (
    <Tag id={id} className={cn("font-mono text-xs font-normal text-muted uppercase", className)}>
      Fig. {figure} · {title}
    </Tag>
  );
}
