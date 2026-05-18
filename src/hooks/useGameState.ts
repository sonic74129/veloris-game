import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, StageId } from '../data/types';
import { packs } from '../data';

interface GameState {
  currentStageId: StageId;
  unlockedStages: StageId[];
  completedStages: StageId[];
  /** slotId -> array of optionIds currently placed */
  slotAssignments: Record<string, string[]>;
  score: number;
  energy: number;
  language: Language;

  goToStage: (id: StageId) => void;
  completeStage: (id: StageId) => void;
  resetStage: (id: StageId) => void;
  setLanguage: (lang: Language) => void;
  /** Returns "correct" | "wrong"; on correct, persists the placement */
  validatePlacement: (slotId: string, optionId: string) => 'correct' | 'wrong';
  /** Reset everything to initial */
  hardReset: () => void;
}

const INITIAL_UNLOCKED: StageId[] = ['title', 'mission', 'map', 'stage1'];

const STAGE_ORDER: StageId[] = [
  'title', 'mission', 'map', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5',
];

export const useGameState = create<GameState>()(
  persist(
    (set, get) => ({
      currentStageId: 'title',
      unlockedStages: INITIAL_UNLOCKED,
      completedStages: [],
      slotAssignments: {},
      score: 0,
      energy: 100,
      language: 'zh',

      goToStage: (id) => {
        if (!get().unlockedStages.includes(id)) return;
        set({ currentStageId: id });
      },

      completeStage: (id) => {
        const { completedStages, unlockedStages, score } = get();
        const idx = STAGE_ORDER.indexOf(id);
        const nextId = STAGE_ORDER[idx + 1];
        const newUnlocked = nextId && !unlockedStages.includes(nextId)
          ? [...unlockedStages, nextId]
          : unlockedStages;
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
        unlockedStages: INITIAL_UNLOCKED,
        completedStages: [],
        slotAssignments: {},
        score: 0,
        energy: 100,
      }),
    }),
    {
      name: 'veloris:progress',
      version: 1,
    },
  ),
);

export { STAGE_ORDER };
