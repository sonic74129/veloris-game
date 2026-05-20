interface StageHeaderProps {
  eyebrow: string;          // e.g. "SCENE · 00"
  title: string;
  subtitle?: string;
  brandLine?: string;       // English subtitle in gold
  compact?: boolean;
}

export function StageHeader({ eyebrow, title, subtitle, brandLine, compact = false }: StageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="eyebrow">{eyebrow}</div>
      <div className={`font-cn tracking-[0.08em] text-warm-1 leading-tight ${compact ? 'text-[16px]' : 'text-[44px]'}`}>
        {title}
      </div>
      {brandLine && (
        <div className={`font-brand tracking-[0.36em] text-gold-3 mt-1 ${compact ? 'text-[9px]' : 'text-[13px]'}`}>
          {brandLine}
        </div>
      )}
      {subtitle && !compact && (
        <div className="font-cns text-warm-2 mt-2 max-w-[920px] leading-relaxed text-[16px]">
          {subtitle}
        </div>
      )}
    </div>
  );
}
