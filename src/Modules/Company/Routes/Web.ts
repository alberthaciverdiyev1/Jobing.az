import { Router } from 'express';
import * as companyWebController from '../Controllers/CompanyWebController.js';

export const basePath = '/';

export const router = Router();

router.get('/companies', companyWebController.index);
router.get('/companies/:slug', companyWebController.show);
