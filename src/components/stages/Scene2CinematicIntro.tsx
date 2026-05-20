/**
 * Scene2CinematicIntro — In-place video at the Kinky/Lily character position.
 *
 * Video is always muted (avoids autoplay policy issues).
 * Audio is played via a separate <audio> element (reliable across browsers).
 * Dialogue is handled separately by SingleFileVoiceoverPlayer in LevelMap (after video ends).
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { ensureAudioUnlocked } from '../../lib/bgm';

const BASE_URL = import.meta.env.BASE_URL;
const VIDEO_SRC = `${BASE_URL}video/scene2-intro.mp4`;
const AUDIO_SRC = `${BASE_URL}audio/scene2-intro-sfx.mp3`;

const FREEZE_MS = 0;
const FADE_MS = 400;
const EARLY_CUT_SEC = 0.7;

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const durationRef = useRef(6);
  const earlyCutTriggered = useRef(false);
  const duckActiveRef = useRef(false);

  const startBgmDuck = useCallback(() => {
    if (duckActiveRef.current) return;
    duckActiveRef.current = true;
    window.dispatchEvent(new Event('veloris:vo:start'));
  }, []);

  const endBgmDuck = useCallback(() => {
    if (!duckActiveRef.current) return;
    duckActiveRef.current = false;
    window.dispatchEvent(new Event('veloris:vo:end'));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      videoRef.current?.pause();
      audioRef.current?.pause();
      endBgmDuck();
    };
  }, [endBgmDuck]);

  // RAF loop: handle early cut (fade to black before video end)
  const startLoop = useCallback(() => {
    const tick = () => {
      const v = videoRef.current;
      if (!v || v.paused) return;
      const remaining = durationRef.current - v.currentTime;

      if (remaining <= EARLY_CUT_SEC && !earlyCutTriggered.current) {
        earlyCutTriggered.current = true;
        v.pause();
        if (audioRef.current) audioRef.current.pause();
        cancelAnimationFrame(rafRef.current);
        endBgmDuck();
        setPhase('freezing');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, FREEZE_MS);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete, endBgmDuck]);

  // Start playback
  useEffect(() => {
    if (!trigger || phase !== 'idle') return;
    const video = videoRef.current;
    if (!video) return;

    const startPlayback = async () => {
      setPhase('playing');
      ensureAudioUnlocked();

      // Video always muted — audio via separate <audio> element
      video.muted = true;
      try {
        await video.play();
      } catch {
        // Video can't play at all — skip cinematic
        setPhase('done');
        onComplete();
        return;
      }

      // Duck BGM while cinematic SFX is playing
      startBgmDuck();

      // Play audio SFX (separate element, reliable autoplay)
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      startLoop();
    };

    if (video.readyState >= 3) {
      startPlayback();
    } else {
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        startPlayback();
      };
      video.addEventListener('canplay', onCanPlay);

      const timeout = setTimeout(() => {
        video.removeEventListener('canplay', onCanPlay);
        if (phase === 'idle') {
          endBgmDuck();
          setPhase('done');
          onComplete();
        }
      }, 5000);

      return () => {
        clearTimeout(timeout);
        video.removeEventListener('canplay', onCanPlay);
      };
    }
  }, [trigger, phase, onComplete, startLoop, startBgmDuck, endBgmDuck]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) durationRef.current = videoRef.current.duration;
  }, []);

  const handleError = useCallback(() => {
    if (phase !== 'done') {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      endBgmDuck();
      setPhase('done');
      onComplete();
    }
  }, [phase, onComplete, endBgmDuck]);

  const handleEnded = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    audioRef.current?.pause();
    endBgmDuck();
    setPhase('freezing');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, FREEZE_MS);
  }, [onComplete, endBgmDuck]);

  // Video is hidden once done (parent shows static characters)
  const isVisible = phase === 'playing' || phase === 'freezing';

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        preload="auto"
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        className="pointer-events-none"
        style={{
          position: 'absolute',
          left: 475,
          bottom: 345,
          height: 640,
          width: 'auto',
          zIndex: 1,
          objectFit: 'contain',
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
          filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))',
          borderRadius: 8,
        }}
      />
    </>
  );
}
