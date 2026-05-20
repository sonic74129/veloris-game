interface StoryBackgroundCardProps {
  summary: string;
  onReplayBrief: () => void;
}

export function StoryBackgroundCard({ summary, onReplayBrief, compact }: StoryBackgroundCardProps & { compact?: boolean }) {
  return (
    <div className={`glass frame-corners relative ${compact ? 'p-5 flex-1 flex flex-col min-h-[220px] border-2 border-gold-3/30' : 'p-6 min-h-[220px]'}`}>
      <span className="c-tl" /><span className="c-br" />

      <div className={`font-mono tracking-[0.32em] text-gold-3 uppercase ${compact ? 'text-[13px]' : 'text-[11px]'}`}>
        STORY BACKGROUND
      </div>

      <p className={`mt-3 font-cns text-warm-2 whitespace-pre-line ${compact ? 'text-[20px] leading-[1.7] flex-1' : 'text-[14px] leading-[1.75] mt-4'}`}>
        {summary}
      </p>

      <button
        onClick={onReplayBrief}
        className={`border border-gold-2 text-warm-2 hover:text-gold-4
                   hover:border-gold-3 transition-colors font-mono uppercase
                   ${compact ? 'mt-4 px-4 py-3 text-[13px] tracking-[0.28em] w-full' : 'mt-5 px-4 py-2.5 text-[10px] tracking-[0.26em]'}`}
      >
        View Brief / Replay Brief
      </button>
    </div>
  );
}
