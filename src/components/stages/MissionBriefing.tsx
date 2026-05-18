import { motion } from 'framer-motion';
import { ChallengeCard } from '../panels/ChallengeCard';
import { MissionPanel } from '../panels/MissionPanel';
import { CharacterLayer } from '../character/CharacterLayer';
import { StageHeader } from '../layout/StageHeader';
import type { StageConfig } from '../../data/types';
import { useGameState } from '../../hooks/useGameState';
import { packs } from '../../data';

interface Props { stage: StageConfig }

export function MissionBriefing({ stage }: Props) {
  const language = useGameState((s) => s.language);
  const goToStage = useGameState((s) => s.goToStage);
  const ui = packs[language].ui;

  return (
    <>
      <CharacterLayer variant="left-large" />

      <div className="absolute left-[540px] top-[110px] right-[60px] bottom-[100px] flex gap-8">
        {/* Center: header + challenge */}
        <div className="flex-1 flex flex-col gap-5">
          <StageHeader
            eyebrow="SCENE · 00"
            title={stage.title}
            brandLine="MIRANDA'S CHALLENGE — MISSION BRIEFING"
            subtitle={stage.subtitle}
          />
          <div className="mt-2">
            <ChallengeCard
              title={ui.panels.challenge}
              body={stage.challenge?.body ?? ''}
              quote={stage.challenge?.quote}
              speaker={stage.challenge?.speaker}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => goToStage('map')}
            className="self-start mt-2 px-10 py-3.5 bg-gold-3 hover:bg-gold-4 text-ink-0
                       font-cns font-medium tracking-[0.24em] text-[13px]
                       shadow-gold-glow transition-colors"
          >
            {ui.buttons.start} →
          </motion.button>
        </div>

        {/* Right: mission objectives */}
        <div className="w-[360px] flex flex-col gap-4">
          <MissionPanel
            title={ui.panels.mission}
            objectives={stage.missionObjectives ?? []}
          />

          {/* Miranda quote ribbon */}
          {stage.challenge?.quote && (
            <div className="glass p-4 frame-corners relative">
              <span className="c-tl" /><span className="c-br" />
              <div className="eyebrow mb-2">MIRANDA · QUOTE</div>
              <div className="font-cn italic text-[14px] text-gold-4 leading-[1.6]">
                "{stage.challenge.quote}"
              </div>
              <div className="mt-3 font-mono text-[9px] tracking-[0.28em] text-warm-3">
                — VELORIS MAISON, FW26
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
