/**
 * Scene 0 — Miranda voiceover line-by-line config.
 * Each line is synthesized as a separate audio file.
 * Pauses between lines are controlled by pauseAfterMs in frontend playback.
 */

export type SubtitleEffect =
  | 'typewriter'
  | 'sharp-fade-in'
  | 'quick-cut'
  | 'hard-cut'
  | 'minimal'
  | 'title-reveal'
  | 'cinematic-line'
  | 'final-impact'
  | 'final-impact-strong'
  | 'full-screen-command';

export type SoundEffect =
  | 'soft-ui-open'
  | 'ui-tick'
  | 'low-hit'
  | 'deep-hit'
  | 'mission-lock'
  | 'mission-rise'
  | 'mission-start'
  | null;

export interface VoiceoverLine {
  id: string;
  /** Clean text for TTS (no bracket annotations) */
  text: string;
  style: string;
  styleDegree: number;
  pauseAfterMs: number;
  emphasis: boolean;
  subtitleEffect: SubtitleEffect;
  soundEffect: SoundEffect;
}

/** Voice to use for synthesis. Switch here to test other voices. */
export const MIRANDA_VOICE =
  'en-US-Ava:DragonHDOmniLatestNeural' as const;
  // Alternatives to test:
  // 'en-US-Serena:DragonHDOmniLatestNeural'
  // 'en-US-Nova:DragonHDOmniLatestNeural'
  // 'en-US-Emma:DragonHDOmniLatestNeural'

export const MIRANDA_SPEECH_PARAMS =
  'temperature=0.78;top_p=0.8;top_k=30;cfg_scale=1.65';

/** Style fallback map for unsupported Dragon HD Omni styles */
export const STYLE_FALLBACK: Record<string, string> = {
  urgent:      'determined',
  commanding:  'confident',
  concerned:   'serious',
  disappointed:'serious',
  suspicious:  'serious',
  defiant:     'serious',
  frustrated:  'serious',
  reflective:  'calm',
  proud:       'confident',
};

export const SCENE0_LINES: VoiceoverLine[] = [
  {
    id: 'welcome',
    text: 'Welcome to Veloris Maison.',
    style: 'confident',
    styleDegree: 1.25,
    pauseAfterMs: 350,
    emphasis: false,
    subtitleEffect: 'typewriter',
    soundEffect: 'soft-ui-open',
  },
  {
    id: 'out-of-time',
    text: 'We are out of time.',
    style: 'serious',
    styleDegree: 1.65,
    pauseAfterMs: 260,
    emphasis: true,
    subtitleEffect: 'sharp-fade-in',
    soundEffect: 'low-hit',
  },
  {
    id: 'systems-fragmented',
    text: 'The systems are fragmented.',
    style: 'serious',
    styleDegree: 1.4,
    pauseAfterMs: 180,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'data-scattered',
    text: 'The data is scattered.',
    style: 'serious',
    styleDegree: 1.4,
    pauseAfterMs: 180,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'ai-everywhere',
    text: 'The AI is everywhere.',
    style: 'serious',
    styleDegree: 1.45,
    pauseAfterMs: 180,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'impact-nowhere',
    text: 'But impact is nowhere.',
    style: 'confident',
    styleDegree: 1.65,
    pauseAfterMs: 360,
    emphasis: true,
    subtitleEffect: 'hard-cut',
    soundEffect: 'low-hit',
  },
  {
    id: 'hm',
    text: 'Hm.',
    style: 'serious',
    styleDegree: 1.45,
    pauseAfterMs: 220,
    emphasis: false,
    subtitleEffect: 'minimal',
    soundEffect: null,
  },
  {
    id: 'that-ends-now',
    text: 'That ends now.',
    style: 'confident',
    styleDegree: 1.8,
    pauseAfterMs: 300,
    emphasis: true,
    subtitleEffect: 'sharp-fade-in',
    soundEffect: 'low-hit',
  },
  {
    id: 'new-cto',
    text: 'You are my new CTO.',
    style: 'confident',
    styleDegree: 1.7,
    pauseAfterMs: 360,
    emphasis: true,
    subtitleEffect: 'title-reveal',
    soundEffect: 'mission-lock',
  },
  {
    id: 'modernize-apps',
    text: 'Modernize the apps.',
    style: 'determined',
    styleDegree: 1.5,
    pauseAfterMs: 140,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'connect-knowledge',
    text: 'Connect the knowledge.',
    style: 'determined',
    styleDegree: 1.5,
    pauseAfterMs: 140,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'govern-data',
    text: 'Govern the data.',
    style: 'determined',
    styleDegree: 1.5,
    pauseAfterMs: 140,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'deploy-agents',
    text: 'Deploy the agents.',
    style: 'determined',
    styleDegree: 1.5,
    pauseAfterMs: 140,
    emphasis: false,
    subtitleEffect: 'quick-cut',
    soundEffect: 'ui-tick',
  },
  {
    id: 'secure-empire',
    text: 'Secure the empire.',
    style: 'determined',
    styleDegree: 1.65,
    pauseAfterMs: 420,
    emphasis: true,
    subtitleEffect: 'hard-cut',
    soundEffect: 'low-hit',
  },
  {
    id: 'frontier-firm',
    text: 'Before the next season begins, this maison becomes an AI-driven Frontier Firm.',
    style: 'determined',
    styleDegree: 1.65,
    pauseAfterMs: 500,
    emphasis: true,
    subtitleEffect: 'cinematic-line',
    soundEffect: 'mission-rise',
  },
  {
    id: 'five-trials',
    text: 'Five trials.',
    style: 'serious',
    styleDegree: 1.8,
    pauseAfterMs: 220,
    emphasis: true,
    subtitleEffect: 'final-impact',
    soundEffect: 'low-hit',
  },
  {
    id: 'one-season',
    text: 'One season.',
    style: 'serious',
    styleDegree: 1.8,
    pauseAfterMs: 260,
    emphasis: true,
    subtitleEffect: 'final-impact',
    soundEffect: 'low-hit',
  },
  {
    id: 'no-excuses',
    text: 'No excuses.',
    style: 'serious',
    styleDegree: 1.95,
    pauseAfterMs: 220,
    emphasis: true,
    subtitleEffect: 'final-impact-strong',
    soundEffect: 'deep-hit',
  },
  {
    id: 'move',
    text: 'Move.',
    style: 'confident',
    styleDegree: 2.0,
    pauseAfterMs: 0,
    emphasis: true,
    subtitleEffect: 'full-screen-command',
    soundEffect: 'mission-start',
  },
];
