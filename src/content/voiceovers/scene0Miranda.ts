import type { VoiceoverScript } from '../../lib/voiceover/types';

/**
 * Configurable voice variants for testing.
 * Set VITE_MIRANDA_VOICE=ava|serena|nova|emma in your .env.local
 * Then run: MIRANDA_VOICE=serena npm run gen:voice:aad
 */
export const VOICE_VARIANTS = {
  ava:    'en-US-Ava:DragonHDOmniLatestNeural',
  serena: 'en-US-Serena:DragonHDOmniLatestNeural',
  nova:   'en-US-Nova:DragonHDOmniLatestNeural',
  emma:   'en-US-Emma:DragonHDOmniLatestNeural',
} as const;

export type VoiceVariant = keyof typeof VOICE_VARIANTS;

export const SCENE0_SCRIPT: VoiceoverScript = {
  sceneId:    'scene0',
  storageKey: 'veloris:vo:mission:played',

  lines: [
    {
      id:           'welcome',
      text:         '[calm] Welcome to Veloris Maison.',
      style:        'calm',
      styleDegree:  1.15,
      pauseAfterMs: 900,
      emphasis:     false,
    },
    {
      id:           'running-out-of-time',
      text:         '[breathing] I brought you here because this house is running out of time.',
      style:        'serious',
      styleDegree:  1.35,
      pauseAfterMs: 850,
      emphasis:     false,
    },
    {
      id:           'systems-fragmented',
      text:         '[disappointed] Our systems are fragmented.',
      style:        'serious',
      styleDegree:  1.4,
      pauseAfterMs: 500,
      emphasis:     false,
    },
    {
      id:           'data-scattered',
      text:         '[disappointed] Our data is scattered.',
      style:        'serious',
      styleDegree:  1.35,
      pauseAfterMs: 500,
      emphasis:     false,
    },
    {
      id:           'ai-everywhere',
      text:         '[concerned] Our AI is everywhere.',
      style:        'serious',
      styleDegree:  1.25,
      pauseAfterMs: 450,
      emphasis:     false,
    },
    {
      id:           'transformation-nowhere',
      text:         '[suspicious] But transformation is nowhere.',
      style:        'serious',
      styleDegree:  1.35,
      pauseAfterMs: 1000,
      emphasis:     false,
    },
    {
      id:           'changes-now',
      text:         '[serious] Hm. That changes now.',
      style:        'serious',
      styleDegree:  1.5,
      pauseAfterMs: 750,
      emphasis:     false,
    },
    {
      id:           'new-cto',
      text:         '[confident] You are my new CTO.',
      style:        'confident',
      styleDegree:  1.45,
      pauseAfterMs: 800,
      emphasis:     true,
    },
    {
      id:           'frontier-firm',
      text:         '[determined] Before the next season begins, you will rebuild this maison into an AI-driven Frontier Firm.',
      style:        'determined',
      styleDegree:  1.4,
      pauseAfterMs: 1100,
      emphasis:     false,
    },
    {
      id:           'five-trials',
      text:         '[serious] Five trials.',
      style:        'serious',
      styleDegree:  1.65,
      pauseAfterMs: 550,
      emphasis:     true,
    },
    {
      id:           'one-season',
      text:         '[serious] One season.',
      style:        'serious',
      styleDegree:  1.65,
      pauseAfterMs: 700,
      emphasis:     true,
    },
    {
      id:           'no-excuses',
      text:         '[defiant] No excuses.',
      style:        'serious',
      styleDegree:  1.8,
      pauseAfterMs: 0,
      emphasis:     true,
    },
  ],
};
