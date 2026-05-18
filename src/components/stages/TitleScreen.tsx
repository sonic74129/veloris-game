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
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)' }}
          />

          {/* Start button — bottom center, well within viewport */}
          <motion.button
            className="absolute left-1/2 -translate-x-1/2 bottom-[4%] z-10 group cursor-pointer"
            onClick={(e) => { e.stopPropagation(); handleStart(); }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="px-10 py-3 sm:px-14 sm:py-4 border border-white/40 group-hover:border-white/80
                            bg-black/30 group-hover:bg-black/50 backdrop-blur-sm
                            transition-all duration-500 rounded">
              <span className="font-cns text-[13px] sm:text-[15px] tracking-[0.35em] text-white/90
                               group-hover:text-white transition-colors">
                开始试炼
              </span>
            </div>
          </motion.button>

          {/* Hint text */}
          <motion.div
            className="absolute bottom-[1%] left-1/2 -translate-x-1/2
                        font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-white/30 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            TAP ANYWHERE · 点击任意处开始
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
