import { Router } from 'express';
import * as homeController from '../Controllers/HomeController.js';

export const basePath = '/';

export const router = Router();

router.get('/', homeController.index);
