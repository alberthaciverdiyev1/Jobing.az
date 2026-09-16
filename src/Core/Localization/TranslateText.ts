import type { TranslatedText } from './TranslatedText.js';

/** Supported secondary locales, mapped to their key on the text object. */
const SECONDARY_LOCALES: Record<string, keyof TranslatedText> = {
  en: 'en',
  ru: 'ru',
  tr: 'tr',
};

/** Picks the locale's text, falling back to Azerbaijani. */
export function translateText(text: TranslatedText, locale: string): string {
  const key = SECONDARY_LOCALES[locale];
  return (key ? text[key] : undefined) ?? text.az;
}

/** Trims every locale and drops the empty ones so fallback works predictably. */
export function normalizeTranslation(text: TranslatedText): TranslatedText {
  const normalized: TranslatedText = { az: text.az.trim() };

  for (const key of ['en', 'ru', 'tr'] as const) {
    const value = text[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      normalized[key] = value.trim();
    }
  }

  return normalized;
}
