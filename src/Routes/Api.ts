import { Router } from 'express';
import * as health from '../Modules/Health/Routes/Api.js';
import * as user from '../Modules/User/Routes/Api.js';

/** JSON API. Mounted by the root router under `/api/v1`. */
export const apiRouter = Router();

apiRouter.use(health.basePath, health.router);
apiRouter.use(user.basePath, user.router);
