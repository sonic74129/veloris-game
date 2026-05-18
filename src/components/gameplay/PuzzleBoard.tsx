import { useMemo, useState } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { GameOption, GameSlot, StageConfig } from '../../data/types';
import { DragOptionCard } from './DragOptionCard';
import { DropSlot } from './DropSlot';
import { useGameState } from '../../hooks/useGameState';
import { accentHex } from '../../lib/accent';
import { Icon } from '../icons/Icon';

interface PuzzleBoardProps {
  stage: StageConfig;
  /** layout direction for slots */
  slotsLayout?: 'horizontal' | 'vertical';
  onComplete: () => void;
}

export function PuzzleBoard({ stage, slotsLayout = 'horizontal', onComplete }: PuzzleBoardProps) {
  const slots = stage.slots ?? [];
  const options = stage.options ?? [];
  const correctMap = stage.correctMapping ?? {};

  const assignments = useGameState((s) => s.slotAssignments);
  const validate = useGameState((s) => s.validatePlacement);

  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const optionsById = useMemo(() => {
    const m: Record<string, GameOption> = {};
    options.forEach((o) => (m[o.id] = o));
    return m;
  }, [options]);

  const placedOptionIds = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => (assignments[s.id] ?? []).forEach((id) => set.add(id)));
    return set;
  }, [assignments, slots]);

  const expectedCount = (slotId: string): number => {
    const c = correctMap[slotId];
    return Array.isArray(c) ? c.length : 1;
  };

  const allCorrect = useMemo(() => {
    return slots.every((s) => {
      const placed = assignments[s.id] ?? [];
      const correct = correctMap[s.id];
      if (!correct) return false;
      const need = Array.isArray(correct) ? correct : [correct];
      return need.every((id) => placed.includes(id));
    });
  }, [assignments, slots, correctMap]);

  // fire onComplete once
  if (allCorrect) {
    queueMicrotask(onComplete);
  }

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const optionId = String(e.active.id);
    const slotId = e.over ? String(e.over.id) : null;
    if (!slotId) return;
    const result = validate(slotId, optionId);
    if (result === 'wrong') {
      setWrongSlotId(slotId);
      setTimeout(() => setWrongSlotId(null), 600);
    }
  };

  const activeOption = activeId ? optionsById[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Slots area */}
      <div
        className={`${slotsLayout === 'vertical' ? 'flex flex-col' : 'grid grid-cols-3'} gap-4`}
      >
        {slots.map((s: GameSlot) => {
          const placed = (assignments[s.id] ?? [])
            .map((id) => optionsById[id])
            .filter(Boolean);
          const correctIds = correctMap[s.id];
          const needed = Array.isArray(correctIds) ? correctIds : correctIds ? [correctIds] : [];
          const isFilled =
            needed.length > 0 &&
            needed.every((id) => placed.some((p) => p.id === id));
          const status: 'idle' | 'correct' | 'wrong' =
            wrongSlotId === s.id ? 'wrong' : isFilled ? 'correct' : 'idle';
          return (
            <DropSlot
              key={s.id}
              slot={s}
              placed={placed}
              status={status}
              expectedCount={expectedCount(s.id)}
            />
          );
        })}
      </div>

      {/* Option pool */}
      <div className="mt-6">
        <div className="eyebrow mb-3">Option Pool · 选项卡</div>
        <div className="flex flex-wrap gap-3">
          {options.map((o) => (
            <DragOptionCard
              key={o.id}
              option={o}
              disabled={placedOptionIds.has(o.id)}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeOption && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            style={{
              borderColor: accentHex[activeOption.accent],
              boxShadow: `0 0 32px ${accentHex[activeOption.accent]}55, 0 20px 40px rgba(0,0,0,0.7)`,
            }}
            className="w-[200px] rounded-lg border-[1.5px] bg-ink-2/95 p-3"
          >
            <div className="flex items-start gap-2">
              <span style={{ color: accentHex[activeOption.accent] }}>
                <Icon name={activeOption.icon} size={28} />
              </span>
              <div className="font-cns text-[12.5px] text-warm-1 leading-tight">
                {activeOption.title}
              </div>
            </div>
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
