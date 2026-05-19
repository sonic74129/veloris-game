import { useGameState } from '../../hooks/useGameState';
import { packs } from '../../data';
import { RunStatusBarHUD } from './RunStatusBarHUD';

export function TopStatusBar() {
  const language = useGameState((s) => s.language);
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

      {/* HUD — Run status bar replaces old stat display when player exists */}
      <div className="w-[360px] flex items-center justify-end pointer-events-auto">
        <RunStatusBarHUD />
      </div>
    </header>
  );
}
