import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { PlayerEntryModal } from '../gameplay/PlayerEntryModal';

const BASE_URL = import.meta.env.BASE_URL;

export function TitleScreen() {
  const goToStage = useGameState((s) => s.goToStage);
  const player = useGameState((s) => s.player);
  const [showModal, setShowModal] = useState(true);
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    if (!player) {
      setShowModal(true);
      return;
    }
    setExiting(true);
    setTimeout(() => goToStage('mission'), 900);
  };

  /* Renders inside GameShell's 1920×1080 canvas — fills it edge-to-edge */
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="absolute inset-0 z-[10] cursor-pointer bg-black"
          onClick={handleStart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Full poster, contained (no cropping) */}
          <img
            src={`${BASE_URL}assets/coverimage.webp`}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {/* Bottom vignette for button legibility */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 30%)' }}
          />

          {/* Start button — very bottom of canvas */}
          <div className="absolute left-0 right-0 bottom-[15px] z-10 flex justify-center pointer-events-none">
            <motion.button
              className="group cursor-pointer pointer-events-auto"
              onClick={(e) => { e.stopPropagation(); handleStart(); }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="font-cns text-[26px] tracking-[0.35em] text-white/90
                                 group-hover:text-white transition-colors
                                 px-20 py-5 border border-white/30 group-hover:border-white/70
                                 bg-black/20 group-hover:bg-black/40 backdrop-blur-sm rounded">
                  开始试炼
                </span>
                <span className="font-mono text-[13px] tracking-[0.3em] text-white/30">
                  TAP ANYWHERE
                </span>
              </div>
            </motion.button>
          </div>

          {/* Player entry modal — shows on top of title */}
          {showModal && !player && <PlayerEntryModal />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
