import { env } from './Env.js';

export interface LocaleInfo {
  code: string;
  name: string;
  flag: string;
}

const KNOWN_LOCALES: Record<string, Omit<LocaleInfo, 'code'>> = {
  az: { name: 'Azərbaycan', flag: '🇦🇿' },
  en: { name: 'English', flag: '🇬🇧' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
};

/** `AVAILABLE_LOCALES` enriched with display metadata, in configured order. */
export const availableLocales: LocaleInfo[] = env.AVAILABLE_LOCALES.map((code) => ({
  code,
  name: KNOWN_LOCALES[code]?.name ?? code.toUpperCase(),
  flag: KNOWN_LOCALES[code]?.flag ?? '🌐',
}));

export function isSupportedLocale(locale: string): boolean {
  return env.AVAILABLE_LOCALES.includes(locale);
}
