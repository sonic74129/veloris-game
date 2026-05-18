import { CharacterLayer } from '../character/CharacterLayer';
import { StageHeader } from '../layout/StageHeader';
import type { StageConfig } from '../../data/types';
import { useGameState } from '../../hooks/useGameState';
import { useMobile } from '../../lib/mobile';
import { packs } from '../../data';

interface Props { stage: StageConfig }

export function ComingSoonStage({ stage }: Props) {
  const language = useGameState((s) => s.language);
  const goToStage = useGameState((s) => s.goToStage);
  const ui = packs[language].ui;
  const isMobile = useMobile();

  return (
    <>
      {!isMobile && <CharacterLayer variant="side" advisors="small" />}
      <div className={`absolute top-[110px] right-[60px] bottom-[100px] flex flex-col ${isMobile ? 'left-[40px]' : 'left-[370px]'}`}>
        <StageHeader
          eyebrow={`SCENE · 0${stage.stageNumber} · STAGE`}
          title={stage.title}
          subtitle={stage.subtitle}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass frame-corners relative p-12 text-center max-w-[560px]">
            <span className="c-tl" /><span className="c-br" />
            <div className="eyebrow mb-4">COMING SOON</div>
            <div className="font-cn text-[28px] text-gold-4 mb-3">本关正在打磨</div>
            <div className="font-cns text-[13px] text-warm-2 leading-relaxed mb-8">
              本关 (Stage {stage.stageNumber}) 正在工坊中精雕细琢。<br/>
              MVP 阶段开放第 1 关与第 2 关，后续关卡将陆续登场。
            </div>
            <button
              onClick={() => goToStage('map')}
              className="px-8 py-3 border border-gold-3 hover:bg-gold-3 hover:text-ink-0
                         text-gold-4 font-cns tracking-[0.22em] text-[12px] transition-colors"
            >
              {ui.buttons.backToMap}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
