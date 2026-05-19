/**
 * Preload critical assets (audio + images) while the user fills in PlayerEntryModal.
 * Uses <link rel="prefetch"> for audio and Image() for images to leverage browser cache.
 */

const BASE = import.meta.env.BASE_URL;

const AUDIO_FILES = [
  'assets/bgm.mp3',
  'audio/miranda-scene0-zh.mp3',
  'audio/kinky-lily-map-zh.mp3',
  'audio/scene0/welcome.mp3',
  'audio/scene0/hm.mp3',
  'audio/scene0/new-cto.mp3',
  'audio/scene0/one-season.mp3',
  'audio/scene0/systems-fragmented.mp3',
  'audio/scene0/data-scattered.mp3',
  'audio/scene0/impact-nowhere.mp3',
  'audio/scene0/that-ends-now.mp3',
  'audio/scene0/five-trials.mp3',
  'audio/scene0/modernize-apps.mp3',
  'audio/scene0/connect-knowledge.mp3',
  'audio/scene0/govern-data.mp3',
  'audio/scene0/deploy-agents.mp3',
  'audio/scene0/secure-empire.mp3',
  'audio/scene0/no-excuses.mp3',
  'audio/scene0/out-of-time.mp3',
  'audio/scene0/move.mp3',
  'audio/scene0/ai-everywhere.mp3',
  'audio/scene0/frontier-firm.mp3',
];

const IMAGE_FILES = [
  'assets/characters/Miranda.png',
  'assets/characters/kinky.png',
  'assets/characters/kinky2.png',
  'assets/characters/lily.png',
];

const VIDEO_FILES = [
  'video/scene2-intro.mp4',
];

let _started = false;

export function preloadAssets() {
  if (_started) return;
  _started = true;

  // Preload images via Image()
  for (const path of IMAGE_FILES) {
    const img = new Image();
    img.src = BASE + path;
  }

  // Preload audio via <link rel="prefetch"> to avoid blocking
  for (const path of AUDIO_FILES) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = BASE + path;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Preload video via <link rel="prefetch">
  for (const path of VIDEO_FILES) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = BASE + path;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}
