import { useRef, useState, useEffect, useCallback } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { packs } from '../../data';
import { useMobile } from '../../lib/mobile';
import type { Language } from '../../data/types';

export function BottomNav() {
  const language = useGameState((s) => s.language);
  const setLanguage = useGameState((s) => s.setLanguage);
  const goToStage = useGameState((s) => s.goToStage);
  const ui = packs[language].ui;

  const items = [
    { key: 'warRoom', label: ui.nav.warRoom, onClick: () => goToStage('mission') },
    { key: 'teams', label: ui.nav.teams },
    { key: 'data', label: ui.nav.data },
    { key: 'aiHub', label: ui.nav.aiHub },
    { key: 'competition', label: ui.nav.competition },
    { key: 'roadmap', label: ui.nav.roadmap, onClick: () => goToStage('map') },
    { key: 'settings', label: ui.nav.settings },
  ];

  const isMobile = useMobile();

  if (isMobile) {
    return (
      <nav className="absolute bottom-0 left-0 right-0 h-[48px] flex items-center
                      px-5 z-30 bg-gradient-to-t from-ink-0/95 to-transparent
                      pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button onClick={() => goToStage('mission')}
                  className="px-3 py-1 font-cns text-[16px] text-warm-2 hover:text-gold-4">
            {ui.nav.warRoom}
          </button>
          <button onClick={() => goToStage('map')}
                  className="px-3 py-1 font-cns text-[16px] text-warm-2 hover:text-gold-4">
            {ui.nav.roadmap}
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2 pointer-events-auto">
          <BgmToggle />
          <LangToggle current={language} onChange={setLanguage} />
        </div>
      </nav>
    );
  }

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[68px] flex items-center
                    px-9 z-30 bg-gradient-to-t from-ink-0/95 via-ink-0/70 to-transparent
                    border-t border-gold-1 pointer-events-none">
      <div className="flex items-center gap-1 pointer-events-auto">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={it.onClick}
            className="group px-4 py-2 font-cns text-[13px] tracking-[0.18em] text-warm-2
                       hover:text-gold-4 transition-colors relative"
          >
            {it.label}
            <span className="absolute left-3 right-3 bottom-0 h-px bg-gold-3 scale-x-0
                             group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3 pointer-events-auto">
        <BgmToggle />
        <LangToggle current={language} onChange={setLanguage} />
      </div>
    </nav>
  );
}

function LangToggle({ current, onChange }: { current: Language; onChange: (l: Language) => void }) {
  return (
    <div className="flex items-center border border-gold-2 rounded-full overflow-hidden bg-ink-2/60">
      {(['zh', 'en'] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1 font-mono text-[10px] tracking-[0.28em] transition-colors ${
            current === l ? 'bg-gold-3 text-ink-0' : 'text-warm-2 hover:text-gold-4'
          }`}
        >
          {l === 'zh' ? '中' : 'EN'}
        </button>
      ))}
    </div>
  );
}

const BGM_URL = import.meta.env.BASE_URL + 'assets/bgm.mp3';

function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [_, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(BGM_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;
    audio.addEventListener('canplaythrough', () => setReady(true), { once: true });
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  return (
    <button
      onClick={toggle}
      title={playing ? 'Mute BGM' : 'Play BGM'}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                  ${playing
                    ? 'border-gold-4 text-gold-4 bg-ink-2/80'
                    : 'border-warm-4 text-warm-3 bg-ink-2/60 hover:border-gold-3 hover:text-gold-3'}`}
    >
      {playing ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          <path d="M19 12c0 2.97-1.65 5.54-4 6.71V19.1c3.06-1.28 5-4.35 5-7.1s-1.94-5.82-5-7.1v2.39c2.35 1.17 4 3.74 4 6.71z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" opacity="0.3" />
        </svg>
      )}
    </button>
  );
}
