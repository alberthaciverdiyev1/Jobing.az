import path from 'node:path';
import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';
import { handle, LanguageDetector } from 'i18next-http-middleware';
import { env } from '../../Config/Env.js';
import { paths } from '../../Config/Paths.js';

let initialized = false;

/** Boots i18next from `locales/<lng>/<ns>.json`. Safe to call repeatedly. */
export async function initI18n(): Promise<void> {
  if (initialized) return;

  await i18next
    .use(LanguageDetector)
    .use(FsBackend)
    .init({
      backend: {
        loadPath: path.join(paths.locales, '{{lng}}', '{{ns}}.json'),
      },
      fallbackLng: env.DEFAULT_LOCALE,
      supportedLngs: env.AVAILABLE_LOCALES,
      preload: env.AVAILABLE_LOCALES,
      ns: ['translation'],
      defaultNS: 'translation',
      detection: {
        order: ['cookie', 'header'],
        lookupCookie: 'lang',
        // We persist the locale ourselves in the localization module, so the
        // middleware must not write its own cookie and clobber ours.
        caches: false,
        cookieSameSite: 'lax',
      },
      interpolation: { escapeValue: false },
      returnNull: false,
    });

  initialized = true;
}

export const i18nMiddleware = handle(i18next);
