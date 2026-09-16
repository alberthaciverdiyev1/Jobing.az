import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const HEADER = 'x-request-id';

export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.headers[HEADER];
  const id = typeof incoming === 'string' && incoming.length > 0 ? incoming : randomUUID();

  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
};

declare module 'express-serve-static-core' {
  interface Request {
    /** Correlation id, echoed back as X-Request-Id. */
    requestId: string;
  }
}
