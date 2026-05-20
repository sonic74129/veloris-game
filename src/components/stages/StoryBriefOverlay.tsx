import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '../../lib/mobile';

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
  const isMobile = useMobile();
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
            className={`relative z-10 glass frame-corners border border-gold-2/70 overflow-hidden ${
              isMobile
                ? 'w-[94vw] h-[92vh] max-w-[1180px]'
                : 'w-[1320px] max-w-[92vw] h-[760px] max-h-[90vh]'
            }`}
          >
            <span className="c-tl" /><span className="c-br" />

            <div className={`h-full flex flex-col ${isMobile ? 'p-4' : 'p-10'}`}>
              <div className={`font-mono tracking-[0.32em] text-gold-3 uppercase ${isMobile ? 'text-[9px]' : 'text-[11px]'}`}>
                Story Brief · Stage {stageNumber}
              </div>

              <h2 className={`font-cn text-warm-1 tracking-[0.06em] leading-tight ${isMobile ? 'mt-1.5 text-[18px]' : 'mt-3 text-[42px]'}`}>
                {stageTitle}
              </h2>

              <div className={`gold-divider ${isMobile ? 'mt-2' : 'mt-5'}`} />

              <div className={`flex-1 overflow-y-auto ${isMobile ? 'mt-2 pr-2' : 'mt-7 pr-3'}`}>
                <p className={`font-cns text-warm-1 whitespace-pre-line ${isMobile ? 'text-[13px] leading-[1.7]' : 'text-[20px] leading-[1.9]'}`}>
                  {storyBrief}
                </p>
              </div>

              <div className={`flex justify-end ${isMobile ? 'mt-2' : 'mt-6'}`}>
                <button
                  onClick={onEnterStage}
                  className={`border border-gold-3 text-gold-4 hover:text-warm-1
                             hover:bg-gold-3/10 transition-colors font-mono uppercase
                             ${isMobile ? 'px-4 py-2 text-[10px] tracking-[0.24em]' : 'px-6 py-3 text-[11px] tracking-[0.28em]'}`}
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
