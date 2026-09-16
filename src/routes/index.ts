import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';

/**
 * Root router. Feature module routers get mounted here as they are built:
 *   apiRouter.use('/jobs', jobsRouter);
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
