/**
 * Scene 0 — Miranda Briefing voiceover data.
 */

import type { SingleFileVoiceover } from '../../components/voiceover/SingleFileVoiceoverPlayer';

// ── Map voiceover — Kinky (Xiaomo) + Lily (Xiaoxiao), ~38s ──────────────────
// Timings derived from ffmpeg silencedetect.
// Kinky = normal italic style; Lily = gold emphasis style.
export const MAP_VOICEOVER_ZH: SingleFileVoiceover = {
  src: 'audio/kinky-lily-map-zh.mp3',
  storageKey: 'veloris:vo:map:played',
  cues: [
    { start: 0.19,  end: 4.79,  text: '哎呀，别被 Miranda 吓到了。她只是喜欢用董事会的语气开场。', speaker: 'kinky' },
    { start: 5.76,  end: 10.04, text: '好啦，CTO，别那么紧张嘛。你不是一个人在闯关。', emphasis: true, speaker: 'lily' },
    { start: 10.94, end: 14.57, text: '我们会陪你把 AI 接进真正的业务系统，但不是乱接。', speaker: 'kinky' },
    { start: 15.41, end: 22.06, text: '对，要接得快，也要接得安全。Agent、数据、流程、权限，一个都不能放飞。', emphasis: true, speaker: 'lily' },
    { start: 22.97, end: 28.19, text: '从现在开始，我们代表 Microsoft，帮你一步一步打造 AI Frontier Firm。', speaker: 'kinky' },
    { start: 29.07, end: 33.59, text: '放心啦。只要你做对选择，这家公司一定可以升级成功。', emphasis: true, speaker: 'lily' },
    { start: 34.46, end: 36.58, text: '那么，CTO，准备好了吗？', speaker: 'kinky' },
    { start: 37.43, end: 38.81, text: '第一关，要开始咯。', emphasis: true, speaker: 'lily' },
  ],
};

// ── Chinese voiceover — miranda-scene0-zh.mp3 (~31s) ─────────────────────────
// Cue timings are estimates from the SSML break structure; fine-tune if off.
export const SCENE0_VOICEOVER_ZH: SingleFileVoiceover = {
  src: 'audio/miranda-scene0-zh.mp3',
  storageKey: 'veloris:vo:mission:played',
  // Timings derived from ffmpeg silencedetect — not guessed.
  cues: [
    { start: 0.15, end: 1.85, text: '嗯，你终于来了，CTO。' },
    { start: 2.78, end: 7.48, text: '董事会要速度，业务部门要 Agent，每一个团队都想把 AI 接进自己的系统：' },
    { start: 8.10, end: 12.28, text: '客户资料、订单数据、设计资产、供应链流程、财务权限。' },
    { start: 13.24, end: 14.44, text: '听起来很美，对吗？' },
    { start: 15.27, end: 17.91, text: '但如果没有边界，这不是未来——这是失控。' },
    { start: 18.85, end: 20.57, text: '所以今天，你不是来做 Demo 的。' },
    { start: 21.44, end: 26.63, text: '你是来判断：哪些系统可以连接，哪些流程必须保护，哪些 Agent 必须被治理。' },
    { start: 27.61, end: 28.64, text: '现在，CTO。' },
    { start: 29.50, end: 30.90, text: '证明你配得上这个位置。', emphasis: true },
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
