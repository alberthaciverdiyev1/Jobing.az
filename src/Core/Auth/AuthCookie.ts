import type { CookieOptions } from 'express';
import { isProduction } from '../../Config/Env.js';

/** Where the browser keeps its access token. API clients use a Bearer header. */
export const AUTH_COOKIE = 'jobing.token';

/**
 * httpOnly so scripts cannot read the token, and Lax so a cross-site POST never
 * carries it — that is the app's first line of defence against CSRF.
 */
export function authCookieOptions(maxAgeMs?: number): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    ...(maxAgeMs === undefined ? {} : { maxAge: maxAgeMs }),
  };
}
