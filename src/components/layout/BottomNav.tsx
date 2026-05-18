import { useGameState } from '../../hooks/useGameState';
import { packs } from '../../data';
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

      <div className="ml-auto flex items-center gap-2 pointer-events-auto">
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
