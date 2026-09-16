import { Router } from 'express';
import * as homeController from './HomeController.js';

export const homeRouter = Router();

homeRouter.get('/', homeController.index);
