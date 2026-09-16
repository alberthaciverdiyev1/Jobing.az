import { Router } from 'express';
import * as categoryWebController from '../Controllers/CategoryWebController.js';

export const basePath = '/';

export const router = Router();

router.get('/categories', categoryWebController.index);
