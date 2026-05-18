import { useEffect, useState, type ReactNode } from 'react';
import { useCanvasScale } from '../../lib/scale';
import { TopStatusBar } from './TopStatusBar';
import { BottomNav } from './BottomNav';
import { RotatePrompt } from './RotatePrompt';

interface GameShellProps {
  /** background image url (atmosphere only — text overlays in React) */
  background?: string;
  /** left character zone (Miranda / advisors) */
  character?: ReactNode;
  /** main stage content */
  children: ReactNode;
}

export function GameShell({ background, character, children }: GameShellProps) {
  const scale = useCanvasScale();
  const isPortraitMobile = usePortraitMobile();

  if (isPortraitMobile) return <RotatePrompt />;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
      <div
        className="canvas-1920 origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Background image layer (optional, used as atmosphere only) */}
        {background && (
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(0.85) brightness(0.8)',
            }}
          />
        )}
        {/* darkening vignette */}
        <div className="absolute inset-0 z-[1] pointer-events-none
                        bg-gradient-to-b from-ink-0/40 via-transparent to-ink-0/80" />

        {/* Character layer */}
        {character && <div className="absolute inset-0 z-[2] pointer-events-none">{character}</div>}

        {/* Stage content */}
        <div className="absolute inset-0 z-[5]">{children}</div>

        {/* HUD */}
        <TopStatusBar />
        <BottomNav />
      </div>
    </div>
  );
}

function usePortraitMobile() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIs(w < 820 && h > w);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);
  return is;
}
