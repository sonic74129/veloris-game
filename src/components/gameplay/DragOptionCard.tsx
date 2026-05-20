import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { GameOption } from '../../data/types';
import { accentHex, accentSoft } from '../../lib/accent';
import { useCanvasScaleValue } from '../../lib/mobile';
import { Icon } from '../icons/Icon';

interface DragOptionCardProps {
  option: GameOption;
  disabled?: boolean;     // already placed correctly
  showDescription?: boolean;
}

export function DragOptionCard({ option, disabled = false, showDescription = false }: DragOptionCardProps) {
  const scale = useCanvasScaleValue();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: option.id,
    disabled,
    data: { option },
  });

  const adjustedTransform = transform
    ? {
        ...transform,
        x: transform.x / Math.max(scale, 0.01),
        y: transform.y / Math.max(scale, 0.01),
      }
    : null;

  const accent = accentHex[option.accent];
  const soft = accentSoft[option.accent];
  const showAssetMeta = Boolean(option.typeLabel || option.team || option.status);
  const shouldShowDescription = showDescription || showAssetMeta;
  const cardWidthClass = showAssetMeta ? 'w-[172px]' : 'w-[220px]';
  const cardHeightClass = showAssetMeta ? 'min-h-[162px]' : shouldShowDescription ? 'h-[124px]' : 'h-[96px]';

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(adjustedTransform),
    opacity: isDragging ? 0 : disabled ? 0.35 : 1,
    cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    borderColor: accent,
    boxShadow: isDragging
      ? `0 0 46px ${soft}, 0 16px 40px rgba(0,0,0,0.7)`
      : `0 0 16px ${soft}`,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      whileHover={disabled ? {} : { y: -4, scale: 1.01, boxShadow: `0 0 38px ${soft}, 0 12px 28px rgba(0,0,0,0.58)` }}
      whileDrag={disabled ? {} : { scale: 1.05 }}
      className={`${cardWidthClass} rounded-lg border-[1.5px] bg-ink-2/85 backdrop-blur-sm
                 p-3 flex flex-col gap-2 select-none touch-none relative overflow-hidden
             ${cardHeightClass}`}
    >
      <div className="flex items-start gap-2">
        <div style={{ color: accent }} className="flex-shrink-0">
          <Icon name={option.icon} size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-cns text-[14px] text-warm-1 leading-tight font-medium">
            {option.title}
          </div>
          {option.typeLabel && (
            <div className="mt-1 inline-flex border border-gold-2/50 bg-ink-3/75 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.14em] text-gold-4">
              {option.typeLabel}
            </div>
          )}
        </div>
      </div>
      {showAssetMeta && (
        <>
          {option.team && (
            <div className="font-mono text-[8px] tracking-[0.1em] text-warm-3">{option.team}</div>
          )}
          {option.description && (
            <div className="font-cns text-[10.5px] text-warm-3 leading-[1.35] line-clamp-2">
              {option.description}
            </div>
          )}
          {option.status && (
            <div className="mt-auto border border-gold-2/45 bg-ink-3/75 px-2 py-1">
              <div className="font-mono text-[8px] tracking-[0.16em] text-warm-4">CURRENT STATUS</div>
              <div className="mt-0.5 font-cns text-[10.5px] text-warm-2">
                {disabled ? 'Managed by Foundry / 已纳入 Foundry' : option.status}
              </div>
            </div>
          )}
        </>
      )}
      {!showAssetMeta && shouldShowDescription && option.description && (
        <div className="font-cns text-[11.5px] text-warm-3 leading-[1.4] line-clamp-2">
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
