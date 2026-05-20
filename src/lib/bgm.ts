/**
 * BGM singleton — shared between App (auto-start) and BottomNav (toggle button).
 * Using a module-level object so there's exactly one Audio element.
 *
 * iOS Safari treats HTMLAudioElement.volume as read-only, so we route BGM through
 * a WebAudio GainNode (the only way to actually duck volume on iOS).
 */

const BGM_MUTED_KEY = 'veloris:bgm:muted';
export const BGM_FULL   = 0.35;
export const BGM_DUCKED = 0.02;

const FADE_MS = 400;

let _audio: HTMLAudioElement | null = null;
let _started = false;
let _onStateChange: ((playing: boolean) => void) | null = null;
let _duckCount = 0;

// WebAudio graph: audio element → MediaElementSource → GainNode → destination
let _ctx: AudioContext | null = null;
let _gain: GainNode | null = null;
let _sourceNode: MediaElementAudioSourceNode | null = null;

function audio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio();
    _audio.loop = true;
    _audio.volume = 1; // gain controlled via WebAudio; element volume kept at 1
    _audio.preload = 'auto';
    _audio.crossOrigin = 'anonymous';
  }
  return _audio;
}

function getCtx(): AudioContext | null {
  if (_ctx) return _ctx;
  try {
    const Ctx = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    _ctx = new Ctx();
  } catch { return null; }
  return _ctx;
}

// Connect BGM audio element through gain node. Idempotent.
// IMPORTANT: createMediaElementSource on iOS silently routes element output to
// the AudioContext destination — if the ctx is still suspended at that moment,
// the audio plays silently forever. So we only connect once ctx is running.
function connectGraph() {
  const ctx = getCtx();
  if (!ctx || _sourceNode) return;
  if (ctx.state !== 'running') {
    ctx.resume().then(() => connectGraph()).catch(() => {});
    return;
  }
  try {
    const a = audio();
    _sourceNode = ctx.createMediaElementSource(a);
    _gain = ctx.createGain();
    _gain.gain.value = BGM_FULL;
    _sourceNode.connect(_gain);
    _gain.connect(ctx.destination);
  } catch {
    // If element was already connected (e.g. HMR), clean refs so element still plays via default route
    _sourceNode = null;
    _gain = null;
  }
}

// iOS Safari requires AudioContext to be created/resumed inside a user gesture handler.
let _audioUnlocked = false;
function unlockAudio() {
  if (_audioUnlocked) return;
  _audioUnlocked = true;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    // Play a 1-sample silent buffer to fully unlock on iOS
    const buffer = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
    // Resume context FIRST, then connect graph. createMediaElementSource on
    // suspended ctx silences the element output on iOS.
    const after = () => connectGraph();
    if (ctx.state === 'suspended') {
      ctx.resume().then(after).catch(after);
    } else {
      after();
    }
  } catch { /* noop */ }
}

export function ensureAudioUnlocked() {
  unlockAudio();
}

export function fade(target: number, ms = FADE_MS) {
  const ctx = getCtx();
  if (_gain && ctx) {
    const now = ctx.currentTime;
    _gain.gain.cancelScheduledValues(now);
    _gain.gain.setValueAtTime(_gain.gain.value, now);
    _gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
    return;
  }
  // Fallback (no WebAudio): set element volume directly
  const a = audio();
  a.volume = Math.min(1, Math.max(0, target));
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
  // Works on iOS too because BGM is routed through a WebAudio GainNode.
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
