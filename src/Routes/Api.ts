import { Router } from 'express';
import { healthApiRouter } from '../Modules/Health/HealthApiRoutes.js';

/** JSON API. Mounted by the root router under `/api/v1`. */
export const apiRouter = Router();

apiRouter.use('/health', healthApiRouter);
