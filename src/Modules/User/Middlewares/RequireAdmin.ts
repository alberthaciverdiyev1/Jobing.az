import type { RequestHandler } from 'express';
import { ForbiddenError } from '../../../Core/Http/Errors/index.js';

/** Only administrators may pass. Mount it after `requireAuth`. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(new ForbiddenError('Authentication required'));
    return;
  }

  if (!req.user.isAdmin) {
    next(new ForbiddenError('Administrator access required'));
    return;
  }

  next();
};
