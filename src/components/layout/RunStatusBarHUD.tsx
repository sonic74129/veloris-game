import { useEffect, useState } from 'react';
import { useGameState } from '../../hooks/useGameState';

export function RunStatusBarHUD() {
  const player = useGameState((s) => s.player);
  const currentRun = useGameState((s) => s.currentRun);
  const stageScores = useGameState((s) => s.stageScores);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!currentRun) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.round((Date.now() - currentRun.startTime) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentRun]);

  if (!player) return null;

  const runningScore = stageScores.reduce((s, r) => s + r.score, 0);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-0.5">
      <Seg label="PLAYER" value={player.name.split(' ')[0].toUpperCase()} gold />
      <Seg label="COMPANY" value={player.company.toUpperCase()} />
      {currentRun && (
        <>
          <Seg label="TIME" value={`${mm}:${ss}`} gold />
          <Seg label="SCORE" value={String(runningScore)} accent />
          <Seg label="W" value={String(currentRun.wrongAttempts)} danger={currentRun.wrongAttempts > 0} />
          <Seg label="H" value={String(currentRun.hintsUsed)} hint={currentRun.hintsUsed > 0} />
        </>
      )}
    </div>
  );
}

function Seg({ label, value, gold, accent, danger, hint }: {
  label: string; value: string;
  gold?: boolean; accent?: boolean; danger?: boolean; hint?: boolean;
}) {
  let valColor = 'text-warm-1';
  if (gold) valColor = 'text-gold-4';
  if (accent) valColor = 'text-gold-5';
  if (danger) valColor = 'text-[#e85d5d]';
  if (hint) valColor = 'text-[#6ec8d8]';

  return (
    <div className="flex flex-col items-center px-2.5 py-1 min-w-[48px]">
      <span className="font-mono text-[8px] tracking-[0.28em] text-warm-3 leading-none">{label}</span>
      <span className={`font-brand text-[13px] tracking-[0.12em] leading-tight mt-0.5 ${valColor}`}>
        {value}
      </span>
    </div>
  );
}
