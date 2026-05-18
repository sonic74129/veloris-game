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

  // ── Subtitle cues (calibrated to ~71s audio; fine-tune start/end if off) ─────
  cues: [
    { start: 0.0,  end: 5.5,  text: 'Welcome to Veloris Maison.' },
    { start: 8.0,  end: 10.0, text: 'Hmm.' },
    { start: 10.5, end: 17.5, text: 'I brought you here because this house is running out of time.' },
    { start: 18.3, end: 22.5, text: 'Our systems are fragmented.' },
    { start: 23.0, end: 26.5, text: 'Our data is scattered.' },
    { start: 27.0, end: 30.5, text: 'Our AI is everywhere —' },
    { start: 31.0, end: 35.5, text: 'but transformation is nowhere.' },
    { start: 38.5, end: 43.5, text: 'Well. That changes now.' },
    { start: 44.2, end: 48.5, text: 'You are my new CTO.' },
    { start: 49.3, end: 53.5, text: 'Before the next season begins,' },
    { start: 54.0, end: 62.0, text: 'you will rebuild this maison into an AI-driven Frontier Firm.' },
    { start: 63.5, end: 71.5, text: 'Five trials. One season. No excuses.', highlight: true },
  ],
};
