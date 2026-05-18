import { useEffect, useState, type ReactNode } from 'react';
import { useCanvasScale } from '../../lib/scale';
import { MobileContext } from '../../lib/mobile';
import { TopStatusBar } from './TopStatusBar';
import { BottomNav } from './BottomNav';
import { RotatePrompt } from './RotatePrompt';

interface GameShellProps {
  /** background image url (atmosphere only — text overlays in React) */
  background?: string;
  /** left character zone (Miranda / advisors) */
  character?: ReactNode;
  /** hide top status bar + bottom nav (for title screen) */
  hideHud?: boolean;
  /** main stage content */
  children: ReactNode;
}

export function GameShell({ background, character, children, hideHud }: GameShellProps) {
  const { scale, isMobileLandscape } = useCanvasScale();
  const isPortraitMobile = usePortraitMobile();

  if (isPortraitMobile) return <RotatePrompt />;

  /* ---------- canvas block shared by both layouts ---------- */
  const canvasBlock = (
    <div
      className={`canvas-1920 ${isMobileLandscape ? 'origin-top-left absolute top-0 left-0' : 'origin-center'}`}
      style={{ transform: `scale(${scale})` }}
    >
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
      <div className="absolute inset-0 z-[1] pointer-events-none
                      bg-gradient-to-b from-ink-0/40 via-transparent to-ink-0/80" />

      {character && !isMobileLandscape && (
        <div className="absolute inset-0 z-[2] pointer-events-none">{character}</div>
      )}

      <div className="absolute inset-0 z-[5]">{children}</div>
      {!hideHud && <TopStatusBar />}
      {!hideHud && <BottomNav />}
    </div>
  );

  if (isMobileLandscape) {
    /* Width-fit scale, overflow-hidden wrapper clips the oversized layout box,
       page scrolls if scaled canvas is taller than viewport. */
    const vw = Math.round(1920 * scale);
    const vh = Math.round(1080 * scale);
    return (
      <MobileContext.Provider value={true}>
        <div className="w-screen bg-black overflow-x-hidden" style={{ height: vh }}>
          <div className="relative overflow-hidden" style={{ width: vw, height: vh }}>
            {canvasBlock}
          </div>
        </div>
      </MobileContext.Provider>
    );
  }

  /* Desktop / large-screen letterbox */
  return (
    <MobileContext.Provider value={false}>
      <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
        {canvasBlock}
      </div>
    </MobileContext.Provider>
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
