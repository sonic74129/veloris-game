import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SubtitleCue {
  start: number;       // audio currentTime (seconds) — cue becomes active
  end: number;
  text: string;
  emphasis?: boolean;  // gold + uppercase treatment
  speaker?: string;    // e.g. 'kinky' | 'lily' — fires veloris:vo:speaker event
}

export interface SingleFileVoiceover {
  /** Path relative to public/ — no leading slash. e.g. "audio/miranda-scene0-zh.mp3" */
  src: string;
  /** localStorage key used to guard first-play auto-trigger. */
  storageKey: string;
  cues: SubtitleCue[];
}

interface Props {
  voiceover: SingleFileVoiceover;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
  /** Render as a visual-novel speech bubble panel (LevelMap) */
  speechBubble?: boolean;
}

type Status = 'idle' | 'playing' | 'ended' | 'blocked' | 'fallback';

export function SingleFileVoiceoverPlayer({
  voiceover,
  autoPlay = true,
  onEnded,
  className = '',
  speechBubble = false,
}: Props) {
  const { src, storageKey, cues } = voiceover;
  const audioRef    = useRef<HTMLAudioElement>(null);
  const didInit     = useRef(false);
  const prevSpeaker = useRef<string | null>(null);

  const [status,     setStatus]     = useState<Status>('idle');
  const [activeCue,  setActiveCue]  = useState<SubtitleCue | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const startPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    setStatus('playing');
    document.dispatchEvent(new CustomEvent('veloris:vo:start'));
    el.play().catch(() => setStatus('blocked'));
  }, []);

  const replay = useCallback(() => {
    const el = audioRef.current;
    if (!el || status === 'fallback') return;
    localStorage.removeItem(storageKey);
    el.currentTime = 0;
    setStatus('playing');
    setActiveCue(null);
    document.dispatchEvent(new CustomEvent('veloris:vo:start'));
    el.play().catch(() => setStatus('blocked'));
  }, [status, storageKey]);

  const skip = useCallback(() => {
    const el = audioRef.current;
    if (el) { el.pause(); el.currentTime = el.duration || 0; }
    setStatus('ended');
    setActiveCue(null);
    prevSpeaker.current = null;
    document.dispatchEvent(new CustomEvent('veloris:vo:speaker', { detail: { who: null } }));
    localStorage.setItem(storageKey, '1');
    document.dispatchEvent(new CustomEvent('veloris:vo:end'));
    onEnded?.();
  }, [storageKey, onEnded]);

  // ── Wire audio element events ─────────────────────────────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handleCanPlay = () => {
      if (didInit.current || !autoPlay) return;
      didInit.current = true;
      if (localStorage.getItem(storageKey) !== '1') startPlay();
    };

    const handleTimeUpdate = () => {
      const t = el.currentTime;
      const cue = cues.find(c => t >= c.start && t < c.end) ?? null;
      setActiveCue(cue);
      const who = cue?.speaker ?? null;
      if (who !== prevSpeaker.current) {
        prevSpeaker.current = who;
        document.dispatchEvent(new CustomEvent('veloris:vo:speaker', { detail: { who } }));
      }
    };

    const handleEnded = () => {
      setStatus('ended');
      setActiveCue(null);
      prevSpeaker.current = null;
      document.dispatchEvent(new CustomEvent('veloris:vo:speaker', { detail: { who: null } }));
      localStorage.setItem(storageKey, '1');
      document.dispatchEvent(new CustomEvent('veloris:vo:end'));
      onEnded?.();
    };

    const handleError = () => {
      setStatus('fallback');
    };

    el.addEventListener('canplay',    handleCanPlay);
    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('ended',      handleEnded);
    el.addEventListener('error',      handleError);

    return () => {
      el.removeEventListener('canplay',    handleCanPlay);
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('ended',      handleEnded);
      el.removeEventListener('error',      handleError);
    };
  }, [autoPlay, cues, startPlay, storageKey, onEnded]);

  if (status === 'fallback') return null;

  const isEmphasis = activeCue?.emphasis ?? false;

  // ── Speech-bubble mode (LevelMap) ─────────────────────────────────────────
  if (speechBubble) {
    const speakerLabel = activeCue?.speaker === 'lily' ? 'LILY' : activeCue?.speaker === 'kinky' ? 'KINKY' : null;
    const isLily = activeCue?.speaker === 'lily';
    return (
      <div className={className}>
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}${src}`} preload="auto" />
        <AnimatePresence>
          {status === 'playing' && activeCue && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="frame-corners relative border border-gold-2/60 px-6 py-4"
              style={{ background: 'linear-gradient(180deg,rgba(10,8,6,0.90) 0%,rgba(16,12,9,0.94) 100%)', backdropFilter: 'blur(14px)' }}
            >
              <span className="c-tl" /><span className="c-br" />
              {/* Speaker name + waveform + skip */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {speakerLabel && (
                    <span
                      className="font-mono text-[9px] tracking-[0.3em] px-2 py-0.5 border"
                      style={isLily
                        ? { color: '#8bc4f0', borderColor: 'rgba(139,196,240,0.5)' }
                        : { color: '#c9a84c', borderColor: 'rgba(201,168,76,0.5)' }
                      }
                    >
                      {speakerLabel}
                    </span>
                  )}
                  <div className="flex items-end gap-[2px] h-[12px]">
                    {[3, 5, 7, 4, 6].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[2px] rounded-full"
                        style={{ background: isLily ? 'rgba(139,196,240,0.7)' : 'rgba(201,168,76,0.7)', height: h }}
                        animate={{ height: [h, h * 1.8, h] }}
                        transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={skip}
                  className="font-mono text-[9px] tracking-[0.2em] text-warm-4 hover:text-warm-3 transition-colors"
                >
                  SKIP ×
                </button>
              </div>
              {/* Shimmer subtitle */}
              <span
                className={
                  isEmphasis
                    ? 'font-brand uppercase tracking-[0.2em] text-[22px] subtitle-shimmer-gold block'
                    : 'font-cn italic text-[19px] tracking-[0.04em] leading-[1.6] subtitle-shimmer block'
                }
              >
                {activeCue.text}
              </span>
            </motion.div>
          )}
          {status === 'blocked' && (
            <motion.button key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={replay}
              className="flex items-center gap-1.5 px-3 py-1 border border-gold-3/60
                         text-gold-3 font-mono text-[9px] tracking-[0.22em]
                         hover:bg-gold-3/10 transition-colors"
            >
              ▶ PLAY VOICE
            </motion.button>
          )}
          {status === 'ended' && (
            <motion.button key="ended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={replay}
              className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em]
                         text-warm-4 hover:text-warm-3 transition-colors"
            >
              ↺ REPLAY VOICE
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}${src}`}
        preload="auto"
      />

      {/* ── Subtitle ──────────────────────────────────────────────────────── */}
      <div className="min-h-[52px] flex items-center">
        <AnimatePresence mode="wait">
          {status === 'playing' && activeCue && (
            <motion.div
              key={activeCue.start}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-baseline gap-2"
            >
              {isEmphasis && (
                <span className="text-gold-3 text-[11px] font-mono flex-shrink-0">▶</span>
              )}
              <span
                className={
                  isEmphasis
                    ? 'font-brand uppercase tracking-[0.2em] text-[22px] subtitle-shimmer-gold'
                    : 'font-cn italic text-[19px] tracking-[0.04em] leading-[1.6] subtitle-shimmer'
                }
              >
                {activeCue.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ──────────────────────────────────────────────────────── */}
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
}
