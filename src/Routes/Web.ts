import { Router } from 'express';
import * as home from '../Modules/Home/Routes/Web.js';
import * as localization from '../Modules/Localization/Routes/Web.js';

/** Server-rendered pages (Handlebars). */
export const webRouter = Router();

webRouter.use(home.basePath, home.router);
webRouter.use(localization.basePath, localization.router);
