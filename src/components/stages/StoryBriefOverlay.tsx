import { motion, AnimatePresence } from 'framer-motion';

interface StoryBriefOverlayProps {
  show: boolean;
  stageNumber: number;
  stageTitle: string;
  storyBrief: string;
  onEnterStage: () => void;
}

export function StoryBriefOverlay({
  show,
  stageNumber,
  stageTitle,
  storyBrief,
  onEnterStage,
}: StoryBriefOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-ink-0/82 backdrop-blur-sm" />

          <motion.div
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="relative z-10 w-[1320px] max-w-[92vw] h-[760px] max-h-[90vh] glass frame-corners
                       border border-gold-2/70 overflow-hidden"
          >
            <span className="c-tl" /><span className="c-br" />

            <div className="h-full flex flex-col p-10">
              <div className="font-mono text-[11px] tracking-[0.36em] text-gold-3 uppercase">
                Story Brief · Stage {stageNumber}
              </div>

              <h2 className="mt-3 font-cn text-[42px] text-warm-1 tracking-[0.06em] leading-tight">
                {stageTitle}
              </h2>

              <div className="gold-divider mt-5" />

              <div className="mt-7 flex-1 overflow-y-auto pr-3">
                <p className="font-cns text-[20px] leading-[1.9] text-warm-1 whitespace-pre-line">
                  {storyBrief}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onEnterStage}
                  className="px-6 py-3 border border-gold-3 text-gold-4 hover:text-warm-1
                             hover:bg-gold-3/10 transition-colors font-mono text-[11px]
                             tracking-[0.28em] uppercase"
                >
                  Enter Stage / 开始任务
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
