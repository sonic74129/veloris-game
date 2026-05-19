import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export function PlayerEntryModal() {
  const player = useGameState((s) => s.player);
  const setPlayer = useGameState((s) => s.setPlayer);
  const goToStage = useGameState((s) => s.goToStage);

  const [name, setName] = useState(player?.name ?? '');
  const [company, setCompany] = useState(player?.company ?? '');
  const [exiting, setExiting] = useState(false);

  const canSubmit = name.trim().length > 0 && company.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setPlayer({ name: name.trim(), company: company.trim() });
    setExiting(true);
    setTimeout(() => goToStage('mission'), 700);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-[30] flex items-center justify-center"
        >
          {/* Dim backdrop */}
          <div className="absolute inset-0 bg-ink-0/75 backdrop-blur-[2px]" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="relative z-10 glass frame-corners p-10 w-[520px] max-w-[90%]"
          >
            <span className="c-tl" /><span className="c-br" />

            {/* Seal */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full border border-gold-3 flex items-center justify-center">
                <span className="font-brand text-[24px] text-gold-4">M</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <div className="eyebrow">CHAIRWOMAN'S INVITATION</div>
              <div className="font-brand text-[32px] tracking-[0.1em] text-warm-1 mt-3 leading-tight">
                Welcome to <span className="text-gold-4">Contoso Maison</span>
              </div>
              <div className="font-cn text-[14px] text-warm-2 mt-3 italic leading-relaxed">
                Before you enter the Frontier Firm challenge,<br />
                tell Miranda who you are.
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gold-2 to-transparent my-6" />

            {/* Fields */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="font-mono text-[10px] tracking-[0.32em] text-warm-3 block mb-2">
                  NAME · 姓名
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-ink-0/60 border border-gold-1 hover:border-gold-2 focus:border-gold-3
                             text-warm-1 font-cns text-[15px] tracking-[0.08em] px-4 py-3
                             outline-none transition-colors placeholder:text-warm-4"
                  autoFocus
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.32em] text-warm-3 block mb-2">
                  COMPANY · 公司
                </label>
                <input
                  type="text"
                  placeholder="Your company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-ink-0/60 border border-gold-1 hover:border-gold-2 focus:border-gold-3
                             text-warm-1 font-cns text-[15px] tracking-[0.08em] px-4 py-3
                             outline-none transition-colors placeholder:text-warm-4"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-8 py-3.5 bg-gold-3 hover:bg-gold-4 disabled:bg-warm-4 disabled:text-warm-3
                           text-ink-0 font-cns font-medium tracking-[0.2em] text-[13px]
                           transition-colors shadow-gold-glow disabled:shadow-none"
              >
                Enter the Challenge · 进入试炼 →
              </button>
            </div>

            {/* Footnote */}
            <div className="font-cn text-[11px] text-warm-3 text-center mt-6 italic leading-relaxed">
              Your name will appear inside the challenge.<br />
              <span className="text-warm-2">Miranda will remember your decisions.</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
