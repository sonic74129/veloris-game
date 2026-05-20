import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ensureAudioUnlocked } from '../../lib/bgm';

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
  /** Force play regardless of localStorage (skip "already played" check) */
  forcePlay?: boolean;
  onEnded?: () => void;
  className?: string;
  /** Render as a visual-novel speech bubble panel (always visible from mount) */
  speechBubble?: boolean;
  /** Fallback speaker label when cues have no speaker field (e.g. "MIRANDA") */
  defaultSpeaker?: string;
}

type Status = 'idle' | 'playing' | 'ended' | 'blocked' | 'fallback';

export function SingleFileVoiceoverPlayer({
  voiceover,
  autoPlay = true,
  forcePlay = false,
  onEnded,
  className = '',
  speechBubble = false,
  defaultSpeaker,
}: Props) {
  const { src, storageKey, cues } = voiceover;
  const audioRef    = useRef<HTMLAudioElement>(null);
  const didInit     = useRef(false);
  const prevSpeaker = useRef<string | null>(null);
  const voDucked    = useRef(false);

  const [status,     setStatus]     = useState<Status>('idle');
  const [activeCue,  setActiveCue]  = useState<SubtitleCue | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const startPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    ensureAudioUnlocked();
    setStatus('playing');

    const attemptPlay = () => {
      el.play().then(() => {
        // Only duck BGM after play actually succeeds
        if (!speechBubble) document.dispatchEvent(new CustomEvent('veloris:vo:start'));
      }).catch(() => {
        // iOS: audio not ready — retry once on canplay, then give up
        if (el.readyState < 3) {
          el.addEventListener('canplay', () => {
            el.play().then(() => {
              if (!speechBubble) document.dispatchEvent(new CustomEvent('veloris:vo:start'));
            }).catch(() => { setStatus('blocked'); });
          }, { once: true });
        } else {
          setStatus('blocked');
        }
      });
    };

    if (el.readyState >= 3) {
      attemptPlay();
    } else {
      el.addEventListener('canplay', attemptPlay, { once: true });
    }
  }, []);

  const replay = useCallback(() => {
    const el = audioRef.current;
    if (!el || status === 'fallback') return;
    ensureAudioUnlocked();
    localStorage.removeItem(storageKey);
    el.currentTime = 0;
    setStatus('playing');
    setActiveCue(null);
    el.play().then(() => {
      if (!speechBubble) document.dispatchEvent(new CustomEvent('veloris:vo:start'));
    }).catch(() => {
      setStatus('blocked');
    });
  }, [status, speechBubble, storageKey]);

  const skip = useCallback(() => {
    const el = audioRef.current;
    if (el) { el.pause(); el.currentTime = el.duration || 0; }
    setStatus('ended');
    setActiveCue(null);
    prevSpeaker.current = null;
    document.dispatchEvent(new CustomEvent('veloris:vo:speaker', { detail: { who: null } }));
    localStorage.setItem(storageKey, '1');
    if (!speechBubble) document.dispatchEvent(new CustomEvent('veloris:vo:end'));
    onEnded?.();
  }, [speechBubble, storageKey, onEnded]);

  // ── Wire audio element events ─────────────────────────────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handleCanPlay = () => {
      if (didInit.current || !autoPlay) return;
      didInit.current = true;
      if (forcePlay || localStorage.getItem(storageKey) !== '1') startPlay();
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
      if (!speechBubble) document.dispatchEvent(new CustomEvent('veloris:vo:end'));
      onEnded?.();
    };

    const handleError = () => {
      setStatus('fallback');
    };

    el.addEventListener('canplay',    handleCanPlay);
    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('ended',      handleEnded);
    el.addEventListener('error',      handleError);

    // If media is already buffered before listeners attach, trigger once immediately.
    if (el.readyState >= 3) handleCanPlay();

    return () => {
      el.removeEventListener('canplay',    handleCanPlay);
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('ended',      handleEnded);
      el.removeEventListener('error',      handleError);
      // If unmounted while playing, restore BGM
      if (!el.paused) {
        el.pause();
        if (!speechBubble) document.dispatchEvent(new CustomEvent('veloris:vo:end'));
        document.dispatchEvent(new CustomEvent('veloris:vo:speaker', { detail: { who: null } }));
      }
    };
  }, [autoPlay, cues, startPlay, storageKey, onEnded, speechBubble]);

  // Speech bubble mode: fire initial speaker event immediately on mount so CharacterLayer
  // illuminates the right character even before iOS audio unlocks.
  useEffect(() => {
    if (!speechBubble || !cues.length) return;
    const firstSpeaker = cues[0]?.speaker ?? null;
    if (firstSpeaker) {
      prevSpeaker.current = firstSpeaker;
      document.dispatchEvent(new CustomEvent('veloris:vo:speaker', { detail: { who: firstSpeaker } }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once on mount

  // Speech bubble mode: duck BGM only while audio is actually playing.
  // (Status starts as 'idle' before user gesture unlocks iOS audio; ducking on idle
  // would pause BGM for the entire intro silence.)
  useEffect(() => {
    if (!speechBubble) return;

    const shouldDuck = status === 'playing';

    if (shouldDuck && !voDucked.current) {
      document.dispatchEvent(new CustomEvent('veloris:vo:start'));
      voDucked.current = true;
    }
    if (!shouldDuck && voDucked.current) {
      document.dispatchEvent(new CustomEvent('veloris:vo:end'));
      voDucked.current = false;
    }

    return () => {
      if (voDucked.current) {
        document.dispatchEvent(new CustomEvent('veloris:vo:end'));
        voDucked.current = false;
      }
    };
  }, [speechBubble, status]);

  // If audio failed but we're in speech-bubble mode, still show text (don't hide UI)
  if (status === 'fallback' && !speechBubble) return null;

  const isEmphasis = activeCue?.emphasis ?? false;

  // ── Speech-bubble mode — always visible from mount ───────────────────────
  if (speechBubble) {
    // Show first cue as preview when audio hasn’t started yet
    const displayCue  = activeCue ?? (status !== 'ended' ? cues[0] : null);
    const isPreviewing = !activeCue && status !== 'ended';
    const dispEmphasis = !isPreviewing && (displayCue?.emphasis ?? false);
    const speakerKey   = activeCue?.speaker ?? displayCue?.speaker ?? null;
    const effectiveSpeaker = speakerKey?.toUpperCase() ?? defaultSpeaker?.toUpperCase() ?? null;
    const isLily = effectiveSpeaker === 'LILY';
    const speakerColor = isLily
      ? { color: '#8bc4f0', borderColor: 'rgba(139,196,240,0.5)' }
      : effectiveSpeaker === 'KINKY'
      ? { color: '#c9a84c', borderColor: 'rgba(201,168,76,0.5)' }
      : { color: '#e8d8b4', borderColor: 'rgba(232,216,180,0.4)' };

    return (
      <div className={className}>
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}${src}`} preload="auto" />
        <div
          className="frame-corners relative border border-gold-2/60 px-5 py-4"
          style={{ background: 'linear-gradient(180deg,rgba(10,8,6,0.90) 0%,rgba(16,12,9,0.94) 100%)', backdropFilter: 'blur(14px)' }}
          onClick={status === 'blocked' || status === 'idle' ? () => { replay(); } : undefined}
          role={status === 'blocked' || status === 'idle' ? 'button' : undefined}
          aria-label={status === 'blocked' || status === 'idle' ? 'Tap to play voice' : undefined}
        >
          <span className="c-tl" /><span className="c-br" />

          {/* Header row: speaker label + waveform/dots + right controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {effectiveSpeaker && (
                <span
                  className="font-mono text-[9px] tracking-[0.3em] px-2 py-0.5 border"
                  style={speakerColor}
                >
                  {effectiveSpeaker}
                </span>
              )}
              {/* Waveform when live */}
              {status === 'playing' && activeCue && (
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
              )}
              {/* Pulsing dots while previewing / loading */}
              {isPreviewing && status !== 'blocked' && (
                <motion.span
                  className="font-mono text-[8px] text-warm-4 tracking-widest"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  · · ·
                </motion.span>
              )}
            </div>

            {/* Right controls */}
            {status === 'playing' && activeCue && (
              <button onClick={skip} className="font-mono text-[9px] tracking-[0.2em] text-warm-4 hover:text-warm-3 transition-colors">
                SKIP ×
              </button>
            )}
            {status === 'blocked' && (
              <button onClick={replay} className="font-mono text-[9px] tracking-[0.22em] text-gold-3 hover:text-gold-4 transition-colors">
                ▶ PLAY VOICE
              </button>
            )}
            {status === 'ended' && (
              <button onClick={replay} className="font-mono text-[9px] tracking-[0.2em] text-warm-4 hover:text-warm-3 transition-colors">
                ↺ REPLAY
              </button>
            )}
          </div>

          {/* Subtitle text */}
          {displayCue && (
            <span
              className={
                dispEmphasis
                  ? 'font-brand uppercase tracking-[0.2em] text-[22px] subtitle-shimmer-gold block'
                  : 'font-cn italic text-[19px] tracking-[0.04em] leading-[1.6] subtitle-shimmer block'
              }
              style={isPreviewing ? { opacity: 0.6 } : undefined}
            >
              {displayCue.text}
            </span>
          )}
        </div>
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
