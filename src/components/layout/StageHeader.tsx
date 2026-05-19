interface StageHeaderProps {
  eyebrow: string;          // e.g. "SCENE · 00"
  title: string;
  subtitle?: string;
  brandLine?: string;       // English subtitle in gold
}

export function StageHeader({ eyebrow, title, subtitle, brandLine }: StageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="eyebrow">{eyebrow}</div>
      <div className="font-cn text-[44px] tracking-[0.08em] text-warm-1 leading-tight">
        {title}
      </div>
      {brandLine && (
        <div className="font-brand text-[13px] tracking-[0.36em] text-gold-3 mt-2">
          {brandLine}
        </div>
      )}
      {subtitle && (
        <div className="font-cns text-[16px] text-warm-2 mt-2 max-w-[920px] leading-relaxed">
          {subtitle}
        </div>
      )}
    </div>
  );
}
