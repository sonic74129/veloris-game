import type { AccentColor } from '../data/types';

export const accentHex: Record<AccentColor, string> = {
  gold:   '#e3c886',
  cyan:   '#46D9D1',
  purple: '#9B6CFF',
  green:  '#53D36B',
  blue:   '#4CA3FF',
  pink:   '#E96AAE',
  red:    '#E65A4F',
};

export const accentSoft: Record<AccentColor, string> = {
  gold:   'rgba(227,200,134,0.18)',
  cyan:   'rgba(70,217,209,0.18)',
  purple: 'rgba(155,108,255,0.18)',
  green:  'rgba(83,211,107,0.18)',
  blue:   'rgba(76,163,255,0.18)',
  pink:   'rgba(233,106,174,0.18)',
  red:    'rgba(230,90,79,0.18)',
};

export function accentGlow(c: AccentColor): string {
  return `0 0 20px ${accentSoft[c]}, inset 0 0 10px ${accentSoft[c]}`;
}
