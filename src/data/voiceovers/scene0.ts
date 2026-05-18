/**
 * Scene 0 — Miranda Briefing voiceover data.
 *
 * SSML is kept here so it matches the generation script exactly.
 *
 * SUBTITLE TIMING:
 *   Values below are estimates based on the SSML break structure.
 *   After generating public/audio/miranda-scene0.mp3, listen and adjust
 *   start / end (in seconds) to match the actual audio.
 */

export interface SubtitleCue {
  start: number;   // audio currentTime in seconds
  end: number;
  text: string;
  highlight?: boolean;   // true → gold emphasis style
}

export interface StageVoiceover {
  /** Path relative to public/ (no leading slash) */
  src: string;
  /** localStorage key used to track first-play state */
  storageKey: string;
  cues: SubtitleCue[];
}

export const SCENE0_VOICEOVER: StageVoiceover = {
  src: 'audio/miranda-scene0.mp3',
  storageKey: 'veloris:vo:mission:played',

  // ── Subtitle cues (calibrated to actual ~53s audio; fine-tune if off) ────────
  cues: [
    { start: 0.0,  end: 5.0,  text: 'Welcome to Veloris Maison.' },
    { start: 5.8,  end: 7.2,  text: 'Hmm.' },
    { start: 7.6,  end: 14.5, text: 'I brought you here because this house is running out of time.' },
    { start: 15.2, end: 18.5, text: 'Our systems are fragmented.' },
    { start: 19.0, end: 21.5, text: 'Our data is scattered.' },
    { start: 22.0, end: 25.0, text: 'Our AI is everywhere —' },
    { start: 25.5, end: 29.0, text: 'but transformation is nowhere.' },
    { start: 30.0, end: 31.0, text: 'Well.' },
    { start: 31.5, end: 34.5, text: 'That changes now.' },
    { start: 35.2, end: 38.5, text: 'You are my new CTO.' },
    { start: 39.2, end: 42.5, text: 'Before the next season begins,' },
    { start: 43.0, end: 49.5, text: 'you will rebuild this maison into an AI-driven Frontier Firm.' },
    { start: 50.5, end: 53.2, text: 'Five trials. One season. No excuses.', highlight: true },
  ],
};
