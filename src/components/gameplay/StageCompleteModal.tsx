import { motion, AnimatePresence } from 'framer-motion';

interface StageCompleteModalProps {
  show: boolean;
  title: string;
  body: string;
  nextLabel: string;
  onNext: () => void;
}

export function StageCompleteModal({ show, title, body, nextLabel, onNext }: StageCompleteModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[50] flex items-center justify-center
                     bg-ink-0/85 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="glass frame-corners relative p-12 max-w-[560px] text-center"
          >
            <span className="c-tl" /><span className="c-br" />
            <div className="eyebrow mb-3">MISSION COMPLETE</div>
            <div className="font-cn text-[36px] tracking-[0.1em] text-gold-4 mb-3">
              {title}
            </div>
            <div className="font-cns text-[14px] text-warm-2 mb-8 leading-relaxed">
              {body}
            </div>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-gold-3 hover:bg-gold-4 text-ink-0
                         font-cns font-medium tracking-[0.2em] text-[13px]
                         transition-colors shadow-gold-glow"
            >
              {nextLabel}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
