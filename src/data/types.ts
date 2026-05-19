// Game data types — shared across stages and language files

export type StageId =
  | 'title'
  | 'mission'
  | 'map'
  | 'stage1'
  | 'stage2'
  | 'stage3'
  | 'stage4'
  | 'stage5'
  | 'results'
  | 'leaderboard';

export type AccentColor =
  | 'gold' | 'cyan' | 'purple' | 'green' | 'blue' | 'pink' | 'red';

export type Language = 'zh' | 'en';

export type StageType =
  | 'title'
  | 'briefing'
  | 'map'
  | 'drag-match'
  | 'architecture-fill'
  | 'safety-boundary';

export interface GameOption {
  id: string;
  title: string;
  description?: string;
  icon?: string;          // icon key in IconRegistry
  accent: AccentColor;
  typeLabel?: string;
  team?: string;
  status?: string;
  category?: 'agent' | 'model' | 'governance';
  targetZone?: string;
}

export interface GameSlot {
  id: string;
  label: string;
  description?: string;
  subtitleEn?: string;
  subtitleZh?: string;
  dropHint?: string;
  icon?: string;
  /** number of cards expected (default 1) */
  capacity?: number;
}

export interface KnowledgePoint {
  title: string;
  body: string;
  icon?: string;
}

export interface ChallengeText {
  speaker: string;
  title: string;
  body: string;
  quote?: string;
}

export interface SidebarPanelsConfig {
  chairwomanTitle?: string;
  chairwomanBody?: string;
  chairwomanSignature?: string;
  missionTitle?: string;
  platformStatusTitle?: string;
  hintTitle?: string;
  hintBody?: string;
}

export interface PlatformStatusItem {
  slotId: string;
  label: string;
  target: number;
}

/** correctMapping value: single id, or array of ids for multi-card slots */
export type CorrectAnswer = string | string[];

export interface StageConfig {
  id: StageId;
  stageNumber?: number;
  type: StageType;
  title: string;
  subtitle?: string;
  storyBrief?: string;
  storyBackgroundShort?: string;
  backgroundImage?: string;
  challenge?: ChallengeText;
  missionObjectives?: string[];
  knowledgePoints?: KnowledgePoint[];
  hint?: string;
  options?: GameOption[];
  slots?: GameSlot[];
  correctMapping?: Record<string, CorrectAnswer>;
  sidebarPanels?: SidebarPanelsConfig;
  platformStatus?: PlatformStatusItem[];
  completionTitle?: string;
  completionMessage?: string;
  completionButtonLabel?: string;
  /** Mark stage as a placeholder (MVP scaffold) */
  comingSoon?: boolean;
}

export interface UIStrings {
  brand: string;
  brandSub: string;
  trialTitle: string;
  trialTitleEn: string;
  stagePillPrefix: string;     // e.g. "关卡"
  nav: {
    warRoom: string; teams: string; data: string;
    aiHub: string; competition: string; roadmap: string; settings: string;
  };
  hud: { level: string; energy: string };
  buttons: {
    start: string; next: string; reset: string;
    backToMap: string; complete: string; tryAgain: string;
  };
  panels: {
    challenge: string; mission: string; knowledge: string; hint: string;
    chairwoman: string;
  };
  modal: {
    title: string; body: string; nextStage: string;
  };
  mapSide: {
    progress: string;   // "转型进度"
    stage: string;      // "关卡"
    nextReward: string; // "下一个奖励"
  };
}

export interface LanguagePack {
  ui: UIStrings;
  stages: StageConfig[];
}
