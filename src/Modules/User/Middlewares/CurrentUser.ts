import type { RequestHandler } from 'express';
import type { User } from '../Entities/User.js';
import { userService } from '../Services/index.js';
import { transformUser } from '../Transformers/UserTransformer.js';

/**
 * Resolves `req.session.userId` into `req.user` (entity) and `currentUser`
 * (client-safe resource) for templates.
 *
 * A stale id — an account that no longer exists — is cleared instead of failing
 * the request.
 */
export const currentUser: RequestHandler = async (req, res, next) => {
  res.locals.currentUser = null;

  const userId = req.session.userId;
  if (!userId) {
    next();
    return;
  }

  try {
    const user = await userService.getById(userId);
    req.user = user;
    res.locals.currentUser = transformUser(user);
  } catch {
    delete req.session.userId;
  }

  next();
};

declare module 'express-session' {
  interface SessionData {
    /** The signed-in account, if any. */
    userId?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    /** Resolved from the session by the currentUser middleware. */
    user?: User;
  }
}
