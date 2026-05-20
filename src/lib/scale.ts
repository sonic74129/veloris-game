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
  const isMobileLandscape = w > h && h < 560;
  // Also detect touch landscape even with slightly taller viewports (tablets excluded by 768 cap)
  const isMobileFallback = w > h && h < 768 && 'ontouchstart' in (typeof window !== 'undefined' ? window : {}) && h < 560;
  // Always letterbox: fit both dimensions.
  const scale = Math.min(w / BASE_W, h / BASE_H);
  return { scale, isMobileLandscape: isMobileLandscape || isMobileFallback };
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
