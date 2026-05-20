interface StoryBackgroundCardProps {
  summary: string;
  onReplayBrief: () => void;
}

export function StoryBackgroundCard({ summary, onReplayBrief }: StoryBackgroundCardProps & { compact?: boolean }) {
  return (
    <div className="glass frame-corners relative p-6 min-h-[220px]">
      <span className="c-tl" /><span className="c-br" />

      <div className="font-mono tracking-[0.28em] text-gold-3 uppercase text-[11px]">
        STORY BACKGROUND
      </div>

      <p className="mt-4 font-cns text-warm-2 whitespace-pre-line text-[14px] leading-[1.75]">
        {summary}
      </p>

      <button
        onClick={onReplayBrief}
        className="mt-5 px-4 py-2.5 border border-gold-2 text-warm-2 hover:text-gold-4
                   hover:border-gold-3 transition-colors font-mono text-[10px]
                   tracking-[0.26em] uppercase"
      >
        View Brief / Replay Brief
      </button>
    </div>
  );
}
