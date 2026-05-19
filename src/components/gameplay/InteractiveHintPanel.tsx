import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

const BASE_URL = import.meta.env.BASE_URL;

interface Props {
  stageId: string;
  kinkyHint: string;
  lilyHint: string;
}

export function InteractiveHintPanel({ stageId, kinkyHint, lilyHint }: Props) {
  const recordHintUsed = useGameState((s) => s.recordHintUsed);
  const currentRun = useGameState((s) => s.currentRun);

  // Track per-stage usage (reset on stageId change via key)
  const [kinkyUsed, setKinkyUsed] = useState(false);
  const [lilyUsed, setLilyUsed] = useState(false);
  const [showKinky, setShowKinky] = useState(false);
  const [showLily, setShowLily] = useState(false);

  const handleAskKinky = () => {
    if (kinkyUsed || !currentRun) return;
    setKinkyUsed(true);
    setShowKinky(true);
    recordHintUsed();
  };

  const handleAskLily = () => {
    if (lilyUsed || !currentRun) return;
    setLilyUsed(true);
    setShowLily(true);
    recordHintUsed();
  };

  return (
    <div className="glass p-4 frame-corners relative" key={stageId}>
      <span className="c-tl" /><span className="c-br" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gold-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 9a3 3 0 116 0c0 2-3 2-3 5" />
          <circle cx="12" cy="17" r="0.6" fill="currentColor" />
        </svg>
        <span className="font-cn text-[14px] text-warm-1 tracking-[0.08em]">需要提示？</span>
        <span className="font-mono text-[9px] tracking-[0.28em] text-warm-3 ml-auto">NEED A HINT?</span>
      </div>

      <div className="font-cns text-[11px] text-warm-2 leading-relaxed mb-3">
        找 <span className="text-gold-4">Kinky</span> 或 <span className="text-gold-4">Lily</span> 帮忙 — 但 Miranda 会扣分。
        <span className="font-mono text-[9px] tracking-[0.24em] text-[#e85d5d] ml-2">EACH HINT · −150 PTS</span>
      </div>

      {/* Hint buttons */}
      <div className="flex flex-col gap-2.5">
        {/* Kinky */}
        <button
          onClick={handleAskKinky}
          disabled={kinkyUsed}
          className={`flex items-center gap-3 p-2.5 border transition-colors w-full text-left
            ${kinkyUsed
              ? 'border-warm-4/40 opacity-60 cursor-default'
              : 'border-gold-1 hover:border-gold-3 cursor-pointer'
            }`}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gold-2 flex-shrink-0">
            <img src={`${BASE_URL}assets/kinky-avatar.png`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-cns text-[12px] text-warm-1">Ask Kinky</div>
            <div className="font-mono text-[8px] tracking-[0.2em] text-warm-3">WARM · PLAYFUL ADVISOR</div>
          </div>
          <span className="font-mono text-[11px] text-[#e85d5d]">−150</span>
        </button>

        {/* Kinky bubble */}
        <AnimatePresence>
          {showKinky && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gold-1/20 border border-gold-2/50 p-3 ml-4">
                <span className="font-mono text-[8px] tracking-[0.24em] text-gold-3 block mb-1">KINKY SAYS</span>
                <span className="font-cn text-[12px] text-warm-2 leading-relaxed">{kinkyHint}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lily */}
        <button
          onClick={handleAskLily}
          disabled={lilyUsed}
          className={`flex items-center gap-3 p-2.5 border transition-colors w-full text-left
            ${lilyUsed
              ? 'border-warm-4/40 opacity-60 cursor-default'
              : 'border-gold-1 hover:border-gold-3 cursor-pointer'
            }`}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gold-2 flex-shrink-0">
            <img src={`${BASE_URL}assets/lily-avatar.png`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-cns text-[12px] text-warm-1">Ask Lily</div>
            <div className="font-mono text-[8px] tracking-[0.2em] text-warm-3">RATIONAL · ARCHITECT</div>
          </div>
          <span className="font-mono text-[11px] text-[#e85d5d]">−150</span>
        </button>

        {/* Lily bubble */}
        <AnimatePresence>
          {showLily && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gold-1/20 border border-gold-2/50 p-3 ml-4">
                <span className="font-mono text-[8px] tracking-[0.24em] text-gold-3 block mb-1">LILY SAYS</span>
                <span className="font-cn text-[12px] text-warm-2 leading-relaxed">{lilyHint}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
