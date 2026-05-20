import { zhPack } from './stages.zh';
import { enPack } from './stages.en';
import type { Language } from './types';

export const packs: Record<Language, typeof zhPack> = {
  zh: zhPack,
  en: enPack,
};
