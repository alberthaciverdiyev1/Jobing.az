import type { RequestHandler } from 'express';
import { NotFoundError } from '../Core/Http/Errors/index.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};
