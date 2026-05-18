# VELORIS MAISON — Frontier Firm Transformation Trial

16:9 luxury black-and-gold browser game · React + TypeScript + Vite + Tailwind + Framer Motion + dnd-kit + Zustand.

**MVP scope (中文)**: Mission Briefing · Level Map · Stage 1 · Stage 2 are fully playable. Stages 3–5 are scaffolded with "Coming Soon" placeholders, ready to be filled in via data files.

## Quick start

```bash
cd veloris-game
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## Folder map

```
veloris-game/
├── public/assets/characters/      Background-removed PNGs (Miranda, kinky2, lily, kinky)
└── src/
    ├── App.tsx                    Stage router
    ├── index.css                  Theme tokens + glass / frame styles
    ├── data/
    │   ├── types.ts               StageConfig, GameOption, GameSlot, LanguagePack
    │   ├── stages.zh.ts           All Chinese stage content (single source of truth)
    │   └── index.ts               Exports packs.zh / packs.en
    ├── hooks/useGameState.ts      Zustand store, persisted in localStorage
    ├── lib/
    │   ├── scale.ts               Hook that scales 1920×1080 canvas to viewport
    │   └── accent.ts              Accent color hex / soft / glow maps
    └── components/
        ├── layout/                GameShell · TopStatusBar · BottomNav · StageHeader
        ├── character/             CharacterLayer (Miranda + advisors)
        ├── icons/                 Inline-SVG icon registry
        ├── panels/                ChallengeCard · MissionPanel · KnowledgePanel · HintPanel
        ├── gameplay/              DragOptionCard · DropSlot · PuzzleBoard · StageCompleteModal
        └── stages/                MissionBriefing · LevelMap · DragMatchStage · ComingSoonStage
```

## Where to put assets

- **Characters** (PNGs with transparent background) → `public/assets/characters/`. Already provided: Miranda, kinky, kinky2, lily.
- **Backgrounds** → `public/assets/backgrounds/` if you want atmosphere images, then pass via `<GameShell background="/assets/backgrounds/x.png">`. MVP intentionally uses **pure CSS gradients + marble texture** (no baked-in text) so multi-language has no leaked Chinese.
- **Icons** → SVG components inside `src/components/icons/Icon.tsx`. Add a new one to `IconRegistry` and reference it from `stage.options[].icon` or `knowledgePoints[].icon`.

## How to edit text

Everything visible lives in **`src/data/stages.zh.ts`**:
- The top `ui` block: nav labels, HUD, button labels, modal copy, panel titles.
- The `stages[]` array: each stage's title, subtitle, challenge body, mission objectives, knowledge points, hint, slots, options, `correctMapping`.

No component file contains hard-coded Chinese — edit data, UI updates.

## How to add a new stage

1. Append a `StageConfig` to `stages` in `stages.zh.ts`:
   ```ts
   {
     id: 'stage6',
     stageNumber: 6,
     type: 'drag-match',   // 'architecture-fill' | 'safety-boundary'
     title: '第 6 关：…',
     subtitle: '…',
     challenge: { speaker: '…', title: '…', body: '…' },
     missionObjectives: ['…'],
     hint: '…',
     slots: [{ id: 'slot-a', label: '问题 1', description: '…' }],
     options: [{ id: 'opt-a', title: '…', accent: 'gold' }],
     correctMapping: { 'slot-a': 'opt-a' },
   }
   ```
2. Add `'stage6'` to `STAGE_ORDER` in `src/hooks/useGameState.ts`.
3. Add a node in the `MAP_NODES` array in `src/components/stages/LevelMap.tsx`.

The generic `PuzzleBoard` consumes the new config automatically — no new component required unless the layout is brand-new.

## How language switching works

- Bottom-nav toggle `中 / EN` flips `useGameState.language`. Progress is preserved across languages.
- To enable English, copy `zhPack` into a new `src/data/stages.en.ts` with translated strings, then change `enPack` import in `src/data/index.ts`. (Currently `enPack` is aliased to `zhPack` as a stub.)
- Because backgrounds are text-free CSS, switching never reveals stale Chinese.

## Drag-and-drop validation

`useGameState.validatePlacement(slotId, optionId)`:
- Looks up `correctMapping[slotId]` from the active language pack.
- `correct` can be `string` (single answer) **or** `string[]` (multi-card slot — used by Stage 4 when implemented).
- ✅ Match → card snaps into `slotAssignments`, locked in pool, gold glow.
- ❌ Mismatch → red shake, card returns to pool, slot stays empty.
- When every slot is satisfied → `onComplete` fires → next stage unlocks → `StageCompleteModal` shows.

## Reset

- Per-stage: `↻ 重置本关` button next to the stage header.
- Everything: DevTools → Application → Local Storage → delete `veloris:progress`. Or in console: `useGameState.getState().hardReset()`.

## Acceptance checklist (MVP)

- [x] `npm install && npm run dev` works
- [x] Mission Briefing → Level Map → Stage 1 → Stage 2 fully playable
- [x] Drag-and-drop with correct lock / incorrect shake + return
- [x] Completing a stage unlocks the next
- [x] All visible Chinese text comes from `stages.zh.ts`
- [x] Characters layered separately (transparent PNGs)
- [x] Black-gold luxury fashion HUD aesthetic
- [x] LocalStorage persistence
- [ ] Stages 3–5 full gameplay (data scaffold + Coming Soon screen now)
- [ ] Full English translation
