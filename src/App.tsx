import { useEffect, useState } from 'react';
import { GameShell } from './components/layout/GameShell';
import { TitleScreen } from './components/stages/TitleScreen';
import { MissionBriefing } from './components/stages/MissionBriefing';
import { LevelMap } from './components/stages/LevelMap';
import { DragMatchStage } from './components/stages/DragMatchStage';
import { ComingSoonStage } from './components/stages/ComingSoonStage';
import { RotatePrompt } from './components/layout/RotatePrompt';
import { useGameState } from './hooks/useGameState';
import { packs } from './data';

function usePortraitMobile() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIs(w < 820 && h > w);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);
  return is;
}

export default function App() {
  const language = useGameState((s) => s.language);
  const currentStageId = useGameState((s) => s.currentStageId);
  const isPortrait = usePortraitMobile();
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

  /* Portrait mobile: always show rotate prompt regardless of stage */
  if (isPortrait) return <RotatePrompt />;

  /* Title screen bypasses GameShell canvas — renders full-viewport directly */
  if (currentStageId === 'title') {
    return <TitleScreen />;
  }

  return <GameShell>{render()}</GameShell>;
}
