import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StageVoiceover, SubtitleCue } from '../../data/voiceovers/scene0';

export interface VoiceoverHandle {
  replay: () => void;
  skip:   () => void;
}

interface Props {
  voiceover: StageVoiceover;
  /** Auto-play on first mount; won't auto-play on subsequent visits (uses localStorage). */
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

type Status = 'idle' | 'playing' | 'paused' | 'ended' | 'blocked' | 'fallback';

export const VoiceoverPlayer = forwardRef<VoiceoverHandle, Props>(function VoiceoverPlayer(
  { voiceover, autoPlay = true, onEnded, className = '' },
  ref,
) {
  const { src, storageKey, cues } = voiceover;
  const audioRef  = useRef<HTMLAudioElement>(null);
  const didInit   = useRef(false);

  const [status,    setStatus]    = useState<Status>('idle');
  const [activeCue, setActiveCue] = useState<SubtitleCue | null>(null);

  // ── Cue matching ─────────────────────────────────────────────────────────
  const syncCue = useCallback((t: number) => {
    const found = cues.find(c => t >= c.start && t < c.end) ?? null;
    setActiveCue(prev => (prev?.text === found?.text ? prev : found));
  }, [cues]);

  // ── Wire audio events ────────────────────────────────────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => syncCue(el.currentTime);
    const onPlay       = () => setStatus('playing');
    const onPause      = () => setStatus(s => s === 'ended' ? s : 'paused');
    const onEnded_     = () => {
      setStatus('ended');
      setActiveCue(null);
      localStorage.setItem(storageKey, '1');
      onEnded?.();
    };
    const onError      = () => setStatus('fallback');   // missing file → silent
    const onCanPlay    = () => {
      if (!didInit.current && autoPlay) {
        didInit.current = true;
        const alreadyPlayed = localStorage.getItem(storageKey) === '1';
        if (!alreadyPlayed) {
          el.play().catch(() => setStatus('blocked'));
        }
      }
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('play',       onPlay);
    el.addEventListener('pause',      onPause);
    el.addEventListener('ended',      onEnded_);
    el.addEventListener('error',      onError);
    el.addEventListener('canplay',    onCanPlay);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('play',       onPlay);
      el.removeEventListener('pause',      onPause);
      el.removeEventListener('ended',      onEnded_);
      el.removeEventListener('error',      onError);
      el.removeEventListener('canplay',    onCanPlay);
    };
  }, [autoPlay, onEnded, storageKey, syncCue]);

  // ── Imperative handle for parent-driven replay / skip ───────────────────
  const replay = useCallback(() => {
    const el = audioRef.current;
    if (!el || status === 'fallback') return;
    el.currentTime = 0;
    el.play().catch(() => setStatus('blocked'));
  }, [status]);

  const skip = useCallback(() => {
    const el = audioRef.current;
    if (el) { el.pause(); el.currentTime = el.duration || 0; }
    setStatus('ended');
    setActiveCue(null);
    localStorage.setItem(storageKey, '1');
    onEnded?.();
  }, [onEnded, storageKey]);

  useImperativeHandle(ref, () => ({ replay, skip }), [replay, skip]);

  // ── Fallback: audio missing / browser blocked ────────────────────────────
  const isFallback = status === 'fallback';

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Hidden audio element */}
      {!isFallback && (
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}${src}`}
          preload="auto"
        />
      )}

      {/* ── Subtitle bar ─────────────────────────────────────────────────── */}
      <div className="min-h-[28px] flex items-center justify-start">
        <AnimatePresence mode="wait">
          {(status === 'playing' || status === 'paused') && activeCue && (
            <motion.div
              key={activeCue.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={
                activeCue.highlight
                  ? 'font-brand text-[19px] tracking-[0.18em] text-gold-4 uppercase'
                  : 'font-cn italic text-[16px] tracking-[0.04em] text-warm-1 leading-[1.6]'
              }
            >
              {activeCue.highlight && (
                <span className="mr-2 text-gold-3 text-[10px] font-mono tracking-widest not-italic">
                  ▶
                </span>
              )}
              {activeCue.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Control buttons ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Autoplay blocked → show manual play prompt */}
        {status === 'blocked' && (
          <button
            onClick={replay}
            className="flex items-center gap-1.5 px-3 py-1 border border-gold-3/60
                       text-gold-3 font-mono text-[9px] tracking-[0.22em]
                       hover:bg-gold-3/10 transition-colors"
          >
            <span>▶</span> PLAY VOICE
          </button>
        )}

        {/* Playing / paused → skip */}
        {(status === 'playing' || status === 'paused') && (
          <button
            onClick={skip}
            className="font-mono text-[9px] tracking-[0.2em] text-warm-4 hover:text-warm-3 transition-colors"
          >
            SKIP ×
          </button>
        )}

        {/* Ended → replay */}
        {status === 'ended' && (
          <button
            onClick={replay}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em]
                       text-warm-4 hover:text-warm-3 transition-colors"
          >
            <span>↺</span> REPLAY VOICE
          </button>
        )}

        {/* Waveform indicator while playing */}
        {status === 'playing' && (
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
        )}
      </div>
    </div>
  );
});
