import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

const BASE_URL = import.meta.env.BASE_URL;

interface Props {
  stageId: string;
  advisor: 'kinky' | 'lily';
  hintText: string;
  onReveal?: () => void;
  panelTitle?: string;
  panelBody?: string;
}

export function InteractiveHintPanel({ stageId, advisor, hintText, onReveal, panelTitle, panelBody }: Props) {
  const recordHintUsed = useGameState((s) => s.recordHintUsed);
  const currentRun = useGameState((s) => s.currentRun);

  // Track per-stage usage (reset on stageId change via key)
  const [used, setUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setUsed(false);
    setShowHint(false);
  }, [stageId]);

  const handleAsk = () => {
    if (used) return;
    setUsed(true);
    setShowHint(true);
    onReveal?.();
    if (currentRun) recordHintUsed();
  };

  const isKinky = advisor === 'kinky';
  const label = isKinky ? 'Ask Kinky' : 'Ask Lily';
  const subtitle = isKinky ? 'WARM · PLAYFUL ADVISOR' : 'RATIONAL · ARCHITECT';
  const avatar = isKinky ? `${BASE_URL}assets/kinky-avatar.png` : `${BASE_URL}assets/lily-avatar.png`;
  const speaker = isKinky ? 'KINKY SAYS' : 'LILY SAYS';
  const [customTitleZh, customTitleEn] = (panelTitle ?? '').split('/').map((s) => s.trim());
  const bodyCopy = panelBody ?? `向 ${isKinky ? 'Kinky' : 'Lily'} 请求本关知识点提示，Miranda 会扣分。\nEACH HINT -150 PTS`;
  const bodyLines = bodyCopy.split('\n');

  return (
    <div className="glass p-4 frame-corners relative">
      <span className="c-tl" /><span className="c-br" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gold-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 9a3 3 0 116 0c0 2-3 2-3 5" />
          <circle cx="12" cy="17" r="0.6" fill="currentColor" />
        </svg>
        <span className="font-cn text-[15px] text-warm-1 tracking-[0.08em]">{customTitleZh || '需要提示？'}</span>
        <span className="font-mono text-[10px] tracking-[0.24em] text-warm-3 ml-auto">{customTitleEn || 'NEED A HINT?'}</span>
      </div>

      <div className="font-cns text-[12px] text-warm-2 leading-relaxed mb-3">
        {bodyLines[0]}
        {bodyLines[1] && (
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#e85d5d] ml-2">{bodyLines[1]}</span>
        )}
      </div>

      {/* Hint buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleAsk}
          disabled={used}
          className={`flex items-center gap-3 p-2.5 border transition-colors w-full text-left
            ${used
              ? 'border-warm-4/40 opacity-60 cursor-default'
              : 'border-gold-1 hover:border-gold-3 cursor-pointer'
            }`}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gold-2 flex-shrink-0">
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-cns text-[13px] text-warm-1">{label}</div>
            <div className="font-mono text-[9px] tracking-[0.16em] text-warm-3">{subtitle}</div>
          </div>
          <span className="font-mono text-[12px] text-[#e85d5d]">−150</span>
        </button>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gold-1/20 border border-gold-2/50 p-3 ml-4">
                <span className="font-mono text-[8px] tracking-[0.22em] text-gold-3 block mb-1">{speaker}</span>
                <span className="font-cn text-[11px] text-warm-2 leading-relaxed whitespace-pre-line">
                  {hintText || '本关暂无知识点提示。'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
