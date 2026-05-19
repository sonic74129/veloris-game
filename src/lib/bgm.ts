/**
 * BGM singleton — shared between App (auto-start) and BottomNav (toggle button).
 * Using a module-level object so there's exactly one Audio element.
 */

const BGM_MUTED_KEY = 'veloris:bgm:muted';
export const BGM_FULL   = 0.35;
export const BGM_DUCKED = 0.07;

const FADE_MS = 700;

let _audio: HTMLAudioElement | null = null;
let _started = false;
let _onStateChange: ((playing: boolean) => void) | null = null;
let _fadeId: ReturnType<typeof setInterval> | null = null;

function audio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio();
    _audio.loop = true;
    _audio.volume = BGM_FULL;
    _audio.preload = 'auto';
  }
  return _audio;
}

export function fade(target: number, ms = FADE_MS) {
  // Cancel any in-progress fade to prevent competing intervals
  if (_fadeId !== null) { clearInterval(_fadeId); _fadeId = null; }
  const a = audio();
  const start = a.volume;
  const steps = 30;
  const delta = (target - start) / steps;
  let i = 0;
  _fadeId = setInterval(() => {
    i++;
    a.volume = Math.min(1, Math.max(0, start + delta * i));
    if (i >= steps) { clearInterval(_fadeId!); _fadeId = null; }
  }, ms / steps);
}

/** Call once at App mount — registers first-interaction auto-start. */
export function initBgm(
  baseUrl: string,
  onStateChange: (playing: boolean) => void,
) {
  _onStateChange = onStateChange;
  const a = audio();

  const tryStart = () => {
    if (_started) return;
    if (localStorage.getItem(BGM_MUTED_KEY) === '1') return;
    _started = true;
    if (!a.src) a.src = baseUrl + 'assets/bgm.mp3';
    a.play().then(() => _onStateChange?.(true)).catch(() => {});
  };

  document.addEventListener('click',   tryStart, { once: true, capture: true });
  document.addEventListener('keydown', tryStart, { once: true });

  const onVoStart = () => fade(BGM_DUCKED);
  const onVoEnd   = () => fade(BGM_FULL);
  document.addEventListener('veloris:vo:start', onVoStart);
  document.addEventListener('veloris:vo:end',   onVoEnd);

  return () => {
    document.removeEventListener('click',            tryStart, { capture: true });
    document.removeEventListener('keydown',          tryStart);
    document.removeEventListener('veloris:vo:start', onVoStart);
    document.removeEventListener('veloris:vo:end',   onVoEnd);
    a.pause();
    a.src = '';
    _audio   = null;
    _started = false;
  };
}

/** Toggle mute/unmute — called from BottomNav button. */
export function toggleBgm(onStateChange: (playing: boolean) => void) {
  const a = audio();
  if (!a.paused) {
    a.pause();
    localStorage.setItem(BGM_MUTED_KEY, '1');
    onStateChange(false);
  } else {
    if (!a.src) a.src = import.meta.env.BASE_URL + 'assets/bgm.mp3';
    _started = true;
    a.play().then(() => onStateChange(true)).catch(() => {});
    localStorage.removeItem(BGM_MUTED_KEY);
  }
}

export function isBgmPlaying(): boolean {
  return _audio ? !_audio.paused : false;
}
