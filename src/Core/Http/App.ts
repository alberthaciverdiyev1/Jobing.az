import path from 'node:path';
import express, { type Express } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env, isProduction } from '../../Config/Env.js';
import { paths } from '../../Config/Paths.js';
import { i18nMiddleware, initI18n } from '../Localization/I18n.js';
import { createSessionMiddleware } from './Session.js';
import { logger } from '../Logger.js';
import { notFound } from '../../Middlewares/NotFound.js';
import { requestId } from '../../Middlewares/RequestId.js';
import { viewLocals } from '../../Middlewares/ViewLocals.js';
import { createRootRouter } from './RootRouter.js';
import { errorHandler } from './ErrorHandler.js';

/**
 * Builds the Express application.
 *
 * Serves two audiences from one process:
 *  - server-rendered Edge pages on all non-API routes
 *  - a JSON API under `/api/v1`
 */
export async function createApp(): Promise<Express> {
  await initI18n();

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
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : [env.APP_URL],
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

  // Sessions must exist before anything that reads `req.session`.
  app.use(createSessionMiddleware());

  // Locale detection must run before anything that renders or translates.
  app.use(i18nMiddleware);
  app.use(viewLocals);

  app.use(
    '/static',
    express.static(path.join(paths.public), {
      maxAge: isProduction ? '1y' : 0,
      etag: true,
    }),
  );

  app.use(await createRootRouter());

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
