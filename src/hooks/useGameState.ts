import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, StageId } from '../data/types';
import { packs } from '../data';
import { computeStageScore, computeRunResult, type StageScore, type RunResult } from '../lib/scoring';

export interface PlayerInfo {
  name: string;
  company: string;
}

export interface StageRunState {
  stageId: string;
  startTime: number;    // Date.now() when stage started
  wrongAttempts: number;
  hintsUsed: number;
}

interface GameState {
  currentStageId: StageId;
  viewedStoryBriefs: Record<string, boolean>;
  activeStoryBriefStageId: StageId | null;
  unlockedStages: StageId[];
  completedStages: StageId[];
  /** slotId -> array of optionIds currently placed */
  slotAssignments: Record<string, string[]>;
  score: number;
  energy: number;
  language: Language;

  // --- Player & Run state ---
  player: PlayerInfo | null;
  currentRun: StageRunState | null;
  stageScores: StageScore[];
  runResult: RunResult | null;

  setPlayer: (info: PlayerInfo) => void;
  openStoryBriefOverlay: (stageId: StageId) => void;
  closeStoryBriefOverlay: () => void;
  markStoryBriefViewed: (stageId: StageId) => void;
  startStageRun: (stageId: string) => void;
  recordWrongAttempt: () => void;
  recordHintUsed: () => void;
  finishStageRun: () => StageScore | null;

  goToStage: (id: StageId) => void;
  peekStage: (id: StageId) => void;
  goBack: () => void;
  completeStage: (id: StageId) => void;
  resetStage: (id: StageId) => void;
  setLanguage: (lang: Language) => void;
  /** Returns "correct" | "wrong"; on correct, persists the placement */
  validatePlacement: (slotId: string, optionId: string) => 'correct' | 'wrong';
  /** Reset everything to initial */
  hardReset: () => void;
  /** Restart a new game run (keep player, clear scores) */
  restartRun: () => void;
}

const INITIAL_UNLOCKED: StageId[] = ['title', 'mission', 'map', 'stage1'];

const STAGE_ORDER: StageId[] = [
  'title', 'mission', 'map', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'results', 'leaderboard',
];

export const useGameState = create<GameState>()(
  persist(
    (set, get) => ({
      currentStageId: 'title',
      viewedStoryBriefs: {},
      activeStoryBriefStageId: null,
      unlockedStages: INITIAL_UNLOCKED,
      completedStages: [],
      slotAssignments: {},
      score: 0,
      energy: 100,
      language: 'zh',

      // --- Player & Run ---
      player: null,
      currentRun: null,
      stageScores: [],
      runResult: null,

      setPlayer: (info) => set({ player: info }),

      openStoryBriefOverlay: (stageId) => set({ activeStoryBriefStageId: stageId }),

      closeStoryBriefOverlay: () => set({ activeStoryBriefStageId: null }),

      markStoryBriefViewed: (stageId) =>
        set({
          viewedStoryBriefs: {
            ...get().viewedStoryBriefs,
            [stageId]: true,
          },
        }),

      startStageRun: (stageId) =>
        set({ currentRun: { stageId, startTime: Date.now(), wrongAttempts: 0, hintsUsed: 0 } }),

      recordWrongAttempt: () => {
        const run = get().currentRun;
        if (!run) return;
        set({ currentRun: { ...run, wrongAttempts: run.wrongAttempts + 1 } });
      },

      recordHintUsed: () => {
        const run = get().currentRun;
        if (!run) return;
        set({ currentRun: { ...run, hintsUsed: run.hintsUsed + 1 } });
      },

      finishStageRun: () => {
        const run = get().currentRun;
        if (!run) return null;
        const elapsed = Math.round((Date.now() - run.startTime) / 1000);
        const stageScore = computeStageScore({
          stageId: run.stageId,
          timeSeconds: elapsed,
          wrongAttempts: run.wrongAttempts,
          hintsUsed: run.hintsUsed,
        });
        const scores = [...get().stageScores, stageScore];
        const isLastStage = run.stageId === 'stage5';
        set({
          currentRun: null,
          stageScores: scores,
          runResult: isLastStage ? computeRunResult(scores) : null,
        });
        return stageScore;
      },

      goToStage: (id) => {
        if (!get().unlockedStages.includes(id)) return;
        set({ currentStageId: id });
      },

      peekStage: (id) => {
        set({ currentStageId: id });
      },

      goBack: () => {
        const idx = STAGE_ORDER.indexOf(get().currentStageId);
        if (idx <= 0) return;
        const prevId = STAGE_ORDER[idx - 1];
        if (get().unlockedStages.includes(prevId)) set({ currentStageId: prevId });
      },
      completeStage: (id) => {
        const { completedStages, unlockedStages, score } = get();
        const idx = STAGE_ORDER.indexOf(id);
        const nextId = STAGE_ORDER[idx + 1];
        let newUnlocked = nextId && !unlockedStages.includes(nextId)
          ? [...unlockedStages, nextId]
          : [...unlockedStages];
        // Completing final stage unlocks both results + leaderboard
        if (id === 'stage5') {
          if (!newUnlocked.includes('results')) newUnlocked.push('results');
          if (!newUnlocked.includes('leaderboard')) newUnlocked.push('leaderboard');
        }
        set({
          completedStages: completedStages.includes(id)
            ? completedStages
            : [...completedStages, id],
          unlockedStages: newUnlocked,
          score: score + 100,
        });
      },

      resetStage: (id) => {
        // Clear all slot assignments belonging to this stage's slots
        // (we lookup slot ids from current language pack)
        const pack = packs[get().language];
        const stage = pack.stages.find((s) => s.id === id);
        const slotIds = stage?.slots?.map((s) => s.id) ?? [];
        const next = { ...get().slotAssignments };
        for (const sid of slotIds) delete next[sid];
        set({
          slotAssignments: next,
          completedStages: get().completedStages.filter((x) => x !== id),
        });
      },

      setLanguage: (lang) => set({ language: lang }),

      validatePlacement: (slotId, optionId) => {
        const pack = packs[get().language];
        const stage = pack.stages.find((s) => s.id === get().currentStageId);
        const correct = stage?.correctMapping?.[slotId];
        if (!correct) return 'wrong';
        const accepted = Array.isArray(correct) ? correct : [correct];
        if (!accepted.includes(optionId)) return 'wrong';

        const current = get().slotAssignments[slotId] ?? [];
        if (current.includes(optionId)) return 'correct';
        set({
          slotAssignments: {
            ...get().slotAssignments,
            [slotId]: [...current, optionId],
          },
        });
        return 'correct';
      },

      hardReset: () => set({
        currentStageId: 'title',
        viewedStoryBriefs: {},
        activeStoryBriefStageId: null,
        unlockedStages: INITIAL_UNLOCKED,
        completedStages: [],
        slotAssignments: {},
        score: 0,
        energy: 100,
        player: null,
        currentRun: null,
        stageScores: [],
        runResult: null,
      }),

      restartRun: () => set({
        currentStageId: 'title',
        viewedStoryBriefs: {},
        activeStoryBriefStageId: null,
        unlockedStages: INITIAL_UNLOCKED,
        completedStages: [],
        slotAssignments: {},
        score: 0,
        energy: 100,
        currentRun: null,
        stageScores: [],
        runResult: null,
      }),
    }),
    {
      name: 'veloris:progress',
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          return {
            ...persistedState,
            viewedStoryBriefs: {},
            activeStoryBriefStageId: null,
          };
        }
        return persistedState;
      },
    },
  ),
);

const PUZZLE_STAGES: StageId[] = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5'];

export { STAGE_ORDER, PUZZLE_STAGES };
