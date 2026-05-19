import { useEffect, useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { loadLeaderboard, type LeaderboardEntry } from '../../lib/leaderboard';

export function LeaderboardScreen() {
  const restartRun = useGameState((s) => s.restartRun);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard().then(setBoard);
  }, []);

  const top3 = board.slice(0, 3);
  const allRows = board;

  return (
    <div className="absolute inset-0 overflow-y-auto p-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 max-w-[1400px] mx-auto">
        <div>
          <div className="eyebrow">MIRANDA'S BOARD · 董事会榜单</div>
          <div className="font-brand text-[38px] tracking-[0.14em] text-warm-1 mt-2 leading-tight">
            Frontier Firm Ranking
          </div>
          <div className="font-cn text-[14px] text-warm-2 italic mt-1">
            The board remembers every mistake.
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[9px] tracking-[0.28em] text-warm-3">SEASON · FW26</div>
          <div className="font-brand text-[16px] text-gold-4 tracking-[0.14em] mt-1">
            {board.length} CHALLENGERS
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-5 max-w-[1400px] mx-auto mb-6 items-end">
          <PodiumCard entry={top3[1]} place={2} color="#d8d4c8" />
          <PodiumCard entry={top3[0]} place={1} color="var(--tw-gold-5, #f6e6bf)" tall />
          <PodiumCard entry={top3[2]} place={3} color="#c79968" />
        </div>
      )}

      {/* Full table */}
      <div className="glass frame-corners relative max-w-[1400px] mx-auto overflow-hidden">
        <span className="c-tl" /><span className="c-br" />
        {/* Header row */}
        <div className="grid grid-cols-[60px_1.4fr_1fr_0.8fr_0.6fr_0.5fr_0.5fr] gap-3 px-5 py-3 border-b border-gold-1">
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">RANK</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">NAME</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">COMPANY</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">SCORE</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">TIME</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">W</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">H</span>
        </div>
        {/* Rows */}
        {allRows.map((entry) => {
          const isYou = entry.isYou;
          const mm = String(Math.floor(entry.totalTime / 60)).padStart(2, '0');
          const ss = String(entry.totalTime % 60).padStart(2, '0');
          return (
            <div
              key={`${entry.playerName}-${entry.timestamp}`}
              className={`grid grid-cols-[60px_1.4fr_1fr_0.8fr_0.6fr_0.5fr_0.5fr] gap-3 px-5 py-2.5 border-b border-gold-1/30
                ${isYou ? 'bg-[#6ec8d8]/10 border-l-2 !border-l-[#6ec8d8]' : ''}`}
            >
              <span className={`font-brand text-[18px] ${
                entry.rank === 1 ? 'text-gold-5' :
                entry.rank === 2 ? 'text-[#d8d4c8]' :
                entry.rank === 3 ? 'text-[#c79968]' :
                isYou ? 'text-[#6ec8d8]' : 'text-warm-2'
              }`}>#{entry.rank}</span>
              <span className="font-brand text-[13px] tracking-[0.1em] text-warm-1 flex items-center gap-2">
                {entry.playerName.toUpperCase()}
                {isYou && (
                  <span className="font-mono text-[8px] tracking-[0.28em] text-[#6ec8d8] border border-[#6ec8d8]/50 px-1.5 py-0.5">YOU</span>
                )}
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-warm-2 self-center">{entry.company.toUpperCase()}</span>
              <span className={`font-brand text-[16px] self-center ${
                entry.rank === 1 ? 'text-gold-5' : isYou ? 'text-[#6ec8d8]' : 'text-warm-1'
              }`}>{entry.totalScore.toLocaleString()}</span>
              <span className="font-mono text-[11px] text-warm-2 self-center">{mm}:{ss}</span>
              <span className={`font-mono text-[11px] self-center ${entry.totalWrongAttempts > 0 ? 'text-[#e85d5d]' : 'text-warm-2'}`}>{entry.totalWrongAttempts}</span>
              <span className={`font-mono text-[11px] self-center ${entry.totalHintsUsed > 0 ? 'text-[#6ec8d8]' : 'text-warm-2'}`}>{entry.totalHintsUsed}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 max-w-[1400px] mx-auto">
        <div className="font-cn text-[11px] text-warm-3 italic">
          分数相同时，<span className="text-gold-4">用时短者排名靠前</span>。
        </div>
        <button
          onClick={restartRun}
          className="px-6 py-2.5 border border-gold-2 hover:border-gold-3
                     text-gold-4 font-cns tracking-[0.2em] text-[12px]
                     transition-colors bg-ink-0/60"
        >
          Restart Challenge ↻
        </button>
      </div>
    </div>
  );
}

function PodiumCard({ entry, place, color, tall }: {
  entry: LeaderboardEntry; place: number; color: string; tall?: boolean;
}) {
  const mm = String(Math.floor(entry.totalTime / 60)).padStart(2, '0');
  const ss = String(entry.totalTime % 60).padStart(2, '0');
  return (
    <div className={`glass frame-corners relative p-5 ${tall ? 'min-h-[280px]' : 'min-h-[220px]'}
      ${place === 1 ? 'bg-gradient-to-b from-gold-1/15 to-ink-0/90 border-gold-3' : ''}`}
      style={place === 1 ? { boxShadow: '0 0 40px rgba(201,165,90,0.15)' } : undefined}
    >
      <span className="c-tl" /><span className="c-br" />
      <div className="flex justify-between items-start">
        <span className="font-brand text-[40px] leading-none" style={{ color }}>#{place}</span>
      </div>
      <div className="font-brand text-[18px] tracking-[0.12em] mt-4 leading-tight" style={{ color: place === 1 ? color : 'var(--tw-warm-1, #f0ede6)' }}>
        {entry.playerName.toUpperCase()}
      </div>
      <div className="font-cn text-[11px] text-warm-3 tracking-[0.14em] mt-1">
        {entry.company.toUpperCase()}
      </div>
      <div className="h-px bg-gold-1 my-3" />
      <div className="flex justify-between items-baseline">
        <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">SCORE</span>
        <span className="font-brand text-[26px]" style={{ color }}>{entry.totalScore.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[9px] tracking-[0.14em] text-warm-3">
        <div>TIME<br /><span className="text-warm-1">{mm}:{ss}</span></div>
        <div>W<br /><span className="text-warm-1">{entry.totalWrongAttempts}</span></div>
        <div>H<br /><span className="text-warm-1">{entry.totalHintsUsed}</span></div>
      </div>
    </div>
  );
}
