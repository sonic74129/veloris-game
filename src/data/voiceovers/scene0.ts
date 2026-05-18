/**
 * Scene 0 — Miranda Briefing voiceover data.
 */

import type { SingleFileVoiceover } from '../../components/voiceover/SingleFileVoiceoverPlayer';

// ── Chinese voiceover — miranda-scene0-zh.mp3 (~31s) ─────────────────────────
// Cue timings are estimates from the SSML break structure; fine-tune if off.
export const SCENE0_VOICEOVER_ZH: SingleFileVoiceover = {
  src: 'audio/miranda-scene0-zh.mp3',
  storageKey: 'veloris:vo:mission:played',
  cues: [
    { start: 0.0,  end: 2.3,  text: '嗯，你终于来了，CTO。' },
    { start: 2.6,  end: 11.8, text: '董事会要速度，业务部门要 Agent，每一个团队都想把 AI 接进自己的系统：客户资料、订单数据、设计资产、供应链流程、财务权限。' },
    { start: 12.2, end: 14.0, text: '听起来很美，对吗？' },
    { start: 14.3, end: 17.2, text: '但如果没有边界，这不是未来——这是失控。' },
    { start: 17.6, end: 20.2, text: '所以今天，你不是来做 Demo 的。' },
    { start: 20.5, end: 26.5, text: '你是来判断：哪些系统可以连接，哪些流程必须保护，哪些 Agent 必须被治理。' },
    { start: 26.9, end: 28.2, text: '现在，CTO。' },
    { start: 28.5, end: 31.4, text: '证明你配得上这个位置。', emphasis: true },
  ],
};

// ── English voiceover (legacy single-file, ~71s) ──────────────────────────────
// Used as fallback; primary English path is line-by-line via VoiceoverPlayer.
export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
  highlight?: boolean;
}

export interface StageVoiceover {
  src: string;
  storageKey: string;
  cues: SubtitleCue[];
}

export const SCENE0_VOICEOVER: StageVoiceover = {
  src: 'audio/miranda-scene0.mp3',
  storageKey: 'veloris:vo:mission:played',
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
