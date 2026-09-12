export function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return (
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</p>}
      <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">{title}</h2>
      {copy && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{copy}</p>}
    </div>
  );
}
