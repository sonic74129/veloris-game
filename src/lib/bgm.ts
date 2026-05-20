/**
 * BGM singleton — shared between App (auto-start) and BottomNav (toggle button).
 * Using a module-level object so there's exactly one Audio element.
 */

const BGM_MUTED_KEY = 'veloris:bgm:muted';
export const BGM_FULL   = 0.35;
export const BGM_DUCKED = 0.02;

const FADE_MS = 400;

let _audio: HTMLAudioElement | null = null;
let _started = false;
let _onStateChange: ((playing: boolean) => void) | null = null;
let _fadeId: ReturnType<typeof setInterval> | null = null;
let _duckCount = 0;

function audio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio();
    _audio.loop = true;
    _audio.volume = BGM_FULL;
    _audio.preload = 'auto';
  }
  return _audio;
}

// iOS Safari requires AudioContext to be created/resumed inside a user gesture handler.
// Unlock once on the first user interaction so subsequent HTMLAudioElement plays succeed.
let _audioUnlocked = false;
function unlockAudio() {
  if (_audioUnlocked) return;
  _audioUnlocked = true;
  try {
    const Ctx = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  } catch { /* noop */ }
}

export function ensureAudioUnlocked() {
  unlockAudio();
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
    unlockAudio();
    if (_started) return;
    if (localStorage.getItem(BGM_MUTED_KEY) === '1') {
      // Remove gesture listeners — user explicitly muted
      removeGestureListeners();
      return;
    }
    _started = true;
    const a2 = audio();
    if (!a2.src) a2.src = baseUrl + 'assets/bgm.mp3';

    const attemptPlay = () => {
      a2.play().then(() => {
        _onStateChange?.(true);
        a2.removeEventListener('canplay', attemptPlay);
        removeGestureListeners();
      }).catch(() => {
        // Play rejected — allow next gesture to retry
        _started = false;
        a2.addEventListener('canplay', attemptPlay, { once: true });
      });
    };

    if (a2.readyState >= 3) {
      attemptPlay();
    } else {
      a2.addEventListener('canplay', attemptPlay, { once: true });
    }
  };

  // Keep listeners active — iOS may need multiple gestures before audio works
  const gestureHandler = () => { tryStart(); };
  const removeGestureListeners = () => {
    document.removeEventListener('click',    gestureHandler, { capture: true });
    document.removeEventListener('touchend', gestureHandler, { capture: true });
  };
  document.addEventListener('click',     gestureHandler, { capture: true });
  document.addEventListener('touchend',  gestureHandler, { capture: true });
  document.addEventListener('touchstart', unlockAudio, { once: true, capture: true });

  // Reference-counted ducking so concurrent VO dispatches don't double-duck or prematurely restore.
  const onVoStart = () => {
    _duckCount++;
    if (_duckCount === 1) fade(BGM_DUCKED);
  };
  const onVoEnd = () => {
    _duckCount = Math.max(0, _duckCount - 1);
    if (_duckCount === 0) fade(BGM_FULL);
  };
  document.addEventListener('veloris:vo:start', onVoStart);
  document.addEventListener('veloris:vo:end',   onVoEnd);

  return () => {
    document.removeEventListener('click',            gestureHandler, { capture: true });
    document.removeEventListener('touchend',         gestureHandler, { capture: true });
    document.removeEventListener('touchstart',       unlockAudio, { capture: true });
    document.removeEventListener('veloris:vo:start', onVoStart);
    document.removeEventListener('veloris:vo:end',   onVoEnd);
    a.pause();
    a.src = '';
    _audio   = null;
    _started = false;
    _duckCount = 0;
  };
}

/** Toggle mute/unmute — called from BottomNav button. */
export function toggleBgm(onStateChange: (playing: boolean) => void) {
  unlockAudio();
  const a = audio();
  if (!a.paused) {
    a.pause();
    localStorage.setItem(BGM_MUTED_KEY, '1');
    onStateChange(false);
  } else {
    if (!a.src) a.src = import.meta.env.BASE_URL + 'assets/bgm.mp3';
    _started = true;
    a.play().then(() => onStateChange(true)).catch(() => { _started = false; onStateChange(false); });
    localStorage.removeItem(BGM_MUTED_KEY);
  }
}

export function isBgmPlaying(): boolean {
  return _audio ? !_audio.paused : false;
}
