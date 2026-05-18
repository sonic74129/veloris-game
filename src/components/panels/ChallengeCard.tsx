interface ChallengeCardProps {
  title: string;
  body: string;
  speaker?: string;
  quote?: string;
}

export function ChallengeCard({ title, body, speaker, quote }: ChallengeCardProps) {
  return (
    <div className="glass frame-corners p-6 relative">
      <span className="c-tl" /><span className="c-br" />
      <div className="eyebrow mb-2">{title}</div>
      <div className="font-cn text-[16px] leading-[1.7] text-warm-1">
        {body}
      </div>
      {quote && (
        <div className="mt-5 pt-5 border-t border-gold-1">
          <div className="font-cn italic text-[15px] text-gold-4 leading-[1.6]">
            "{quote}"
          </div>
        </div>
      )}
      {speaker && (
        <div className="mt-4 text-right font-mono text-[10px] tracking-[0.32em] text-warm-3">
          — {speaker}
        </div>
      )}
    </div>
  );
}
