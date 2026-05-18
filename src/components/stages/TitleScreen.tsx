import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

const BASE_URL = import.meta.env.BASE_URL;

export function TitleScreen() {
  const goToStage = useGameState((s) => s.goToStage);
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => goToStage('mission'), 900);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 cursor-pointer bg-black"
          style={{ height: '100dvh' }}
          onClick={handleStart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Full-bleed cover image */}
          <img
            src={`${BASE_URL}assets/frontpage.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Subtle vignette so button is legible */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 30%)' }}
          />

          {/* Start button — pinned to very bottom */}
          <motion.button
            className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-4 z-10 group cursor-pointer"
            onClick={(e) => { e.stopPropagation(); handleStart(); }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-cns text-[13px] sm:text-[15px] tracking-[0.35em] text-white/90
                               group-hover:text-white transition-colors
                               px-10 py-2 sm:px-14 sm:py-3 border border-white/30 group-hover:border-white/70
                               bg-black/20 group-hover:bg-black/40 backdrop-blur-sm rounded">
                开始试炼
              </span>
              <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.3em] text-white/30">
                TAP ANYWHERE
              </span>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
