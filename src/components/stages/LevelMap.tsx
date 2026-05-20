import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CharacterLayer } from '../character/CharacterLayer';
import { SingleFileVoiceoverPlayer } from '../voiceover/SingleFileVoiceoverPlayer';
import { MAP_VOICEOVER_ZH } from '../../data/voiceovers/scene0';
import { Scene2CinematicIntro, type CinematicPhase } from './Scene2CinematicIntro';
import type { StageId } from '../../data/types';
import { useGameState, STAGE_ORDER } from '../../hooks/useGameState';
import { packs } from '../../data';
import { useMobile } from '../../lib/mobile';

const MAP_NODES: { id: StageId; title: string; subtitle: string }[] = [
  { id: 'stage1', title: 'Agent-Ready Application', subtitle: '现代化关键 Java / .NET 应用，让 Agent 可安全接入' },
  { id: 'stage2', title: 'Microsoft IQ',            subtitle: '让 Agent 不只接上系统，更懂人、懂业务、懂知识' },
  { id: 'stage3', title: 'AI-Ready Data',           subtitle: '统一数据底座与业务语义，让 Data Agent 真正变聪明' },
  { id: 'stage4', title: 'Foundry',                 subtitle: '把分散的 Agent、模型与治理整理成企业级 AI 平台' },
  { id: 'stage5', title: 'Defender for AI',         subtitle: '保护 Prompt、侦测 AI Runtime 风险、发现跨云 AI 工作负载' },
];

export function LevelMap() {
  const language = useGameState((s) => s.language);
  const unlocked = useGameState((s) => s.unlockedStages);
  const completed = useGameState((s) => s.completedStages);
  const currentId = useGameState((s) => s.currentStageId);
  const goToStage = useGameState((s) => s.goToStage);
  const pack = packs[language];
  const stage = pack.stages.find((s) => s.id === 'map')!;
  const ui = pack.ui;

  const isMobile = useMobile();
  const progress = Math.round((completed.filter((c) => c.startsWith('stage')).length / 5) * 100);
  const nextStage = STAGE_ORDER.find((id) => id.startsWith('stage') && !completed.includes(id)) ?? 'stage1';

  // Cinematic intro — plays only on first visit (no stages completed = fresh entry)
  const isFirstVisit = completed.filter((c) => c.startsWith('stage')).length === 0;
  const [cinematicTriggered] = useState(isFirstVisit);
  const [cinematicPhase, setCinematicPhase] = useState<CinematicPhase>(isFirstVisit ? 'idle' : 'done');

  const handleCinematicComplete = useCallback(() => {
    setCinematicPhase('done');
  }, []);

  // Voiceover starts after video finishes (cinematicPhase==='done'), with 1s delay
  const [voiceoverReady, setVoiceoverReady] = useState(!isFirstVisit);
  useEffect(() => {
    if (!isFirstVisit) return;
    // Clear the voiceover played flag so it always autoplays on first visit
    localStorage.removeItem('veloris:vo:map:played');
  }, [isFirstVisit]);
  useEffect(() => {
    if (!isFirstVisit && voiceoverReady) return;
    if (cinematicPhase !== 'done') return;
    const timer = setTimeout(() => setVoiceoverReady(true), 1000);
    return () => clearTimeout(timer);
  }, [cinematicPhase, isFirstVisit, voiceoverReady]);

  // Characters hidden while video is visible (playing or freezing)
  const showCharacters = cinematicPhase === 'done';

  return (
    <>
      {/* Video — at Kinky/Lily position, behind everything (z-1) */}
      <Scene2CinematicIntro
        trigger={cinematicTriggered}
        onComplete={handleCinematicComplete}
      />

      {/* Static characters — fade in when video ends; hidden on mobile to free up space */}
      {!isMobile && (
        <div style={{ opacity: showCharacters ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          <CharacterLayer miranda={false} advisors="large" />
        </div>
      )}

      {/* Header */}
      <div className={`absolute right-[40px] z-[6] ${
        isMobile ? 'top-[55px] left-[40px]' : 'top-[100px] left-[60px]'
      }`}>
        <div className="eyebrow">SCENE · 02 · MICROSOFT ADVISORY</div>
        <div className="font-cn text-[40px] tracking-[0.1em] text-warm-1 leading-tight mt-1">
          {stage.title}
        </div>
        <div className="font-brand text-[12px] tracking-[0.36em] text-gold-3 mt-3">
          CTO · FIVE CHALLENGES · MICROSOFT SOLUTION
        </div>
        <div className="font-cns text-[13px] text-warm-2 mt-2 max-w-[860px]">
          {stage.subtitle}
        </div>
      </div>

      {/* Stats */}
      {!isMobile && (
      <div className="absolute right-[60px] top-[260px] w-[260px] flex flex-col gap-3 z-[6]">
        <div className="glass p-4 frame-corners relative">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-2">{ui.mapSide.progress}</div>
          <div className="flex items-end gap-2 mb-2">
            <div className="font-brand text-[34px] text-gold-4 leading-none">{progress}</div>
            <div className="font-mono text-[11px] text-warm-3 pb-1.5">%</div>
          </div>
          <div className="h-1 bg-ink-3 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-3 to-gold-5"
                 style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="glass p-4 frame-corners relative">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-1.5">{ui.mapSide.stage}</div>
          <div className="font-brand text-[20px] text-warm-1">
            {completed.filter((c) => c.startsWith('stage')).length} / 5
          </div>
        </div>
        <div className="glass p-4 frame-corners relative">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-1.5">{ui.mapSide.nextReward}</div>
          <div className="font-cns text-[12px] text-gold-4">高阶影响力 +10</div>
        </div>
      </div>
      )}

      {/* Speech bubble — voiceover (delayed 2s on first visit) */}
      {language === 'zh' && voiceoverReady && (
        <div className="absolute z-[7]" style={{ left: 60, top: isMobile ? 200 : 295, width: isMobile ? 400 : 560 }}>
          <SingleFileVoiceoverPlayer voiceover={MAP_VOICEOVER_ZH} speechBubble forcePlay={isFirstVisit} />
        </div>
      )}

      {/* Stage nodes */}
      <div className={`absolute z-[6] overflow-y-auto ${
        isMobile
          ? 'left-[20px] right-[20px] top-[200px] bottom-[75px]'
          : 'left-[60px] right-[60px] bottom-[110px]'
      }`}>
        <div className={`grid gap-3 relative ${isMobile ? 'grid-cols-2' : 'grid-cols-5'}`}>
          <div className="absolute top-[60px] left-[4%] right-[4%] h-px
                          bg-gradient-to-r from-transparent via-gold-2 to-transparent" />
          {MAP_NODES.map((node, idx) => {
            const isUnlocked = unlocked.includes(node.id);
            const isDone = completed.includes(node.id);
            const isCurrent = currentId === node.id;
            return (
              <motion.button
                key={node.id}
                whileHover={isUnlocked ? { y: -4 } : {}}
                disabled={!isUnlocked}
                onClick={() => goToStage(node.id)}
                className={`relative flex flex-col items-center pt-[28px] pb-3 px-3 rounded-lg
                            border transition-all backdrop-blur-sm
                            ${isDone
                              ? 'border-gold-4 bg-ink-2/80 shadow-gold-soft'
                              : isCurrent
                              ? 'border-gold-4 bg-ink-2/80 animate-glow'
                              : isUnlocked
                              ? 'border-gold-2 bg-ink-2/70 hover:border-gold-3 cursor-pointer'
                              : 'border-warm-4 bg-ink-1/60 opacity-55 cursor-not-allowed'}`}
              >
                <div
                  className={`absolute -top-[28px] w-[56px] h-[56px] rounded-full
                              flex items-center justify-center border-2 z-10
                              ${isDone
                                ? 'bg-gold-3 border-gold-5 text-ink-0'
                                : isCurrent
                                ? 'bg-ink-2 border-gold-4 text-gold-4'
                                : isUnlocked
                                ? 'bg-ink-2 border-gold-2 text-gold-3'
                                : 'bg-ink-1 border-warm-4 text-warm-3'}`}
                >
                  {isDone ? '✓' : isUnlocked ? (
                    <span className="font-brand text-[16px]">0{idx + 1}</span>
                  ) : (
                    <LockIcon />
                  )}
                </div>
                <div className="font-cns text-[16px] text-warm-1 font-medium text-center mt-1">
                  {node.title}
                </div>
                <div className="font-cns text-[13px] text-warm-2 text-center mt-1 leading-tight">
                  {node.subtitle}
                </div>
                <div className="font-mono text-[11px] tracking-[0.28em] text-gold-4 mt-2">
                  ISSUE · 0{idx + 1}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => goToStage(nextStage)}
            className={`bg-gold-3 hover:bg-gold-4 text-ink-0
                       font-cns font-medium tracking-[0.24em] text-[13px] px-10 py-3.5
                       shadow-gold-glow transition-colors`}
          >
            开始第 {nextStage.replace('stage', '')} 关 →
          </motion.button>
        </div>
      </div>
    </>
  );
}

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="5" y="11" width="14" height="10" rx="1.5" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);
