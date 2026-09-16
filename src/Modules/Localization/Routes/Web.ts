import { Router } from 'express';
import * as localizationController from '../Controllers/LocalizationController.js';

export const basePath = '/';

export const router = Router();

router.get('/lang/:locale', localizationController.switchLocale);
