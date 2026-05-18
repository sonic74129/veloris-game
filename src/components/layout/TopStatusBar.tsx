import { useGameState } from '../../hooks/useGameState';
import { packs } from '../../data';

export function TopStatusBar() {
  const language = useGameState((s) => s.language);
  const score = useGameState((s) => s.score);
  const energy = useGameState((s) => s.energy);
  const completed = useGameState((s) => s.completedStages.length);
  const ui = packs[language].ui;

  return (
    <header className="absolute top-0 left-0 right-0 h-[72px] flex items-center px-9 z-30
                       bg-gradient-to-b from-ink-0/95 via-ink-0/70 to-transparent
                       border-b border-gold-1 pointer-events-none">
      {/* Brand */}
      <div className="w-[300px] pointer-events-auto">
        <div className="font-brand text-[14px] tracking-[0.32em] text-gold-4">
          {ui.brand}
        </div>
        <div className="font-mono text-[9px] tracking-[0.28em] text-warm-3 mt-1">
          {ui.brandSub}
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center">
        <div className="font-cn text-[18px] tracking-[0.18em] text-warm-1">
          {ui.trialTitle}
          <span className="ml-3 font-brand text-[10px] tracking-[0.4em] text-warm-3">
            {ui.trialTitleEn}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 px-3 py-0.5 rounded-full
                        border border-gold-2 bg-ink-2/60">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-4 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.28em] text-warm-2">
            {ui.stagePillPrefix} {Math.min(completed + 1, 5)} / 5
          </span>
        </div>
      </div>

      {/* HUD */}
      <div className="w-[300px] flex items-center justify-end gap-5 text-warm-2">
        <Stat label={ui.hud.level} value={String(Math.floor(score / 100)).padStart(2, '0')} icon={<CrownIcon />} />
        <Stat label="" value={String(score).padStart(3, '0')} icon={<DiamondIcon />} />
        <Stat label="" value={`${energy}/100`} icon={<BoltIcon />} />
        <div className="w-9 h-9 rounded-full border border-gold-3 bg-ink-2 flex items-center justify-center
                        font-brand text-[10px] text-gold-4">M·V</div>
      </div>
    </header>
  );
}

function Stat({ label, value, icon }: { label?: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] text-warm-2">
      <span className="text-gold-3">{icon}</span>
      {label && <span className="text-warm-3">{label}</span>}
      <span className="text-warm-1">{value}</span>
    </div>
  );
}

const CrownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M3 9l4 3 5-6 5 6 4-3v9H3z" />
  </svg>
);
const DiamondIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M6 9l6-5 6 5-6 11z" />
  </svg>
);
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
  </svg>
);
