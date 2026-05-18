import { useEffect, useState } from 'react';

const BASE_W = 1920;
const BASE_H = 1080;

/** Returns the scale that fits 1920x1080 into current viewport while preserving 16:9 */
export function useCanvasScale(): number {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const s = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
      setScale(s);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return scale;
}
