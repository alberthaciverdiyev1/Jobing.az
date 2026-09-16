import type { RequestHandler } from 'express';
import { env } from '../../../Config/Env.js';
import { databaseHealth } from '../../../Core/Database/index.js';
import { ok } from '../../../Core/Http/Responses.js';

const startedAt = Date.now();

export const show: RequestHandler = async (_req, res) => {
  ok(res, {
    status: 'ok',
    app: env.APP_NAME,
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    database: await databaseHealth(),
    timestamp: new Date().toISOString(),
  });
};
