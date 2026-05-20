import { useEffect, useState } from 'react';

const BASE_W = 1920;
const BASE_H = 1080;

export interface CanvasInfo {
  scale: number;
  /** true when viewport is a small landscape screen (phone / small tablet) */
  isMobileLandscape: boolean;
}

export function useCanvasScale(): CanvasInfo {
  const [info, setInfo] = useState<CanvasInfo>({ scale: 1, isMobileLandscape: false });
  useEffect(() => {
    const calc = () => {
      // Use visualViewport if available to get the layout (un-zoomed) dimensions,
      // falling back to window.innerWidth/Height.
      // On iOS Safari, pinch-zoom changes visualViewport.scale but NOT the
      // layout viewport — so we divide by visualViewport.scale to get true layout size.
      const vv = window.visualViewport;
      const w = vv ? vv.width * vv.scale : window.innerWidth;
      const h = vv ? vv.height * vv.scale : window.innerHeight;
      const isMobileLandscape = w > h && h < 560;
      // Always letterbox: fit both dimensions.
      const scale = Math.min(w / BASE_W, h / BASE_H);
      setInfo({ scale, isMobileLandscape });
    };
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
