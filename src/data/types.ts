// Game data types — shared across stages and language files

export type StageId =
  | 'mission'
  | 'map'
  | 'stage1'
  | 'stage2'
  | 'stage3'
  | 'stage4'
  | 'stage5';

export type AccentColor =
  | 'gold' | 'cyan' | 'purple' | 'green' | 'blue' | 'pink' | 'red';

export type Language = 'zh' | 'en';

export type StageType =
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
}

export interface GameSlot {
  id: string;
  label: string;
  description?: string;
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

/** correctMapping value: single id, or array of ids for multi-card slots */
export type CorrectAnswer = string | string[];

export interface StageConfig {
  id: StageId;
  stageNumber?: number;
  type: StageType;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  challenge?: ChallengeText;
  missionObjectives?: string[];
  knowledgePoints?: KnowledgePoint[];
  hint?: string;
  options?: GameOption[];
  slots?: GameSlot[];
  correctMapping?: Record<string, CorrectAnswer>;
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
