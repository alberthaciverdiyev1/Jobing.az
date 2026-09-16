import { Router } from 'express';
import { homeRouter } from '../Modules/Home/HomeRoutes.js';
import { localizationRouter } from '../Modules/Localization/LocalizationRoutes.js';

/** Server-rendered pages (Handlebars). */
export const webRouter = Router();

webRouter.use('/', localizationRouter);
webRouter.use('/', homeRouter);
