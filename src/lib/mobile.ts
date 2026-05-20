import { createContext, useContext } from 'react';

export const MobileContext = createContext(false);
export const useMobile = () => useContext(MobileContext);

export const CanvasScaleContext = createContext(1);
export const useCanvasScaleValue = () => useContext(CanvasScaleContext);
