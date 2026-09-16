import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { ForbiddenError } from '../Core/Http/Errors/index.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const TOKEN_BYTES = 32;
const HEADER = 'x-csrf-token';

function tokensMatch(provided: string, expected: string): boolean {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Session-backed CSRF protection for state-changing requests.
 * The token reaches templates as `csrfToken` and is accepted from either the
 * `_csrf` form field or the `X-CSRF-Token` header.
 */
export const csrfProtection: RequestHandler = (req, res, next) => {
  req.session.csrfToken ??= randomBytes(TOKEN_BYTES).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;

  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const body = req.body as Record<string, unknown> | undefined;
  const fromBody = body?._csrf;
  const provided = typeof fromBody === 'string' ? fromBody : req.get(HEADER);

  if (provided && tokensMatch(provided, req.session.csrfToken)) {
    next();
    return;
  }

  next(new ForbiddenError('Invalid or missing CSRF token'));
};

declare module 'express-session' {
  interface SessionData {
    /** Token issued with every rendered form. */
    csrfToken?: string;
  }
}
