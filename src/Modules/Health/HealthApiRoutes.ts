import { Router } from 'express';
import * as healthController from './HealthController.js';

export const healthApiRouter = Router();

healthApiRouter.get('/', healthController.show);
