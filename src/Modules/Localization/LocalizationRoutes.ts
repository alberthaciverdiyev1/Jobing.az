import { Router } from 'express';
import * as localizationController from './LocalizationController.js';

export const localizationRouter = Router();

localizationRouter.get('/lang/:locale', localizationController.switchLocale);
