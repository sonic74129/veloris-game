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
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobileLandscape = w > h && h < 560;
      // Always letterbox: fit both dimensions.
      const scale = Math.min(w / BASE_W, h / BASE_H);
      setInfo({ scale, isMobileLandscape });
    };
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('orientationchange', calc);
    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('orientationchange', calc);
    };
  }, []);
  return info;
}
