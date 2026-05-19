import { useState, useEffect, useCallback } from 'react';
import { CharacterLayer } from '../character/CharacterLayer';
import { StageHeader } from '../layout/StageHeader';
import { ChallengeCard } from '../panels/ChallengeCard';
import { MissionPanel } from '../panels/MissionPanel';
import { KnowledgePanel } from '../panels/KnowledgePanel';
import { InteractiveHintPanel } from '../gameplay/InteractiveHintPanel';
import { PuzzleBoard } from '../gameplay/PuzzleBoard';
import { StageCompleteOverlay } from '../gameplay/StageCompleteOverlay';
import type { StageConfig, StageId } from '../../data/types';
import { useGameState, STAGE_ORDER } from '../../hooks/useGameState';
import { packs } from '../../data';
import { useMobile } from '../../lib/mobile';
import type { StageScore } from '../../lib/scoring';

interface Props { stage: StageConfig; slotsLayout?: 'horizontal' | 'vertical' }

export function DragMatchStage({ stage, slotsLayout = 'horizontal' }: Props) {
  const language = useGameState((s) => s.language);
  const completeStage = useGameState((s) => s.completeStage);
  const resetStage = useGameState((s) => s.resetStage);
  const goToStage = useGameState((s) => s.goToStage);
  const completed = useGameState((s) => s.completedStages);
  const startStageRun = useGameState((s) => s.startStageRun);
  const recordWrongAttempt = useGameState((s) => s.recordWrongAttempt);
  const finishStageRun = useGameState((s) => s.finishStageRun);
  const ui = packs[language].ui;

  const isMobile = useMobile();
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastScore, setLastScore] = useState<StageScore | null>(null);
  const wasCompleted = completed.includes(stage.id);

  // Start timer when stage mounts
  useEffect(() => {
    if (!wasCompleted) {
      startStageRun(stage.id);
    }
  }, [stage.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Generate hint text for Kinky and Lily based on stage hint
  const hintText = stage.hint ?? '仔细观察每个选项的描述，找出与问题的对应关系。';
  const kinkyHint = `好啦 CTO，放轻松一点。${hintText}`;
  const lilyHint = `从架构角度想 — ${hintText}`;

  return (
    <>
      <CharacterLayer
        variant="side"
        lead={(stage.stageNumber ?? 1) % 2 === 1 ? 'kinky' : 'lily'}
      />

      <div className={`absolute flex gap-6 ${
        isMobile
          ? 'top-[55px] left-[280px] right-[30px] bottom-[52px]'
          : 'top-[100px] left-[370px] right-[60px] bottom-[90px]'
      }`}>
        {/* Center column: header + slots + options */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex items-end justify-between">
            <StageHeader
              eyebrow={`SCENE · 0${stage.stageNumber} · STAGE`}
              title={stage.title}
              subtitle={stage.subtitle}
            />
            <button
              onClick={() => resetStage(stage.id)}
              className="font-mono text-[10px] tracking-[0.28em] text-warm-3
                         hover:text-gold-4 border border-warm-4 hover:border-gold-3
                         px-3 py-1.5 rounded transition-colors"
            >
              ↻ {ui.buttons.reset}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <PuzzleBoard stage={stage} slotsLayout={slotsLayout} onComplete={handleComplete} onWrong={handleWrong} />
          </div>
        </div>

        {/* Right column: challenge + mission + knowledge + hint */}
        <div className="w-[340px] flex flex-col gap-3 overflow-y-auto pr-1">
          {stage.challenge && (
            <ChallengeCard
              title={ui.panels.challenge}
              body={stage.challenge.body}
              speaker={stage.challenge.speaker}
            />
          )}
          {stage.missionObjectives && (
            <MissionPanel title={ui.panels.mission} objectives={stage.missionObjectives} />
          )}
          {stage.knowledgePoints && stage.knowledgePoints.length > 0 && (
            <KnowledgePanel title={ui.panels.knowledge} points={stage.knowledgePoints} />
          )}
          {/* Interactive hint panel with Kinky + Lily buttons */}
          <InteractiveHintPanel
            stageId={stage.id}
            kinkyHint={kinkyHint}
            lilyHint={lilyHint}
          />
        </div>
      </div>

      <StageCompleteOverlay
        show={showOverlay}
        stageScore={lastScore}
        stageNumber={stage.stageNumber ?? 1}
        onNext={handleNext}
      />
    </>
  );
}
