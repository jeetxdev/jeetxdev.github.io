type FigureLabelProps = {
  figure: number;
  title: string;
  id?: string;
  as?: "h2" | "p";
};

/** The small "FIG. n · TITLE" caption a drawing puts above each view. */
export function FigureLabel({ figure, title, id, as: Tag = "p" }: FigureLabelProps) {
  return (
    <Tag id={id} className="font-mono text-xs font-normal text-muted uppercase">
      Fig. {figure} · {title}
    </Tag>
  );
}
