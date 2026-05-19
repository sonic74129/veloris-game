import { useState, useEffect, useCallback } from 'react';
import { CharacterLayer } from '../character/CharacterLayer';
import { StageHeader } from '../layout/StageHeader';
import { PuzzleBoard } from '../gameplay/PuzzleBoard';
import { StageCompleteOverlay } from '../gameplay/StageCompleteOverlay';
import { StoryBriefOverlay } from './StoryBriefOverlay';
import { StageRightPanel } from './StageRightPanel';
import type { StageConfig, StageId } from '../../data/types';
import { useGameState, STAGE_ORDER, PUZZLE_STAGES } from '../../hooks/useGameState';
import { packs } from '../../data';
import { useMobile } from '../../lib/mobile';
import type { StageScore } from '../../lib/scoring';

interface Props { stage: StageConfig; slotsLayout?: 'horizontal' | 'vertical' }

const ADVISOR_BY_STAGE: Partial<Record<StageId, 'kinky' | 'lily'>> = {
  stage1: 'kinky',
  stage2: 'lily',
  stage3: 'kinky',
  stage4: 'lily',
  stage5: 'kinky',
};

export function DragMatchStage({ stage, slotsLayout = 'horizontal' }: Props) {
  const language = useGameState((s) => s.language);
  const completeStage = useGameState((s) => s.completeStage);
  const resetStage = useGameState((s) => s.resetStage);
  const goToStage = useGameState((s) => s.goToStage);
  const peekStage = useGameState((s) => s.peekStage);
  const completed = useGameState((s) => s.completedStages);
  const startStageRun = useGameState((s) => s.startStageRun);
  const currentRunStageId = useGameState((s) => s.currentRun?.stageId ?? null);
  const recordWrongAttempt = useGameState((s) => s.recordWrongAttempt);
  const finishStageRun = useGameState((s) => s.finishStageRun);
  const viewedStoryBriefs = useGameState((s) => s.viewedStoryBriefs);
  const activeStoryBriefStageId = useGameState((s) => s.activeStoryBriefStageId);
  const openStoryBriefOverlay = useGameState((s) => s.openStoryBriefOverlay);
  const closeStoryBriefOverlay = useGameState((s) => s.closeStoryBriefOverlay);
  const markStoryBriefViewed = useGameState((s) => s.markStoryBriefViewed);
  const ui = packs[language].ui;

  const isMobile = useMobile();
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastScore, setLastScore] = useState<StageScore | null>(null);
  const [showOptionDescriptions, setShowOptionDescriptions] = useState(false);
  const wasCompleted = completed.includes(stage.id);
  const advisor: 'kinky' | 'lily' = ADVISOR_BY_STAGE[stage.id] ?? 'kinky';
  const isStoryBriefOpen = activeStoryBriefStageId === stage.id;

  useEffect(() => {
    setShowOptionDescriptions(false);
  }, [stage.id]);

  useEffect(() => {
    if (viewedStoryBriefs[stage.id]) return;
    openStoryBriefOverlay(stage.id);
  }, [stage.id, viewedStoryBriefs, openStoryBriefOverlay]);

  // Start timer when stage mounts
  useEffect(() => {
    if (!wasCompleted && !isStoryBriefOpen && currentRunStageId !== stage.id) {
      startStageRun(stage.id);
    }
  }, [stage.id, wasCompleted, isStoryBriefOpen, currentRunStageId, startStageRun]);

  const handleEnterStage = () => {
    markStoryBriefViewed(stage.id);
    closeStoryBriefOverlay();
  };

  const handleComplete = () => {
    if (!wasCompleted) {
      const score = finishStageRun();
      setLastScore(score);
      completeStage(stage.id);
      setShowOverlay(true);
    }
  };

  const handleWrong = () => {
    recordWrongAttempt();
  };

  const handleNext = useCallback(() => {
    setShowOverlay(false);
    const idx = STAGE_ORDER.indexOf(stage.id);
    const nextId = STAGE_ORDER[idx + 1] as StageId | undefined;
    if (nextId) goToStage(nextId);
  }, [stage.id, goToStage]);

  const knowledgeHint =
    stage.knowledgePoints && stage.knowledgePoints.length > 0
      ? stage.knowledgePoints.map((p) => `${p.title}：${p.body}`).join('\n')
      : stage.hint ?? '';

  // Puzzle stage navigation
  const puzzleIdx = PUZZLE_STAGES.indexOf(stage.id);
  const prevStage = puzzleIdx > 0 ? PUZZLE_STAGES[puzzleIdx - 1] : null;
  const nextStage = puzzleIdx < PUZZLE_STAGES.length - 1 ? PUZZLE_STAGES[puzzleIdx + 1] : null;

  return (
    <>
      <CharacterLayer
        variant="side"
        lead={advisor}
      />

      <div className={`absolute flex gap-6 ${
        isMobile
          ? 'top-[55px] left-[280px] right-[30px] bottom-[75px]'
          : 'top-[100px] left-[370px] right-[60px] bottom-[90px]'
      }`}>
        {/* Center column: header + slots + options */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <StageHeader
              eyebrow={`SCENE · 0${stage.stageNumber} · STAGE`}
              title={stage.title}
              subtitle={stage.subtitle}
            />
            <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
              {prevStage && (
                <button
                  onClick={() => peekStage(prevStage)}
                  className="font-mono text-[10px] tracking-[0.28em] text-warm-3
                             hover:text-gold-4 border border-warm-4 hover:border-gold-3
                             px-3 py-1.5 rounded transition-colors"
                >
                  ← 上一题
                </button>
              )}
              {nextStage && (
                <button
                  onClick={() => peekStage(nextStage)}
                  className="font-mono text-[10px] tracking-[0.28em] text-warm-3
                             hover:text-gold-4 border border-warm-4 hover:border-gold-3
                             px-3 py-1.5 rounded transition-colors"
                >
                  下一题 →
                </button>
              )}
              <button
                onClick={() => resetStage(stage.id)}
                className="font-mono text-[10px] tracking-[0.28em] text-warm-3
                           hover:text-gold-4 border border-warm-4 hover:border-gold-3
                           px-3 py-1.5 rounded transition-colors"
              >
                ↻ {ui.buttons.reset}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <PuzzleBoard
              stage={stage}
              slotsLayout={slotsLayout}
              onComplete={handleComplete}
              onWrong={handleWrong}
              showOptionDescriptions={showOptionDescriptions}
            />
          </div>
        </div>

        <StageRightPanel
          stage={stage}
          challengeTitle={ui.panels.challenge}
          missionTitle={ui.panels.mission}
          advisor={advisor}
          hintText={knowledgeHint}
          onRevealHint={() => setShowOptionDescriptions(true)}
          onReplayBrief={() => openStoryBriefOverlay(stage.id)}
        />
      </div>

      <StoryBriefOverlay
        show={isStoryBriefOpen}
        stageNumber={stage.stageNumber ?? 1}
        stageTitle={stage.title}
        storyBrief={stage.storyBrief ?? stage.storyBackgroundShort ?? ''}
        onEnterStage={handleEnterStage}
      />

      <StageCompleteOverlay
        show={showOverlay}
        stageScore={lastScore}
        stageNumber={stage.stageNumber ?? 1}
        completionTitle={stage.completionTitle}
        completionMessage={stage.completionMessage}
        completionButtonLabel={stage.completionButtonLabel}
        onNext={handleNext}
      />
    </>
  );
}
