import type { Request, RequestHandler } from 'express';
import { env } from '../../../Config/Env.js';
import { isSupportedLocale } from '../../../Config/Locales.js';
import { NotFoundError } from '../../../Core/Http/Errors/index.js';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/** Resolves a same-origin redirect target from the Referer header. */
function safeRedirectTarget(req: Request): string {
  const referer = req.get('referer');
  if (!referer) return '/';

  try {
    const url = new URL(referer);
    if (url.host !== req.get('host')) return '/';
    return `${url.pathname}${url.search}`;
  } catch {
    return '/';
  }
}

export const switchLocale: RequestHandler = (req, res, next) => {
  const locale = String(req.params.locale ?? '');

  if (!isSupportedLocale(locale)) {
    next(new NotFoundError(`Unsupported locale: ${locale}`));
    return;
  }

  res.cookie('lang', locale, {
    maxAge: ONE_YEAR_MS,
    httpOnly: false,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });

  res.redirect(safeRedirectTarget(req));
};
