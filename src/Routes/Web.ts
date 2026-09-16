import { Router } from 'express';
import { csrfProtection } from '../Middlewares/Csrf.js';
import * as home from '../Modules/Home/Routes/Web.js';
import * as localization from '../Modules/Localization/Routes/Web.js';
import * as user from '../Modules/User/Routes/Web.js';

/** Server-rendered pages (Handlebars). */
export const webRouter = Router();

// Every state-changing form post must carry a valid CSRF token.
webRouter.use(csrfProtection);

webRouter.use(home.basePath, home.router);
webRouter.use(localization.basePath, localization.router);
webRouter.use(user.basePath, user.router);
