import { Router } from 'express';
import * as cityWebController from '../Controllers/CityWebController.js';

export const basePath = '/';

export const router = Router();

router.get('/cities', cityWebController.index);
