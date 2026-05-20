import { useMemo, useState, type ReactNode } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, useDroppable, useSensor, useSensors,
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
  onWrong?: () => void;
  showOptionDescriptions?: boolean;
}

export function PuzzleBoard({
  stage,
  slotsLayout = 'horizontal',
  onComplete,
  onWrong,
  showOptionDescriptions = false,
}: PuzzleBoardProps) {
  const slots = stage.slots ?? [];
  const options = stage.options ?? [];
  const correctMap = stage.correctMapping ?? {};

  // Stable shuffle of options keyed on stage.id so the visual order doesn't
  // trivially reveal the correct answer, but stays stable across re-renders.
  const shuffledOptions = useMemo(() => shuffleStable(options, stage.id), [options, stage.id]);

  const assignments = useGameState((s) => s.slotAssignments);
  const validate = useGameState((s) => s.validatePlacement);

  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stage1Feedback, setStage1Feedback] = useState<string | null>(null);
  const [stage4Feedback, setStage4Feedback] = useState<string | null>(null);

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

    if (stage.id === 'stage1' && slotId === 'slot-app-modernization') {
      const firstSlot = assignments['slot-legacy-assessment'] ?? [];
      const firstSolved = firstSlot.includes('azure-migrate');
      if (!firstSolved) {
        setWrongSlotId(slotId);
        setTimeout(() => setWrongSlotId(null), 600);
        setStage1Feedback('请先完成问题 1：先看清旧系统，再进入关键应用现代化。');
        onWrong?.();
        return;
      }
    }

    const result = validate(slotId, optionId);
    if (result === 'wrong') {
      setWrongSlotId(slotId);
      setTimeout(() => setWrongSlotId(null), 600);
      if (stage.id === 'stage1') {
        setStage1Feedback(getStage1Feedback(slotId, optionId));
      }
      if (stage.id === 'stage4') {
        setStage4Feedback('先判断它是 Agent、Model，还是 Governance Signal。');
      }
      onWrong?.();
    } else if (stage.id === 'stage1') {
      setStage1Feedback(null);
    } else if (stage.id === 'stage4') {
      setStage4Feedback(null);
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
      {stage.id === 'stage1' ? (
        <Stage1Pipeline
          assignments={assignments}
          optionsById={optionsById}
          correctMap={correctMap}
          wrongSlotId={wrongSlotId}
        />
      ) : stage.id === 'stage4' ? (
        <Stage4ConsolidationBoard
          slots={slots}
          assignments={assignments}
          optionsById={optionsById}
          correctMap={correctMap}
          wrongSlotId={wrongSlotId}
        />
      ) : stage.id === 'stage3' ? (
        <Stage3Whiteboard
          slots={slots}
          assignments={assignments}
          optionsById={optionsById}
          correctMap={correctMap}
          wrongSlotId={wrongSlotId}
          allCorrect={allCorrect}
        />
      ) : stage.id === 'stage5' ? (
        <Stage5SecurityChain
          slots={slots}
          assignments={assignments}
          optionsById={optionsById}
          correctMap={correctMap}
          wrongSlotId={wrongSlotId}
          allCorrect={allCorrect}
        />
      ) : (
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
      )}

      {stage.id === 'stage1' && stage1Feedback && (
        <div className="mt-4 border border-gold-2/40 bg-ink-2/70 px-4 py-2.5 font-cns text-[12px] text-warm-2">
          {stage1Feedback}
        </div>
      )}

      {stage.id === 'stage4' && stage4Feedback && (
        <div className="mt-4 border border-accent-red/50 bg-accent-red/10 px-4 py-2.5 font-cns text-[12px] text-warm-2">
          {stage4Feedback}
        </div>
      )}

      {/* Option pool */}
      <div className="mt-6">
        <div className="eyebrow mb-1">
          {stage.id === 'stage4' ? 'CURRENT AI ASSETS / 当前 AI 资产' : 'Option Pool · 选项卡'}
        </div>
        {stage.id === 'stage4' && (
          <div className="mb-3 font-cns text-[11px] text-warm-3">已分散在各团队与系统中，亟需收编</div>
        )}
        {stage.id === 'stage4' && (
          <svg viewBox="0 0 1000 46" className="mb-2 h-[28px] w-full">
            <g stroke="#8a6f3d" strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.8">
              <path d="M170 38V14H500V2" />
              <path d="M500 38V2" />
              <path d="M830 38V14H500V2" />
            </g>
            <path d="M500 2l-6 9h12z" fill="#c9a55a" />
          </svg>
        )}
        <div className={stage.id === 'stage4' ? 'grid grid-cols-5 gap-2.5' : 'flex flex-wrap gap-3'}>
          {shuffledOptions.map((o) => (
            <DragOptionCard
              key={o.id}
              option={o}
              disabled={placedOptionIds.has(o.id)}
              showDescription={showOptionDescriptions}
            />
          ))}
        </div>
        {stage.id === 'stage4' && (
          <div className="mt-3 border-t border-dashed border-gold-2/45 pt-2 font-cns text-[11px] text-warm-3">
            拖拽以上资产卡片，放入正确的 Foundry 收编区
          </div>
        )}
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

function Stage4ConsolidationBoard({
  slots,
  assignments,
  optionsById,
  correctMap,
  wrongSlotId,
}: {
  slots: GameSlot[];
  assignments: Record<string, string[]>;
  optionsById: Record<string, GameOption>;
  correctMap: Record<string, string | string[]>;
  wrongSlotId: string | null;
}) {
  const zoneStatus = (slotId: string): 'idle' | 'correct' | 'wrong' => {
    if (wrongSlotId === slotId) return 'wrong';
    const placed = (assignments[slotId] ?? []).map((id) => optionsById[id]).filter(Boolean);
    return isSolved(slotId, placed, correctMap) ? 'correct' : 'idle';
  };

  return (
    <div className="rounded-xl border border-gold-2/60 bg-ink-2/65 p-4 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-22"
        style={{
          backgroundImage:
            'linear-gradient(rgba(227,200,134,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(227,200,134,0.06) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative z-10">
        <div className="mb-2 font-cns text-[12px] text-warm-3">目标平台：Foundry Consolidation Zones / 将分散资产收编到 Foundry</div>

        <div className="grid grid-cols-[18px_1fr] gap-3">
          <div className="pt-2 [writing-mode:vertical-rl] rotate-180 font-cns text-[11px] tracking-[0.08em] text-warm-3">
            当前状态：碎片化
          </div>

          <div>
            <div className="grid grid-cols-3 gap-3">
              {slots.map((slot, idx) => {
                const placed = (assignments[slot.id] ?? []).map((id) => optionsById[id]).filter(Boolean);
                const status = zoneStatus(slot.id);
                return (
                  <Stage4ZoneCard
                    key={slot.id}
                    slot={slot}
                    placed={placed}
                    status={status}
                    sequence={idx + 1}
                  />
                );
              })}
            </div>

            <div className="mt-3 h-4 border-t border-dashed border-gold-2/45" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage4ZoneCard({
  slot,
  placed,
  status,
  sequence,
}: {
  slot: GameSlot;
  placed: GameOption[];
  status: 'idle' | 'correct' | 'wrong';
  sequence: number;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: slot.id });
  const iconName = slot.icon ?? (slot.id === 'hosted-agent' ? 'hosted-agent' : slot.id === 'model-runtime' ? 'fireworks' : 'control-plane');
  const zoneLetter = slot.id === 'hosted-agent' ? 'A' : slot.id === 'model-runtime' ? 'B' : slot.id === 'control-plane' ? 'C' : String(sequence);

  return (
    <motion.div
      ref={setNodeRef}
      animate={status === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-lg border p-3 transition-all ${
        status === 'correct'
          ? 'border-gold-4 bg-ink-2/85 shadow-gold-glow ring-1 ring-gold-3/60'
          : status === 'wrong'
          ? 'border-accent-red bg-accent-red/10'
          : isOver
          ? 'border-gold-3 bg-ink-2/80 shadow-gold-soft ring-1 ring-gold-2/50'
          : 'border-dashed border-gold-2/60 bg-ink-2/70'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-gold-3/70 bg-gold-4/10 font-mono text-[11px] tracking-[0.06em] text-gold-4">
          {zoneLetter}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ color: '#e3c886' }}><Icon name={iconName} size={15} /></span>
            <div className="font-cns text-[13px] text-warm-1 leading-tight">{slot.label}</div>
          </div>
          {(slot.subtitleEn || slot.subtitleZh) && (
            <div className="mt-0.5 font-mono text-[9px] tracking-[0.08em] text-gold-4/80">
              {slot.subtitleEn}
              {slot.subtitleZh ? ` · ${slot.subtitleZh}` : ''}
            </div>
          )}
        </div>
      </div>

      {slot.description && (
        <div className="mt-1.5 font-cns text-[11px] text-warm-3 leading-[1.45]">{slot.description}</div>
      )}

      <div className="mt-2 min-h-[72px] rounded border border-dashed border-gold-2/50 px-2 py-2">
        {placed.length === 0 ? (
          <div className="text-center font-mono text-[9.5px] tracking-[0.15em] text-warm-4 pt-5">
            {slot.dropHint ?? 'DROP CARD HERE'}
          </div>
        ) : (
          <div className="space-y-1.5">
            {placed.map((opt) => (
              <div key={opt.id} className="rounded border border-gold-2/50 bg-ink-3/80 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-cns text-[11.5px] text-warm-1 leading-tight">{opt.title}</div>
                  <span className="font-mono text-[8.5px] tracking-[0.1em] text-gold-4">{opt.typeLabel}</span>
                </div>
                <div className="mt-1 font-cns text-[10px] text-emerald">Managed by Foundry / 已纳入 Foundry</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Stage3Whiteboard({
  slots,
  assignments,
  optionsById,
  correctMap,
  wrongSlotId,
  allCorrect,
}: {
  slots: GameSlot[];
  assignments: Record<string, string[]>;
  optionsById: Record<string, GameOption>;
  correctMap: Record<string, string | string[]>;
  wrongSlotId: string | null;
  allCorrect: boolean;
}) {
  const slotById = useMemo(() => {
    const m: Record<string, GameSlot> = {};
    slots.forEach((s) => (m[s.id] = s));
    return m;
  }, [slots]);

  const getPlaced = (slotId: string) => (assignments[slotId] ?? []).map((id) => optionsById[id]).filter(Boolean);
  const getStatus = (slotId: string): 'idle' | 'correct' | 'wrong' => {
    if (wrongSlotId === slotId) return 'wrong';
    const placed = getPlaced(slotId);
    return isSolved(slotId, placed, correctMap) ? 'correct' : 'idle';
  };

  const chipLabels = ['ERP', 'POS', 'CRM', 'E-commerce', 'Excel'];

  return (
    <div className="rounded-[10px] border border-gold-3/70 bg-ink-2/65 p-5 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(201,165,90,0.1)]">
      <div className="pointer-events-none absolute -inset-[6px] -z-[1] rounded-[14px] border border-gold-1/50" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(227,200,134,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(227,200,134,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-20" />
      <span className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />
      <span className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />
      <span className="pointer-events-none absolute left-3 bottom-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />
      <span className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {chipLabels.map((label) => (
            <span
              key={label}
              className="border border-gold-2/50 bg-ink-3/70 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-gold-4"
            >
              {label}
            </span>
          ))}
        </div>

        <svg viewBox="0 0 1000 92" className="mt-2 h-[56px] w-full">
          <g stroke="#8a6f3d" strokeWidth="1.2" strokeDasharray="4 4" fill="none">
            <path d="M170 0V30H830V0" />
            <path d="M330 0V30" />
            <path d="M500 0V30" />
            <path d="M670 0V30" />
            <path d="M500 30V72" />
          </g>
          <path d="M500 72l-6-9h12z" fill="#c9a55a" />
        </svg>

        <div className="relative grid grid-cols-[300px_120px_300px] justify-center gap-0">
          <div className="flex flex-col items-center">
            <Stage3DropNode
              slot={slotById['slot-onelake']}
              placed={getPlaced('slot-onelake')}
              status={getStatus('slot-onelake')}
              allCorrect={allCorrect}
              sequence={0}
            />
            <VerticalConnector />
            <Stage3DropNode
              slot={slotById['slot-ontology']}
              placed={getPlaced('slot-ontology')}
              status={getStatus('slot-ontology')}
              allCorrect={allCorrect}
              sequence={1}
            />
            <VerticalConnector />
            <Stage3DropNode
              slot={slotById['slot-data-agent']}
              placed={getPlaced('slot-data-agent')}
              status={getStatus('slot-data-agent')}
              allCorrect={allCorrect}
              sequence={2}
            />
            <VerticalConnector />
            <div className="w-[300px] rounded-[10px] border border-gold-3/70 bg-gradient-to-b from-gold-3/20 to-ink-3/90 px-4 py-3 text-center font-cns text-[16px] font-semibold tracking-[0.04em] text-gold-4 shadow-[0_0_20px_rgba(201,165,90,0.12)]">
              AGENTIC AI
            </div>
          </div>

          {/* Business Semantics -> Proactive Operations */}
          <div className="pointer-events-none flex items-start justify-center pt-[248px]">
            <svg viewBox="0 0 120 30" className="h-[30px] w-[120px]">
              <path d="M2 15H104" stroke="#8a6f3d" strokeWidth="1.2" strokeDasharray="4 4" fill="none" />
              <path d="M116 15l-10-6v12z" fill="#c9a55a" />
            </svg>
          </div>

          <div className="pt-[136px]">
            <Stage3DropNode
              slot={slotById['slot-operations-agent']}
              placed={getPlaced('slot-operations-agent')}
              status={getStatus('slot-operations-agent')}
              allCorrect={allCorrect}
              sequence={3}
            />
            <VerticalConnector />
            <div className="inline-flex w-[300px] justify-center rounded-[10px] border border-gold-3/70 bg-ink-3/80 px-4 py-2.5 text-center font-cns text-[14px] tracking-[0.06em] text-warm-2">
              ACTIVATOR
            </div>
            <VerticalConnector />
            <div className="inline-flex w-[300px] justify-center rounded-[10px] border border-gold-3/70 bg-ink-3/80 px-4 py-2.5 text-center font-cns text-[14px] tracking-[0.06em] text-warm-2">
              EVENT RESPONSE
            </div>
          </div>
        </div>

        {allCorrect && (
          <div className="mt-4 border border-gold-3/70 bg-ink-2/85 px-4 py-2 text-center font-cns text-[12.5px] text-gold-4">
            AI-ready data architecture completed. The Data Agent can now understand, answer, and act.
          </div>
        )}
      </div>
    </div>
  );
}

function Stage3DropNode({
  slot,
  placed,
  status,
  allCorrect,
  sequence,
}: {
  slot?: GameSlot;
  placed: GameOption[];
  status: 'idle' | 'correct' | 'wrong';
  allCorrect: boolean;
  sequence: number;
}) {
  const slotId = slot?.id ?? `fallback-${sequence}`;
  const { isOver, setNodeRef } = useDroppable({ id: slotId });
  const solved = status === 'correct';
  const step = String(sequence + 1).padStart(2, '0');

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        x: status === 'wrong' ? [0, -7, 7, -5, 5, 0] : 0,
        boxShadow: allCorrect
          ? ['0 0 0 rgba(227,200,134,0)', '0 0 26px rgba(227,200,134,0.5)', '0 0 10px rgba(227,200,134,0.25)']
          : solved
          ? '0 0 18px rgba(227,200,134,0.35)'
          : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.55, delay: allCorrect ? sequence * 0.14 : 0 }}
      className={`w-full rounded-[10px] border p-[15px_18px_15px] transition-all shadow-[0_8px_18px_rgba(0,0,0,0.52)] ${
        solved
          ? 'border-gold-4 bg-ink-2/85'
          : status === 'wrong'
          ? 'border-accent-red bg-ink-2/75'
          : isOver
          ? 'border-gold-3 bg-ink-2/80'
          : 'border-gold-2/55 bg-ink-2/70'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold-3/80 bg-gradient-to-br from-gold-3/25 to-ink-3/70 px-1 font-mono text-[10px] tracking-[0.04em] text-gold-4">
          {step}
        </span>
        <div className="font-cns text-[17.5px] font-semibold text-warm-1 tracking-[0.04em]">{slot?.label}</div>
      </div>
      <div className="mt-1 pl-10 font-cns text-[11px] text-warm-3 leading-[1.4]">{slot?.description}</div>

      <div className="mt-2 h-[40px] rounded-[8px] border-[1.5px] border-dashed border-gold-2/45 px-2 py-2">
        {placed.length === 0 ? (
          <div className="text-center font-mono text-[10px] tracking-[0.22em] text-warm-4">DROP CARD HERE</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {placed.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1 border border-gold-2/50 bg-ink-3/80 px-2 py-1 font-cns text-[11px] text-warm-1"
              >
                <span style={{ color: accentHex[opt.accent] }}>
                  <Icon name={opt.icon} size={14} />
                </span>
                {opt.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function VerticalConnector() {
  return (
    <div className="relative h-8 w-px border-l-[1.5px] border-dashed border-gold-2/60">
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[8px] border-t-gold-3" />
    </div>
  );
}

function Stage5SecurityChain({
  slots,
  assignments,
  optionsById,
  correctMap,
  wrongSlotId,
  allCorrect,
}: {
  slots: GameSlot[];
  assignments: Record<string, string[]>;
  optionsById: Record<string, GameOption>;
  correctMap: Record<string, string | string[]>;
  wrongSlotId: string | null;
  allCorrect: boolean;
}) {
  const slotById = useMemo(() => {
    const m: Record<string, GameSlot> = {};
    slots.forEach((s) => (m[s.id] = s));
    return m;
  }, [slots]);

  const getPlaced = (slotId: string) => (assignments[slotId] ?? []).map((id) => optionsById[id]).filter(Boolean);
  const getStatus = (slotId: string): 'idle' | 'correct' | 'wrong' => {
    if (wrongSlotId === slotId) return 'wrong';
    const placed = getPlaced(slotId);
    return isSolved(slotId, placed, correctMap) ? 'correct' : 'idle';
  };

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-gold-3/70 bg-ink-2/65 p-5 shadow-[0_26px_70px_rgba(0,0,0,0.58),0_0_44px_rgba(201,165,90,0.08)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(227,200,134,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(227,200,134,0.08) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-20" />
      <span className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />
      <span className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />
      <span className="pointer-events-none absolute left-3 bottom-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />
      <span className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 rounded-full border border-gold-3/70 bg-gold-4/40" />

      <div className="relative z-10 space-y-3.5">
        <div className="grid grid-cols-[120px_22px_1fr_22px_1fr_22px_1fr_22px_1fr_22px_1.2fr] items-stretch gap-1.5">
          <div className="space-y-1.5">
            <div className="font-mono text-[8.5px] tracking-[0.18em] text-accent-red/85">THREAT INPUTS</div>
            {['HARMFUL PROMPT', 'JAILBREAK', 'PROMPT INJECTION'].map((risk) => (
              <div key={risk} className="border border-accent-red/60 bg-accent-red/10 px-2 py-1.5 font-mono text-[9px] tracking-[0.1em] text-accent-red">
                {risk}
              </div>
            ))}
          </div>

          <div className="grid place-items-center font-mono text-[16px] text-gold-4">▶</div>

          <SecurityBox title="用户 / 业务人员" lines={['提交 Prompt / 文档 / 请求']} />

          <div className="grid place-items-center font-mono text-[16px] text-gold-4">▶</div>

          <SecurityDropSlot
            slot={slotById['slot-a']}
            placed={getPlaced('slot-a')}
            status={getStatus('slot-a')}
            accent="purple"
            successLines={['输入已过滤', '风险已拦截', '输出受控']}
          />

          <div className="grid place-items-center font-mono text-[16px] text-gold-4">▶</div>

          <SecurityBox title="AI App / Agent Gateway / Model Router" lines={['权限 / 策略 / 路由']} />

          <div className="grid place-items-center font-mono text-[16px] text-gold-4">▶</div>

          <SecurityDropSlot
            slot={slotById['slot-b']}
            placed={getPlaced('slot-b')}
            status={getStatus('slot-b')}
            accent="green"
            successLines={['实时监控中', '异常已检测', '风险已遏制']}
          />

          <div className="grid place-items-center font-mono text-[16px] text-gold-4">▶</div>

          <RuntimeBox />
        </div>

        <svg viewBox="0 0 1000 82" className="mx-[68px] h-[46px] w-[calc(100%-136px)]">
          <g stroke="oklch(0.72 0.12 155)" strokeWidth="1.3" strokeDasharray="5 4" fill="none">
            <path d="M760 0V26H180V70" />
            <path d="M500 26V70" />
            <path d="M760 26V70" />
          </g>
          <path d="M180 70l-5-9h10z" fill="oklch(0.78 0.15 155)" />
          <path d="M500 70l-5-9h10z" fill="oklch(0.78 0.15 155)" />
          <path d="M760 70l-5-9h10z" fill="oklch(0.78 0.15 155)" />
        </svg>

        <div className="grid grid-cols-3 gap-3 px-16">
          <CloudBox cloud="AWS" model="Claude" />
          <CloudBox cloud="Google Cloud" model="Gemini" />
          <CloudBox cloud="Azure" model="OpenAI" />
        </div>

        <div className="flex items-center justify-center gap-2">
          {['SHADOW AI', '配置暴露', '数据暴露'].map((item) => (
            <span key={item} className="border border-accent-red/60 bg-accent-red/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-accent-red">
              {item}
            </span>
          ))}
        </div>

        <CBarSlot
          slot={slotById['slot-c']}
          placed={getPlaced('slot-c')}
          status={getStatus('slot-c')}
          successLines={['Workloads 已发现', '配置风险已评估', '多云边界已保护']}
        />

        <div className="flex items-center gap-3">
          <div className="rounded border border-gold-2/50 bg-ink-3/80 px-3 py-1.5 font-cns text-[11px] text-warm-1">
            用户收到最终结果
          </div>
          <div className="h-px flex-1 border-t border-dashed border-emerald/60" />
          <div className="border border-emerald/50 bg-emerald/10 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-emerald">
            A OUTPUT CHECK
          </div>
        </div>

        {allCorrect && (
          <div className="border border-gold-3/70 bg-ink-2/90 px-4 py-2 text-center font-cns text-[12.5px] text-gold-4">
            End-to-end AI security boundary established. Inputs, runtime, and multi-cloud workloads are protected.
          </div>
        )}
      </div>
    </div>
  );
}

function SecurityBox({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-[10px] border border-gold-2/55 bg-ink-2/75 p-2.5">
      <div className="font-cns text-[12px] text-gold-4 leading-[1.3]">{title}</div>
      <div className="mt-1 space-y-1">
        {lines.map((line) => (
          <div key={line} className="font-cns text-[10.5px] text-warm-3">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function CloudBox({ cloud, model }: { cloud: string; model: string }) {
  return (
    <div className="rounded-[10px] border border-gold-2/60 bg-gradient-to-b from-ink-2/90 to-ink-0/90 p-[12px_14px] text-center shadow-[0_6px_16px_rgba(0,0,0,0.5)]">
      <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-warm-1">{cloud}</div>
      <div className="mt-1 font-cns text-[16px] tracking-[0.05em] text-gold-4">{model}</div>
    </div>
  );
}

function RuntimeBox() {
  const items = ['Agent orchestration', 'RAG retrieval', 'Tool calling', 'Function call', 'Session / memory'];
  return (
    <div className="rounded-lg border border-gold-2/55 bg-ink-2/75 p-2.5">
      <div className="font-cns text-[12px] text-gold-4 leading-[1.25]">AI Runtime / Agent Runtime</div>
      <div className="mt-1.5 space-y-1">
        {items.map((item) => (
          <div key={item} className="rounded border border-gold-2/35 bg-ink-3/70 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] text-warm-2">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function CBarSlot({
  slot,
  placed,
  status,
  successLines,
}: {
  slot?: GameSlot;
  placed: GameOption[];
  status: 'idle' | 'correct' | 'wrong';
  successLines: string[];
}) {
  const slotId = slot?.id ?? 'fallback-c-slot';
  const { isOver, setNodeRef } = useDroppable({ id: slotId });
  const isCorrect = status === 'correct';

  return (
    <motion.div
      ref={setNodeRef}
      animate={status === 'wrong' ? { y: [0, -3, 3, -2, 2, 0] } : { y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-lg border px-3 py-2 ${
        isCorrect
          ? 'border-blue-300/65 bg-ink-2/90 shadow-gold-soft'
          : status === 'wrong'
          ? 'border-accent-red bg-accent-red/10'
          : isOver
          ? 'border-gold-3 bg-ink-2/80'
          : 'border-gold-2/55 bg-ink-2/75'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gold-3/70 bg-gold-4/10 font-mono text-[10px] text-gold-4">C</span>
        <div className="font-cns text-[11.5px] text-gold-4">{slot?.label}</div>
        <div className="ml-auto flex items-center gap-1">
          <span className="h-4 w-4 rounded border border-gold-2/50 bg-ink-3/70" />
          <span className="h-4 w-4 rounded border border-gold-2/50 bg-ink-3/70" />
          <span className="h-4 w-4 rounded border border-gold-2/50 bg-ink-3/70" />
        </div>
      </div>
      <div className="mt-1 font-cns text-[10.5px] text-warm-3">{slot?.description}</div>

      <div className="mt-2 min-h-[40px] rounded border border-dashed border-gold-2/45 px-2 py-1.5">
        {placed.length === 0 ? (
          <div className="text-center font-mono text-[9.5px] tracking-[0.16em] text-warm-4">DROP CARD HERE</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {placed.map((opt) => (
              <span key={opt.id} className="inline-flex items-center gap-1 border border-gold-2/50 bg-ink-3/80 px-2 py-1 font-cns text-[10.5px] text-warm-1">
                <span style={{ color: accentHex[opt.accent] }}><Icon name={opt.icon} size={13} /></span>
                {opt.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {isCorrect && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {successLines.map((line) => (
            <span key={line} className="border border-gold-2/45 bg-ink-3/75 px-1.5 py-0.5 font-cns text-[9.5px] text-warm-2">
              {line}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SecurityDropSlot({
  slot,
  placed,
  status,
  accent,
  successLines,
  horizontal,
}: {
  slot?: GameSlot;
  placed: GameOption[];
  status: 'idle' | 'correct' | 'wrong';
  accent: 'purple' | 'green' | 'blue';
  successLines: string[];
  horizontal?: boolean;
}) {
  const slotId = slot?.id ?? 'fallback-security-slot';
  const { isOver, setNodeRef } = useDroppable({ id: slotId });
  const isCorrect = status === 'correct';
  const accentClass = accent === 'purple' ? 'border-purple-300/60' : accent === 'green' ? 'border-emerald/60' : 'border-blue-300/60';
  const slotLetter = (slot?.label?.match(/([ABC])/i)?.[1] ?? '').toUpperCase();

  return (
    <motion.div
      ref={setNodeRef}
      animate={status === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-[10px] border-[1.5px] p-3 ${horizontal ? 'mt-1' : ''} ${
        isCorrect
          ? `${accentClass} bg-ink-2/90 shadow-gold-soft`
          : status === 'wrong'
          ? 'border-accent-red bg-accent-red/10'
          : isOver
          ? 'border-gold-3 bg-ink-2/80'
          : 'border-gold-2/55 bg-ink-2/75'
      }`}
    >
      <div className="mx-auto grid h-[46px] w-[46px] place-items-center rounded-full border border-gold-4 bg-gradient-to-br from-gold-4 to-gold-2 text-[20px] font-semibold text-ink-0 shadow-[0_0_16px_rgba(201,165,90,0.55)]">
        {slotLetter}
      </div>
      <div className="mt-2 font-cns text-[12px] font-semibold text-warm-1 leading-[1.25] text-center">{slot?.label}</div>
      <div className="mt-1 font-cns text-[10.5px] text-warm-3">{slot?.description}</div>

      <div className="mt-2 min-h-[42px] rounded border border-dashed border-gold-2/45 px-2 py-1.5">
        {placed.length === 0 ? (
          <div className="text-center font-mono text-[9.5px] tracking-[0.16em] text-warm-4">DROP CARD HERE</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {placed.map((opt) => (
              <span key={opt.id} className="inline-flex items-center gap-1 border border-gold-2/50 bg-ink-3/80 px-2 py-1 font-cns text-[10.5px] text-warm-1">
                <span style={{ color: accentHex[opt.accent] }}><Icon name={opt.icon} size={13} /></span>
                {opt.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {isCorrect && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {successLines.map((line) => (
            <span key={line} className="border border-gold-2/45 bg-ink-3/75 px-1.5 py-0.5 font-cns text-[9.5px] text-warm-2">
              {line}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Stage1Pipeline({
  assignments,
  optionsById,
  correctMap,
  wrongSlotId,
}: {
  assignments: Record<string, string[]>;
  optionsById: Record<string, GameOption>;
  correctMap: Record<string, string | string[]>;
  wrongSlotId: string | null;
}) {
  const q1Placed = (assignments['slot-legacy-assessment'] ?? []).map((id) => optionsById[id]).filter(Boolean);
  const q2Placed = (assignments['slot-app-modernization'] ?? []).map((id) => optionsById[id]).filter(Boolean);
  const q1Solved = isSolved('slot-legacy-assessment', q1Placed, correctMap);
  const q2Solved = isSolved('slot-app-modernization', q2Placed, correctMap);

  const q1Status: 'idle' | 'correct' | 'wrong' = wrongSlotId === 'slot-legacy-assessment' ? 'wrong' : q1Solved ? 'correct' : 'idle';
  const q2Status: 'idle' | 'correct' | 'wrong' = wrongSlotId === 'slot-app-modernization' ? 'wrong' : q2Solved ? 'correct' : 'idle';

  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 items-stretch">
      <PipelineNode>
        <div className="font-cns text-[14px] text-gold-4 font-medium mb-2">Legacy Systems Map / 老旧系统版图</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {['商品目录', '价格', '库存', '订单', '门店', '电商'].map((name) => (
            <div key={name} className="border border-gold-2/35 px-2 py-1.5 text-warm-2 bg-ink-2/70">{name}</div>
          ))}
        </div>
      </PipelineNode>

      <PipelineArrow active />

      <Stage1QuestionNode
        slotId="slot-legacy-assessment"
        title="问题 1：先看清旧系统"
        description="我们不知道有哪些老旧应用，也不知道该先改哪些系统。"
        placed={q1Placed}
        status={q1Status}
        chips={q1Solved ? ['发现应用版图', '梳理依赖关系', '评估迁移就绪度', '识别现代化优先级'] : []}
      />

      <PipelineArrow active={q1Solved} />

      <PipelineNode dim={!q1Solved}>
        <div className="font-cns text-[14px] text-gold-4 font-medium mb-2">Modernization Backlog / 现代化待办</div>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {['Java App', '.NET App', '依赖过旧', '漏洞风险', 'Build 问题', '测试不足', '需要容器化'].map((tag) => (
            <span key={tag} className="border border-gold-2/35 px-2 py-1 text-warm-2 bg-ink-2/70">{tag}</span>
          ))}
        </div>
      </PipelineNode>

      <PipelineArrow active={q1Solved} />

      <Stage1QuestionNode
        slotId="slot-app-modernization"
        title="问题 2：再现代化关键应用"
        description="关键 Java / .NET 应用过旧，存在依赖、漏洞、Build、测试与容器化问题，Agent 无法安全接入。"
        placed={q2Placed}
        status={q2Status}
        locked={!q1Solved}
        chips={q2Solved ? ['代码评估', '框架升级', '修复 Build / CVE', '生成测试', '容器化'] : []}
      />

      <PipelineArrow active={q2Solved} />

      <PipelineNode dim={!q2Solved} glow={q2Solved}>
        <div className="font-cns text-[15px] text-gold-4 font-medium mb-2">Cloud-ready / Agent-ready Platform</div>
        <div className="text-[13px] text-warm-2 leading-[1.6]">
          关键系统已完成 assessment 与 modernization，可进入安全 Agent 集成阶段。
        </div>
      </PipelineNode>
    </div>
  );
}

function Stage1QuestionNode({
  slotId,
  title,
  description,
  placed,
  status,
  locked,
  chips,
}: {
  slotId: string;
  title: string;
  description: string;
  placed: GameOption[];
  status: 'idle' | 'correct' | 'wrong';
  locked?: boolean;
  chips: string[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: slotId, disabled: locked });
  const solved = status === 'correct';

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border p-3 min-h-[230px] transition-all ${
        solved
          ? 'border-gold-4 shadow-gold-glow bg-ink-2/80'
          : status === 'wrong'
          ? 'border-accent-red bg-ink-2/70'
          : locked
          ? 'border-gold-2/20 bg-ink-2/30 opacity-60'
          : isOver
          ? 'border-gold-4 shadow-gold-soft bg-ink-2/75'
          : 'border-gold-2/50 bg-ink-2/65'
      }`}
    >
      <div className="font-cns text-[14px] text-gold-4 font-medium">{title}</div>
      <div className="mt-1.5 font-cns text-[12px] text-warm-3 leading-[1.5]">{description}</div>

      <div className="mt-3 border border-dashed border-gold-2/45 rounded px-2 py-2 min-h-[48px]">
        {placed.length === 0 ? (
          <div className="font-mono text-[10px] tracking-[0.22em] text-warm-4 text-center">DROP CARD HERE</div>
        ) : (
          <div className="flex flex-col gap-2">
            {placed.map((opt) => (
              <div key={opt.id} className="border border-gold-2/45 bg-ink-3/80 px-2 py-1.5 font-cns text-[12px] text-warm-1">
                {opt.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span key={chip} className="border border-gold-2/50 px-2 py-1 bg-ink-3/70 text-[11px] text-warm-2">
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PipelineNode({
  children,
  dim,
  glow,
}: {
  children: ReactNode;
  dim?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 min-h-[230px] bg-ink-2/65 transition-all ${
        glow
          ? 'border-gold-4 shadow-gold-glow'
          : dim
          ? 'border-gold-2/25 opacity-60'
          : 'border-gold-2/50'
      }`}
    >
      {children}
    </div>
  );
}

function PipelineArrow({ active = false }: { active?: boolean }) {
  return (
    <div className="flex items-center justify-center px-1">
      <span className={`font-mono text-[18px] ${active ? 'text-gold-4' : 'text-warm-4/60'}`}>→</span>
    </div>
  );
}

function isSolved(slotId: string, placed: GameOption[], correctMap: Record<string, string | string[]>) {
  const c = correctMap[slotId];
  const need = Array.isArray(c) ? c : c ? [c] : [];
  return need.length > 0 && need.every((id) => placed.some((p) => p.id === id));
}

function getStage1Feedback(slotId: string, optionId: string): string {
  if (slotId === 'slot-legacy-assessment' && optionId === 'teams') {
    return 'Teams 是协作入口，但现在还没看清旧系统版图，不能先接入口。';
  }
  if (slotId === 'slot-legacy-assessment' && optionId === 'power-bi') {
    return 'Power BI 适合分析数据，但这一关第一步是应用发现与依赖评估。';
  }
  if (slotId === 'slot-app-modernization' && optionId === 'defender-cloud') {
    return 'Defender for Cloud 能保护云环境，但关键应用本身仍需要先完成现代化。';
  }
  return '请根据转型流程，将最匹配当前步骤的能力拖入对应槽位。';
}

/**
 * Fisher–Yates shuffle seeded by a string key so the order is randomized
 * per stage but stable across renders / reloads of that same stage.
 */
function shuffleStable<T>(items: T[], seedKey: string): T[] {
  const arr = items.slice();
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0;
  }
  const rand = () => {
    // mulberry32
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
