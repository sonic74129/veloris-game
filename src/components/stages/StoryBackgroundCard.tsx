interface StoryBackgroundCardProps {
  summary: string;
  onReplayBrief: () => void;
}

export function StoryBackgroundCard({ summary, onReplayBrief }: StoryBackgroundCardProps) {
  return (
    <div className="glass p-6 frame-corners relative min-h-[220px]">
      <span className="c-tl" /><span className="c-br" />

      <div className="font-mono text-[11px] tracking-[0.32em] text-gold-3 uppercase">
        STORY BACKGROUND
      </div>

      <p className="mt-4 font-cns text-[14px] text-warm-2 leading-[1.75] whitespace-pre-line">
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
