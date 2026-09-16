import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { CookieOptions, RequestHandler } from 'express';
import { isProduction } from '../Config/Env.js';
import { ForbiddenError } from '../Core/Http/Errors/index.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const HEADER = 'x-csrf-token';
const COOKIE = 'jobing.csrf';
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  path: '/',
};

function tokensMatch(provided: string, expected: string): boolean {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Double-submit CSRF protection.
 *
 * The token lives in a cookie the page's JavaScript cannot read, and must also
 * be echoed back in the `_csrf` form field or the `X-CSRF-Token` header. Another
 * origin can force a request but cannot read the cookie, so it cannot echo it.
 */
export const csrfProtection: RequestHandler = (req, res, next) => {
  let token = req.cookies?.[COOKIE] as string | undefined;

  if (typeof token !== 'string' || !TOKEN_PATTERN.test(token)) {
    token = randomBytes(32).toString('hex');
    res.cookie(COOKIE, token, cookieOptions);
  }

  res.locals.csrfToken = token;

  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const body = req.body as Record<string, unknown> | undefined;
  const fromBody = body?._csrf;
  const provided = typeof fromBody === 'string' ? fromBody : req.get(HEADER);

  if (provided && tokensMatch(provided, token)) {
    next();
    return;
  }

  next(new ForbiddenError('Invalid or missing CSRF token'));
};
