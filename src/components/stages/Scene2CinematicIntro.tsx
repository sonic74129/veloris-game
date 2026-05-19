/**
 * Scene2CinematicIntro — In-place video at the Kinky/Lily character position.
 *
 * NOT a full-screen overlay. The video sits at z-index 1 (behind everything),
 * exactly where the static character images normally appear.
 * While video plays, static characters are hidden.
 * When video ends, video fades out and static characters fade in.
 *
 * Audio: original video dialogue (starts ~2s in) + high-heel footsteps (0–2s loud, then ducked).
 */

import { useRef, useCallback, useEffect, useState } from 'react';

const BASE_URL = import.meta.env.BASE_URL;
const VIDEO_SRC = `${BASE_URL}video/scene2-intro.mp4`;
const HEELS_SRC = `${BASE_URL}audio/high-heels-walk.mp3`;

// Audio volumes
const HEELS_VOL_LOUD = 0.6;
const HEELS_VOL_DUCKED = 0.28;
const HEELS_DUCK_TIME = 2.0; // seconds — dialogue begins here
const VIDEO_VOL = 0.9;

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
  const heelsRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const durationRef = useRef(6);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      heelsRef.current?.pause();
      videoRef.current?.pause();
    };
  }, []);

  const earlyCutTriggered = useRef(false);

  // Ducking loop — heels loud first 2s, then ducked, fade out last 0.5s
  // Also handles early cut: trigger fade-to-black before video actually ends
  const startDuckingLoop = useCallback(() => {
    const tick = () => {
      const v = videoRef.current;
      const h = heelsRef.current;
      if (!v || !h || v.paused) return;
      const t = v.currentTime;
      const remaining = durationRef.current - t;

      // Early cut: trigger ending sequence before video finishes
      if (remaining <= EARLY_CUT_SEC && !earlyCutTriggered.current) {
        earlyCutTriggered.current = true;
        v.pause();
        h.pause();
        cancelAnimationFrame(rafRef.current);
        setPhase('freezing');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, FREEZE_MS);
        return;
      }

      if (remaining <= 0.5 + EARLY_CUT_SEC) {
        h.volume = Math.max(0, HEELS_VOL_DUCKED * ((remaining - EARLY_CUT_SEC) / 0.5));
      } else if (t >= HEELS_DUCK_TIME) {
        const p = Math.min(1, (t - HEELS_DUCK_TIME) / 0.3);
        h.volume = HEELS_VOL_LOUD - (HEELS_VOL_LOUD - HEELS_VOL_DUCKED) * p;
      } else {
        h.volume = HEELS_VOL_LOUD;
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
      const heels = new Audio(HEELS_SRC);
      heels.volume = HEELS_VOL_LOUD;
      heelsRef.current = heels;

      setPhase('playing');

      try {
        await video.play();
      } catch {
        // autoplay blocked — skip gracefully
        setPhase('done');
        onComplete();
        return;
      }
      heels.play().catch(() => {});
      startDuckingLoop();
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
  }, [trigger, phase, onComplete, startDuckingLoop]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) durationRef.current = videoRef.current.duration;
  }, []);

  // If video fails to load entirely, skip gracefully
  const handleError = useCallback(() => {
    if (phase !== 'done') {
      cancelAnimationFrame(rafRef.current);
      heelsRef.current?.pause();
      setPhase('done');
      onComplete();
    }
  }, [phase, onComplete]);

  const handleEnded = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    heelsRef.current?.pause();

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
        // Match Kinky+Lily area: Kinky left:700, Lily left:1080+width
        // Center the video across both characters
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
