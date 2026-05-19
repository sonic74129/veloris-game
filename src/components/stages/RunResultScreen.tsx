import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { getVerdict, type Verdict } from '../../lib/scoring';
import { saveLeaderboardEntry } from '../../lib/leaderboard';

const VERDICT_COPY: Record<Verdict, { en: string; zh: string }> = {
  HIGH: {
    en: '"Impressive. You made fast decisions without losing control."',
    zh: '出色 — 你做出了快速而精准的判断。',
  },
  MID: {
    en: '"Acceptable. But speed means nothing without better judgment."',
    zh: '可接受 — 但没有判断力的速度毫无意义。',
  },
  LOW: {
    en: '"You survived. Barely. Learn the architecture before the next board meeting."',
    zh: '你活下来了 — 勉强。在下一次董事会前补齐功课。',
  },
};

export function RunResultScreen() {
  const player = useGameState((s) => s.player);
  const runResult = useGameState((s) => s.runResult);
  const goToStage = useGameState((s) => s.goToStage);
  const restartRun = useGameState((s) => s.restartRun);

  const [rank, setRank] = useState<number | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (!runResult || !player) return;
    saveLeaderboardEntry({
      playerName: player.name,
      company: player.company,
      totalScore: runResult.totalScore,
      totalTime: runResult.totalTime,
      totalWrongAttempts: runResult.totalWrongAttempts,
      totalHintsUsed: runResult.totalHintsUsed,
    }).then((board) => {
      const you = board.find((e) => e.isYou);
      setRank(you?.rank ?? board.length);
      setTotalEntries(board.length);
    });
  }, [runResult, player]);

  if (!runResult || !player) return null;

  const verdict = getVerdict(runResult.totalScore);
  const copy = VERDICT_COPY[verdict];
  const perfectCount = runResult.stages.filter((s) => s.isPerfect).length;
  const totalMm = String(Math.floor(runResult.totalTime / 60)).padStart(2, '0');
  const totalSs = String(runResult.totalTime % 60).padStart(2, '0');

  return (
    <div className="absolute inset-0 overflow-y-auto p-10">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="eyebrow">FINAL REVIEW · 董事会终评</div>
        <div className="font-brand text-[42px] tracking-[0.14em] text-gold-4 mt-3 leading-tight">
          Frontier Firm Challenge Completed
        </div>
        <div className="font-cn text-[16px] text-warm-2 mt-2 italic">
          五关已结 · Miranda 对你的判断作出最终评价
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-6 max-w-[1400px] mx-auto">
        {/* Score card */}
        <div className="glass frame-corners relative p-6">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-3">PLAYER CARD · 个人成绩</div>
          <div className="h-px bg-gold-1 mb-4" />
          <div className="flex flex-col gap-3">
            <Row label="NAME" value={player.name.toUpperCase()} />
            <Row label="COMPANY" value={player.company.toUpperCase()} />
            <Row label="TOTAL TIME" value={`${totalMm}:${totalSs}`} />
            <Row label="WRONG" value={String(runResult.totalWrongAttempts)} danger />
            <Row label="HINTS" value={String(runResult.totalHintsUsed)} hint />
          </div>
          <div className="h-px bg-gold-1 my-4" />
          <div className="font-mono text-[9px] tracking-[0.28em] text-gold-3">TOTAL SCORE · 总分</div>
          <div className="font-brand text-[52px] text-gold-4 mt-1 leading-none tracking-[0.02em]">
            {runResult.totalScore.toLocaleString()}
          </div>
          <div className="font-cn text-[10px] text-warm-3 mt-1 tracking-[0.14em]">
            Across 5 stages · 五关合计
          </div>
        </div>

        {/* Big rank */}
        <div className="glass frame-corners relative p-6 flex flex-col items-center justify-center
                        bg-gradient-to-b from-gold-1/10 to-ink-0/90">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow text-gold-4">YOUR RANK · 你的排名</div>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', damping: 14 }}
            className="font-brand text-[180px] leading-none text-gold-5 mt-2"
            style={{ textShadow: '0 0 60px rgba(246,230,191,0.4)' }}
          >
            #{rank ?? '—'}
          </motion.div>
          <div className="font-cn text-[12px] text-warm-2 tracking-[0.16em] mt-4">
            OUT OF · 共 {totalEntries} 位挑战者
          </div>
          <div className="font-mono text-[9px] tracking-[0.28em] text-warm-3 mt-3">
            {perfectCount} OF 5 STAGES · PERFECT
          </div>
        </div>

        {/* Miranda verdict */}
        <div className="glass frame-corners relative p-6 flex flex-col">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-2">CHAIRWOMAN'S VERDICT</div>
          <div className="font-brand text-[22px] tracking-[0.16em] text-gold-4">MIRANDA</div>
          <div className="font-mono text-[9px] tracking-[0.28em] text-warm-3 mt-1">
            VERDICT · {verdict}
          </div>
          {/* Verdict tags */}
          <div className="flex gap-2 mt-3">
            {(['HIGH', 'MID', 'LOW'] as Verdict[]).map((v) => (
              <span key={v} className={`font-mono text-[9px] px-2 py-1 border tracking-[0.18em] ${
                v === verdict
                  ? 'border-gold-3 text-gold-4 bg-gold-1/20'
                  : 'border-gold-1 text-warm-3'
              }`}>{v}</span>
            ))}
          </div>
          <div className="h-px bg-gold-1 my-4" />
          <div className="font-cn text-[18px] text-warm-1 italic leading-relaxed flex-1">
            {copy.en}
          </div>
          <div className="font-cn text-[12px] text-warm-3 mt-3 leading-relaxed tracking-[0.1em]">
            {copy.zh}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => goToStage('leaderboard')}
          className="px-7 py-3 bg-gold-3 hover:bg-gold-4 text-ink-0
                     font-cns font-medium tracking-[0.2em] text-[13px]
                     transition-colors shadow-gold-glow"
        >
          View Leaderboard · 查看排行榜 →
        </button>
        <button
          onClick={restartRun}
          className="px-7 py-3 border border-gold-2 hover:border-gold-3
                     text-gold-4 font-cns tracking-[0.2em] text-[13px]
                     transition-colors bg-ink-0/60"
        >
          Restart Challenge · 重新挑战 ↻
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, danger, hint }: { label: string; value: string; danger?: boolean; hint?: boolean }) {
  let color = 'text-warm-1';
  if (danger) color = 'text-[#e85d5d]';
  if (hint) color = 'text-[#6ec8d8]';
  return (
    <div className="flex justify-between items-baseline pb-2.5 border-b border-gold-1">
      <span className="font-mono text-[9px] tracking-[0.28em] text-warm-3">{label}</span>
      <span className={`font-brand text-[16px] tracking-[0.12em] ${color}`}>{value}</span>
    </div>
  );
}
