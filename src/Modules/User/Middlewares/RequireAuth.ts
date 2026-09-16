import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../../../Core/Http/Errors.js';

/** Blocks anonymous access to a web page or API route. */
export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.user) {
    next();
    return;
  }

  if (req.originalUrl.startsWith('/api/')) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  const next_ =
    req.originalUrl.startsWith('/') && !req.originalUrl.startsWith('//') ? req.originalUrl : '/';

  res.redirect(`/login?next=${encodeURIComponent(next_)}`);
};
