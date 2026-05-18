import { useState } from 'react';
import { CharacterLayer } from '../character/CharacterLayer';
import { StageHeader } from '../layout/StageHeader';
import { ChallengeCard } from '../panels/ChallengeCard';
import { MissionPanel } from '../panels/MissionPanel';
import { KnowledgePanel } from '../panels/KnowledgePanel';
import { HintPanel } from '../panels/HintPanel';
import { PuzzleBoard } from '../gameplay/PuzzleBoard';
import { StageCompleteModal } from '../gameplay/StageCompleteModal';
import type { StageConfig, StageId } from '../../data/types';
import { useGameState, STAGE_ORDER } from '../../hooks/useGameState';
import { packs } from '../../data';
import { useMobile } from '../../lib/mobile';

interface Props { stage: StageConfig; slotsLayout?: 'horizontal' | 'vertical' }

export function DragMatchStage({ stage, slotsLayout = 'horizontal' }: Props) {
  const language = useGameState((s) => s.language);
  const completeStage = useGameState((s) => s.completeStage);
  const resetStage = useGameState((s) => s.resetStage);
  const goToStage = useGameState((s) => s.goToStage);
  const completed = useGameState((s) => s.completedStages);
  const ui = packs[language].ui;

  const isMobile = useMobile();
  const [showModal, setShowModal] = useState(false);
  const wasCompleted = completed.includes(stage.id);

  const handleComplete = () => {
    if (!wasCompleted) {
      completeStage(stage.id);
      setShowModal(true);
    } else if (!showModal) {
      // re-completion after reset
      setShowModal(true);
    }
  };

  const handleNext = () => {
    setShowModal(false);
    const idx = STAGE_ORDER.indexOf(stage.id);
    const nextId = STAGE_ORDER[idx + 1] as StageId | undefined;
    if (nextId) goToStage(nextId);
  };

  return (
    <>
      <CharacterLayer variant="side" advisors="small" />

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
            <PuzzleBoard stage={stage} slotsLayout={slotsLayout} onComplete={handleComplete} />
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
          {stage.hint && <HintPanel title={ui.panels.hint} body={stage.hint} />}
        </div>
      </div>

      <StageCompleteModal
        show={showModal}
        title={ui.modal.title}
        body={ui.modal.body}
        nextLabel={ui.modal.nextStage}
        onNext={handleNext}
      />
    </>
  );
}
