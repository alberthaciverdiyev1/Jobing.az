import express, { type Express } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env, isProduction } from '../../config/env.js';
import { paths } from '../../config/paths.js';
import { logger } from '../logger.js';
import { notFound } from '../../middlewares/not-found.js';
import { requestId } from '../../middlewares/request-id.js';
import { apiRouter } from '../../routes/index.js';
import { errorHandler } from './error-handler.js';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', true);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(
    cors({
      origin: env.APP_URL,
      credentials: true,
    }),
  );

  app.use(compression({ threshold: 512, level: 6 }));

  // Correlation id must exist before the HTTP logger runs.
  app.use(requestId);

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as express.Request).requestId,
      customLogLevel: (_req, res, error) => {
        if (error || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  app.use(
    '/static',
    express.static(paths.public, {
      maxAge: isProduction ? '1y' : 0,
      etag: true,
    }),
  );

  app.use(apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
