import type { RequestHandler } from 'express';
import { env } from '../../config/env.js';

const startedAt = Date.now();

export const show: RequestHandler = (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      app: env.APP_NAME,
      environment: env.NODE_ENV,
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    },
  });
};
