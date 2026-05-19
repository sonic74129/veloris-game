/**
 * Scene2CinematicIntro — In-place video at the Kinky/Lily character position.
 *
 * Video has high-heels sound embedded. Dialogue (kinky-lily-map-zh.mp3) starts 2s after video.
 * Video fades to black early (EARLY_CUT_SEC before end).
 */

import { useRef, useCallback, useEffect, useState } from 'react';

const BASE_URL = import.meta.env.BASE_URL;
const VIDEO_SRC = `${BASE_URL}video/scene2-intro.mp4`;
const DIALOGUE_SRC = `${BASE_URL}audio/kinky-lily-map-zh.mp3`;

// Volumes
const VIDEO_VOL = 1.0;
const DIALOGUE_VOL = 1.0;
const DIALOGUE_DELAY = 2.0; // seconds after video starts

const FREEZE_MS = 300;
const FADE_MS = 600;
const EARLY_CUT_SEC = 1.5; // start fade-to-black this many seconds before video end

export type CinematicPhase = 'idle' | 'playing' | 'freezing' | 'done';

interface Props {
  /** When true, starts playback (flip once per mount) */
  trigger: boolean;
  /** Fires when video is fully done and characters should appear */
  onComplete: () => void;
}

/**
 * Renders the video element positioned at the Kinky/Lily location.
 * Parent (LevelMap) controls character visibility based on phase.
 */
export function Scene2CinematicIntro({ trigger, onComplete }: Props) {
  const [phase, setPhase] = useState<CinematicPhase>('idle');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dialogueRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const durationRef = useRef(6);
  const dialogueStarted = useRef(false);
  const earlyCutTriggered = useRef(false);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      dialogueRef.current?.pause();
      videoRef.current?.pause();
    };
  }, []);

  // RAF loop: start dialogue at 2s, handle early cut
  const startLoop = useCallback(() => {
    const tick = () => {
      const v = videoRef.current;
      if (!v || v.paused) return;
      const t = v.currentTime;
      const remaining = durationRef.current - t;

      // Early cut: trigger ending sequence before video finishes
      if (remaining <= EARLY_CUT_SEC && !earlyCutTriggered.current) {
        earlyCutTriggered.current = true;
        v.pause();
        dialogueRef.current?.pause();
        cancelAnimationFrame(rafRef.current);
        setPhase('freezing');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, FREEZE_MS);
        return;
      }

      // Start dialogue at DIALOGUE_DELAY seconds
      if (t >= DIALOGUE_DELAY && !dialogueStarted.current) {
        dialogueStarted.current = true;
        const d = dialogueRef.current;
        if (d) {
          d.volume = DIALOGUE_VOL;
          d.play().catch(() => {});
        }
      }

      // Fade dialogue out near end
      const d = dialogueRef.current;
      if (d && dialogueStarted.current && remaining <= 1.0 + EARLY_CUT_SEC) {
        d.volume = Math.max(0, DIALOGUE_VOL * ((remaining - EARLY_CUT_SEC) / 1.0));
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  // Start playback — wait for video to be ready before calling play()
  useEffect(() => {
    if (!trigger || phase !== 'idle') return;
    const video = videoRef.current;
    if (!video) return;

    video.volume = VIDEO_VOL;
    video.muted = false;

    const startPlayback = async () => {
      // Preload dialogue audio
      const dialogue = new Audio(DIALOGUE_SRC);
      dialogue.preload = 'auto';
      dialogueRef.current = dialogue;

      setPhase('playing');

      try {
        await video.play();
      } catch {
        setPhase('done');
        onComplete();
        return;
      }

      startLoop();
    };

    // If video is already ready, start immediately; otherwise wait for canplay
    if (video.readyState >= 3) {
      startPlayback();
    } else {
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        startPlayback();
      };
      video.addEventListener('canplay', onCanPlay);

      // Timeout fallback — if video doesn't load in 5s, skip cinematic
      const timeout = setTimeout(() => {
        video.removeEventListener('canplay', onCanPlay);
        if (phase === 'idle') {
          setPhase('done');
          onComplete();
        }
      }, 5000);

      return () => {
        clearTimeout(timeout);
        video.removeEventListener('canplay', onCanPlay);
      };
    }
  }, [trigger, phase, onComplete, startLoop]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) durationRef.current = videoRef.current.duration;
  }, []);

  const handleError = useCallback(() => {
    if (phase !== 'done') {
      cancelAnimationFrame(rafRef.current);
      dialogueRef.current?.pause();
      setPhase('done');
      onComplete();
    }
  }, [phase, onComplete]);

  const handleEnded = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    dialogueRef.current?.pause();

    setPhase('freezing');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, FREEZE_MS);
  }, [onComplete]);

  // Video is hidden once done (parent shows static characters)
  const isVisible = phase === 'playing' || phase === 'freezing';

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      preload="auto"
      playsInline
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      onError={handleError}
      className="pointer-events-none"
      style={{
        position: 'absolute',
        left: 680,
        bottom: 300,
        height: 700,
        width: 'auto',
        zIndex: 1,
        objectFit: 'contain',
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
        filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))',
        borderRadius: 8,
      }}
    />
  );
}
