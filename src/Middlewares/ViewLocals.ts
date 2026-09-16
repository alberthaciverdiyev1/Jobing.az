import type { RequestHandler } from 'express';
import { env, isProduction } from '../Config/Env.js';
import { availableLocales } from '../Config/Locales.js';

/**
 * Exposes the data every template needs. Runs after the i18n middleware so
 * `req.t` / `req.language` are already resolved.
 */
export const viewLocals: RequestHandler = (req, res, next) => {
  res.locals.appName = env.APP_NAME;
  res.locals.appSuffix = env.APP_SUFFIX;
  res.locals.appUrl = env.APP_URL;
  res.locals.isProduction = isProduction;

  res.locals.locale = req.language ?? env.DEFAULT_LOCALE;
  res.locals.locales = availableLocales;
  res.locals.defaultLocale = env.DEFAULT_LOCALE;

  // Translation function, callable from templates: {{t "key"}}
  res.locals.t = req.t;
  res.locals.currentUrl = req.originalUrl;
  res.locals.year = new Date().getFullYear();

  next();
};
