import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameOption, GameSlot } from '../../data/types';
import { accentHex } from '../../lib/accent';
import { Icon } from '../icons/Icon';

interface DropSlotProps {
  slot: GameSlot;
  placed: GameOption[];
  status: 'idle' | 'correct' | 'wrong';
  expectedCount: number;
}

export function DropSlot({ slot, placed, status, expectedCount }: DropSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id: slot.id });

  const filled = placed.length >= expectedCount && status === 'correct';

  return (
    <motion.div
      ref={setNodeRef}
      data-droppable-id={slot.id}
      animate={status === 'wrong' ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className={`relative rounded-lg p-4 min-h-[170px] transition-all
                  ${filled
                    ? 'border-[1.5px] border-gold-4 shadow-gold-glow bg-ink-2/80'
                    : isOver
                    ? 'border-[1.5px] border-gold-4 bg-ink-2/70 shadow-gold-soft'
                    : status === 'wrong'
                    ? 'border-[1.5px] border-accent-red shadow-red-glow bg-ink-2/70'
                    : 'border border-dashed border-gold-2/60 bg-ink-1/40'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-cns text-[15px] text-gold-4 font-medium">{slot.label}</div>
          {slot.description && (
            <div className="font-cns text-[13px] text-warm-3 leading-[1.45] mt-1 max-w-[320px]">
              {slot.description}
            </div>
          )}
        </div>
        {filled && (
          <div className="w-6 h-6 rounded-full bg-gold-3 text-ink-0 flex items-center justify-center
                          text-[12px] flex-shrink-0">✓</div>
        )}
      </div>

      <AnimatePresence>
        {placed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 flex flex-wrap gap-2"
          >
            {placed.map((opt) => (
              <div
                key={opt.id}
                style={{ borderColor: accentHex[opt.accent] }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded border bg-ink-3/80"
              >
                <span style={{ color: accentHex[opt.accent] }}>
                  <Icon name={opt.icon} size={18} />
                </span>
                <span className="font-cns text-[13px] text-warm-1">{opt.title}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {placed.length === 0 && (
        <div className="absolute inset-x-4 bottom-3 font-mono text-[11px] tracking-[0.24em]
                        text-warm-4 text-center pointer-events-none">
          DROP CARD HERE
        </div>
      )}
    </motion.div>
  );
}
