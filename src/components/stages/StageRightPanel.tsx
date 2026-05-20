import { ChallengeCard } from '../panels/ChallengeCard';
import { MissionPanel } from '../panels/MissionPanel';
import { InteractiveHintPanel } from '../gameplay/InteractiveHintPanel';
import { StoryBackgroundCard } from './StoryBackgroundCard';
import type { StageConfig } from '../../data/types';
import { useGameState } from '../../hooks/useGameState';

interface StageRightPanelProps {
  stage: StageConfig;
  challengeTitle: string;
  missionTitle: string;
  advisor: 'kinky' | 'lily';
  hintText: string;
  onRevealHint: () => void;
  onReplayBrief: () => void;
  compact?: boolean;
}

export function StageRightPanel({
  stage,
  challengeTitle,
  missionTitle,
  advisor,
  hintText,
  onRevealHint,
  onReplayBrief,
  compact = false,
}: StageRightPanelProps) {
  const assignments = useGameState((s) => s.slotAssignments);

  if (stage.id === 'stage4') {
    const sidebar = stage.sidebarPanels;
    const statusItems =
      stage.platformStatus ?? [
        { slotId: 'hosted-agent', label: 'Hosted Agents', target: 2 },
        { slotId: 'model-runtime', label: 'Managed Models', target: 1 },
        { slotId: 'control-plane', label: 'Governance Signals', target: 2 },
      ];

    return (
      <div className={`${compact ? 'w-[260px]' : 'w-[340px]'} flex flex-col gap-3 overflow-y-auto pr-1`}>
        <div className="glass frame-corners p-5 relative">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-2">{sidebar?.chairwomanTitle ?? 'CHAIRWOMAN 的挑战'}</div>
          <div className="font-cn text-[15px] leading-[1.72] text-warm-1 whitespace-pre-line">
            {sidebar?.chairwomanBody ?? stage.challenge?.body ?? ''}
          </div>
          <div className="mt-4 text-right font-mono text-[10px] tracking-[0.26em] text-warm-3">
            — {sidebar?.chairwomanSignature ?? 'M. CONTOSO'}
          </div>
        </div>

        <MissionPanel title={sidebar?.missionTitle ?? '本关任务目标'} objectives={stage.missionObjectives ?? []} />

        <div className="glass frame-corners p-5 relative">
          <span className="c-tl" /><span className="c-br" />
          <div className="eyebrow mb-2">{sidebar?.platformStatusTitle ?? '收编进度 / PLATFORM STATUS'}</div>
          <div className="space-y-2.5">
            {statusItems.map((item) => {
              const current = (assignments[item.slotId] ?? []).length;
              const value = `${Math.min(current, item.target)}/${item.target}`;
              return <StatusRow key={item.slotId} label={item.label} value={value} />;
            })}
          </div>
        </div>

        <InteractiveHintPanel
          stageId={stage.id}
          advisor={advisor}
          hintText={hintText}
          onReveal={onRevealHint}
          panelTitle={sidebar?.hintTitle}
          panelBody={sidebar?.hintBody}
        />
      </div>
    );
  }

  return (
    <div className={`${compact ? 'w-[260px]' : 'w-[340px]'} flex flex-col gap-3 overflow-y-auto pr-1`}>
      <StoryBackgroundCard
        summary={stage.storyBackgroundShort ?? ''}
        onReplayBrief={onReplayBrief}
        compact={compact}
      />

      {stage.challenge && (
        <ChallengeCard
          title={challengeTitle}
          body={stage.challenge.body}
          speaker={stage.challenge.speaker}
        />
      )}

      {stage.missionObjectives && (
        <MissionPanel title={missionTitle} objectives={stage.missionObjectives} />
      )}

      <InteractiveHintPanel
        stageId={stage.id}
        advisor={advisor}
        hintText={hintText}
        onReveal={onRevealHint}
      />
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border border-gold-1/70 bg-ink-3/65 px-2.5 py-2">
      <span className="font-cns text-[12px] text-warm-2">{label}</span>
      <span className="font-mono text-[11px] tracking-[0.12em] text-gold-4">{value}</span>
    </div>
  );
}
