import { zhPack } from './stages.zh';
import type { Language, LanguagePack } from './types';

// English pack ships as stub; MVP uses zh.
// To enable EN: replicate zhPack with translated text.
const enPack: LanguagePack = zhPack;

export const packs: Record<Language, LanguagePack> = {
  zh: zhPack,
  en: enPack,
};
