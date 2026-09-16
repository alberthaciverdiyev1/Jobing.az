import { Router } from 'express';
import * as healthController from '../HealthController.js';

export const basePath = '/health';

export const router = Router();

router.get('/', healthController.show);
