import type { RequestHandler } from 'express';
import { userService } from '../Services/UserService.js';

/**
 * Resolves `req.session.userId` into `req.user` / `currentUser` for templates.
 * A stale id (deleted account) is cleared instead of failing the request.
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
    res.locals.currentUser = user;
  } catch {
    delete req.session.userId;
  }

  next();
};
