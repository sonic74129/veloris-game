import { GameShell } from './components/layout/GameShell';
import { TitleScreen } from './components/stages/TitleScreen';
import { MissionBriefing } from './components/stages/MissionBriefing';
import { LevelMap } from './components/stages/LevelMap';
import { DragMatchStage } from './components/stages/DragMatchStage';
import { ComingSoonStage } from './components/stages/ComingSoonStage';
import { useGameState } from './hooks/useGameState';
import { packs } from './data';

export default function App() {
  const language = useGameState((s) => s.language);
  const currentStageId = useGameState((s) => s.currentStageId);
  const pack = packs[language];
  const stage = pack.stages.find((s) => s.id === currentStageId) ?? pack.stages[0];

  const render = () => {
    if (stage.comingSoon) return <ComingSoonStage stage={stage} />;
    switch (stage.type) {
      case 'title':              return <TitleScreen />;
      case 'briefing':           return <MissionBriefing stage={stage} />;
      case 'map':                return <LevelMap />;
      case 'drag-match':         return <DragMatchStage stage={stage} />;
      case 'architecture-fill':  return <DragMatchStage stage={stage} slotsLayout="vertical" />;
      case 'safety-boundary':    return <DragMatchStage stage={stage} slotsLayout="vertical" />;
      default:                   return null;
    }
  };

  return <GameShell hideHud={currentStageId === 'title'}>{render()}</GameShell>;
}
