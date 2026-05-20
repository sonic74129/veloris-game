import { useEffect, useState } from 'react';

const BASE_W = 1920;
const BASE_H = 1080;

export interface CanvasInfo {
  scale: number;
  /** true when viewport is a small landscape screen (phone / small tablet) */
  isMobileLandscape: boolean;
}

function calcCanvasInfo(): CanvasInfo {
  // Use visualViewport if available to get the layout (un-zoomed) dimensions,
  // falling back to window.innerWidth/Height.
  // On iOS Safari, pinch-zoom changes visualViewport.scale but NOT the
  // layout viewport — so we multiply by visualViewport.scale to get true layout size.
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  const w = vv ? vv.width * vv.scale : (typeof window !== 'undefined' ? window.innerWidth : 1920);
  const h = vv ? vv.height * vv.scale : (typeof window !== 'undefined' ? window.innerHeight : 1080);
  // Touch device in landscape with limited height = mobile/tablet landscape.
  const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 0);
  const isMobileLandscape = w > h && (h < 720 && hasTouch || h < 560);
  // Always letterbox: fit both dimensions.
  const scale = Math.min(w / BASE_W, h / BASE_H);
  return { scale, isMobileLandscape };
}

export function useCanvasScale(): CanvasInfo {
  const [info, setInfo] = useState<CanvasInfo>(calcCanvasInfo);
  useEffect(() => {
    const calc = () => setInfo(calcCanvasInfo());
    // Recalculate once on mount (visualViewport may update after first paint)
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('orientationchange', calc);
    // Also listen to visualViewport resize to catch zoom changes
    window.visualViewport?.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('orientationchange', calc);
      window.visualViewport?.removeEventListener('resize', calc);
    };
  }, []);
  return info;
}
