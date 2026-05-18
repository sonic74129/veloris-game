import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VoiceoverScript, VoiceLine } from '../../lib/voiceover/types';
import { stripTag } from '../../lib/voiceover/buildSSML';

export interface VoiceoverHandle {
  replay: () => void;
  skip:   () => void;
}

interface Props {
  script: VoiceoverScript;
  /** Subdirectory under public/ where per-line MP3s live. e.g. "audio/scene0/ava" */
  audioBasePath: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

type Status = 'idle' | 'playing' | 'ended' | 'blocked' | 'fallback';

export const VoiceoverPlayer = forwardRef<VoiceoverHandle, Props>(function VoiceoverPlayer(
  { script, audioBasePath, autoPlay = true, onEnded, className = '' },
  ref,
) {
  const { storageKey, lines } = script;
  const audioRef    = useRef<HTMLAudioElement>(null);
  const pauseTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineIdxRef  = useRef(-1);      // current line index (-1 = not started)
  const didInit     = useRef(false);

  const [status,      setStatus]      = useState<Status>('idle');
  const [activeLine,  setActiveLine]  = useState<VoiceLine | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearPause = () => {
    if (pauseTimer.current !== null) { clearTimeout(pauseTimer.current); pauseTimer.current = null; }
  };

  // ── Line sequencer ────────────────────────────────────────────────────────
  const playLine = useCallback((index: number) => {
    const el = audioRef.current;
    if (!el) return;

    if (index >= lines.length) {
      setStatus('ended');
      setActiveLine(null);
      lineIdxRef.current = -1;
      localStorage.setItem(storageKey, '1');
      onEnded?.();
      return;
    }

    const line = lines[index];
    lineIdxRef.current = index;
    setActiveLine(line);
    setStatus('playing');

    el.src = `${import.meta.env.BASE_URL}${audioBasePath}/${line.id}.mp3`;
    el.load();
    el.play().catch(() => { if (index === 0) setStatus('blocked'); });
  }, [lines, audioBasePath, storageKey, onEnded]);

  // ── Wire audio element events ─────────────────────────────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handleEnded = () => {
      const idx  = lineIdxRef.current;
      const line = lines[idx];
      const delay = line?.pauseAfterMs ?? 0;
      clearPause();
      pauseTimer.current = setTimeout(() => playLine(idx + 1), delay);
    };

    const handleError = () => {
      // First line fails → silent fallback; subsequent lines → skip
      if (lineIdxRef.current <= 0) { setStatus('fallback'); return; }
      const idx  = lineIdxRef.current;
      const line = lines[idx];
      pauseTimer.current = setTimeout(() => playLine(idx + 1), line?.pauseAfterMs ?? 0);
    };

    const handleCanPlay = () => {
      if (didInit.current || !autoPlay) return;
      didInit.current = true;
      if (localStorage.getItem(storageKey) !== '1') playLine(0);
    };

    el.addEventListener('ended',   handleEnded);
    el.addEventListener('error',   handleError);
    el.addEventListener('canplay', handleCanPlay);

    return () => {
      el.removeEventListener('ended',   handleEnded);
      el.removeEventListener('error',   handleError);
      el.removeEventListener('canplay', handleCanPlay);
      clearPause();
    };
  }, [autoPlay, lines, playLine, storageKey]);

  // ── Imperative handle ────────────────────────────────────────────────────
  const replay = useCallback(() => {
    if (status === 'fallback') return;
    clearPause();
    lineIdxRef.current = -1;
    localStorage.removeItem(storageKey);
    playLine(0);
  }, [status, storageKey, playLine]);

  const skip = useCallback(() => {
    const el = audioRef.current;
    clearPause();
    if (el) { el.pause(); el.src = ''; }
    lineIdxRef.current = -1;
    setStatus('ended');
    setActiveLine(null);
    localStorage.setItem(storageKey, '1');
    onEnded?.();
  }, [storageKey, onEnded]);

  useImperativeHandle(ref, () => ({ replay, skip }), [replay, skip]);

  if (status === 'fallback') return null;

  const displayText = activeLine ? stripTag(activeLine.text) : '';
  const isEmphasis  = activeLine?.emphasis ?? false;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Single shared audio element — src swapped per line */}
      <audio ref={audioRef} preload="none" />

      {/* ── Subtitle ────────────────────────────────────────────────────── */}
      <div className="min-h-[32px] flex items-center">
        <AnimatePresence mode="wait">
          {status === 'playing' && activeLine && (
            <motion.div
              key={activeLine.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className={
                isEmphasis
                  ? 'font-brand uppercase tracking-[0.2em] text-[19px] text-gold-4'
                  : 'font-cn italic text-[16px] tracking-[0.04em] text-warm-1 leading-[1.6]'
              }
            >
              {isEmphasis && (
                <span className="mr-2 text-gold-3 text-[10px] font-mono not-italic">▶</span>
              )}
              {displayText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {status === 'blocked' && (
          <button
            onClick={replay}
            className="flex items-center gap-1.5 px-3 py-1 border border-gold-3/60
                       text-gold-3 font-mono text-[9px] tracking-[0.22em]
                       hover:bg-gold-3/10 transition-colors"
          >
            ▶ PLAY VOICE
          </button>
        )}
        {status === 'playing' && (
          <>
            <button
              onClick={skip}
              className="font-mono text-[9px] tracking-[0.2em] text-warm-4 hover:text-warm-3 transition-colors"
            >
              SKIP ×
            </button>
            <div className="flex items-end gap-[2px] h-[12px]">
              {[3, 5, 7, 4, 6].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-gold-3/60 rounded-full"
                  animate={{ height: [h, h * 1.8, h] }}
                  transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
                  style={{ height: h }}
                />
              ))}
            </div>
          </>
        )}
        {status === 'ended' && (
          <button
            onClick={replay}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em]
                       text-warm-4 hover:text-warm-3 transition-colors"
          >
            ↺ REPLAY VOICE
          </button>
        )}
      </div>
    </div>
  );
});
