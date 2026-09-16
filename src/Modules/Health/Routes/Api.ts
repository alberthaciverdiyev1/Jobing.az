import { Router } from 'express';
import * as healthController from '../Controllers/HealthController.js';

export const basePath = '/health';

export const router = Router();

router.get('/', healthController.show);
