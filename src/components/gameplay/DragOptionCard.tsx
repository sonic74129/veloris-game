import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { GameOption } from '../../data/types';
import { accentHex, accentSoft } from '../../lib/accent';
import { Icon } from '../icons/Icon';

interface DragOptionCardProps {
  option: GameOption;
  disabled?: boolean;     // already placed correctly
}

export function DragOptionCard({ option, disabled = false }: DragOptionCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: option.id,
    disabled,
    data: { option },
  });

  const accent = accentHex[option.accent];
  const soft = accentSoft[option.accent];

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: disabled ? 0.35 : 1,
    cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    borderColor: accent,
    boxShadow: isDragging
      ? `0 0 32px ${soft}, 0 12px 32px rgba(0,0,0,0.6)`
      : `0 0 12px ${soft}`,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      whileHover={disabled ? {} : { y: -3, boxShadow: `0 0 22px ${soft}` }}
      className="w-[200px] h-[124px] rounded-lg border-[1.5px] bg-ink-2/85 backdrop-blur-sm
                 p-3 flex flex-col gap-2 select-none touch-none relative overflow-hidden"
    >
      <div className="flex items-start gap-2">
        <div style={{ color: accent }} className="flex-shrink-0">
          <Icon name={option.icon} size={28} />
        </div>
        <div className="font-cns text-[12.5px] text-warm-1 leading-tight font-medium">
          {option.title}
        </div>
      </div>
      {option.description && (
        <div className="font-cns text-[10.5px] text-warm-3 leading-[1.4] line-clamp-3">
          {option.description}
        </div>
      )}
      {disabled && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-3 text-ink-0
                        flex items-center justify-center text-[11px]">✓</div>
      )}
    </motion.div>
  );
}
