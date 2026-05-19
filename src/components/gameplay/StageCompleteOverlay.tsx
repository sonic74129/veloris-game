import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StageScore } from '../../lib/scoring';

interface Props {
  show: boolean;
  stageScore: StageScore | null;
  stageNumber: number;
  onNext: () => void;
  completionTitle?: string;
  completionMessage?: string;
  completionButtonLabel?: string;
}

export function StageCompleteOverlay({
  show,
  stageScore,
  stageNumber,
  onNext,
  completionTitle,
  completionMessage,
  completionButtonLabel,
}: Props) {
  // Auto-advance after 3 seconds
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(onNext, 3000);
    return () => clearTimeout(id);
  }, [show, onNext]);

  if (!stageScore) return null;

  const isPerfect = stageScore.isPerfect;
  const mm = String(Math.floor(stageScore.timeSeconds / 60)).padStart(2, '0');
  const ss = String(stageScore.timeSeconds % 60).padStart(2, '0');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[50] flex flex-col items-center justify-center cursor-pointer"
          onClick={onNext}
        >
          {/* Dim */}
          <div className="absolute inset-0 bg-ink-0/80 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 240 }}
            className="relative z-10 glass frame-corners p-10 w-[520px] max-w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="c-tl" /><span className="c-br" />

            {/* Header */}
            <div className="text-center">
              <div className="eyebrow" style={{ color: isPerfect ? 'var(--tw-gold-4, #c9a55a)' : undefined }}>
                {isPerfect ? 'PERFECT · NO MISTAKES' : 'STAGE COMPLETED'}
              </div>
              <div className={`font-brand text-[32px] tracking-[0.14em] mt-3 ${
                isPerfect ? 'text-gold-4' : 'text-warm-1'
              }`}>
                {completionTitle ?? 'Stage Completed'}
              </div>
              <div className="font-cn text-[13px] text-warm-2 mt-1 tracking-[0.14em]">
                第 {stageNumber} 关 · {isPerfect ? '完美通关' : '通关'}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mt-7">
              <StatCell label="SCORE" value={String(stageScore.score)} gold={isPerfect} />
              <StatCell label="TIME" value={`${mm}:${ss}`} />
              <StatCell label="W / H" value={`${stageScore.wrongAttempts} / ${stageScore.hintsUsed}`}
                danger={stageScore.wrongAttempts > 0 || stageScore.hintsUsed > 0} />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gold-2 to-transparent my-5" />

            {/* Bonus or penalty */}
            <div className="flex items-center justify-between">
              {isPerfect ? (
                <>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.28em] text-gold-3">PERFECT BONUS</div>
                    <div className="font-brand text-[20px] text-gold-4 mt-1">+300</div>
                  </div>
                  <div className="font-brand text-[14px] tracking-[0.2em] text-gold-4 border border-gold-3 px-4 py-1.5">
                    PERFECT DECISION
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.28em] text-[#e85d5d]">HINT PENALTY</div>
                    <div className="font-brand text-[20px] text-[#e85d5d] mt-1">
                      −{stageScore.hintsUsed * 150 + stageScore.wrongAttempts * 100}
                    </div>
                  </div>
                  <div className="font-brand text-[14px] tracking-[0.2em] text-warm-3 border border-warm-4 px-4 py-1.5">
                    NOT ELEGANT
                  </div>
                </>
              )}
            </div>

            {/* Message */}
            <div className="font-cn text-[14px] text-warm-1 italic text-center mt-6 leading-relaxed">
              {completionMessage ? (
                completionMessage
              ) : isPerfect ? (
                <>"Miranda noticed."<br />
                  <span className="text-[11px] text-warm-3 tracking-[0.14em]">— 董事长记下了你的选择</span>
                </>
              ) : (
                <>"Completed, <span className="text-gold-4">but not elegant.</span>"<br />
                  <span className="text-[11px] text-warm-3 tracking-[0.14em]">— Miranda 抬了抬眉</span>
                </>
              )}
            </div>

            {completionButtonLabel && (
              <button
                onClick={onNext}
                className="mt-6 w-full border border-gold-3 bg-gold-3/10 px-4 py-2 font-cns text-[14px] text-gold-4 hover:bg-gold-3/20 transition-colors"
              >
                {completionButtonLabel}
              </button>
            )}
          </motion.div>

          {/* Auto-advance hint */}
          <div className="relative z-10 mt-6">
            <span className="font-mono text-[10px] tracking-[0.36em] text-warm-4">
              AUTO · ADVANCE · TAP TO CONTINUE
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCell({ label, value, gold, danger }: { label: string; value: string; gold?: boolean; danger?: boolean }) {
  let color = 'text-warm-1';
  if (gold) color = 'text-gold-4';
  if (danger) color = 'text-[#e85d5d]';
  return (
    <div className="text-center border-r border-gold-1 last:border-r-0 pr-3 last:pr-0">
      <div className="font-mono text-[9px] tracking-[0.28em] text-warm-3">{label}</div>
      <div className={`font-brand text-[32px] mt-1 tracking-[0.04em] ${color}`}>{value}</div>
    </div>
  );
}
