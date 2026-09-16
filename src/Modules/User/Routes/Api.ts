import { Router } from 'express';
import { validate } from '../../../Middlewares/Validate.js';
import * as userApiController from '../Controllers/UserApiController.js';
import { requireAuth } from '../Middlewares/RequireAuth.js';
import { loginSchema, registerSchema } from '../Validators/UserValidators.js';

export const basePath = '/auth';

export const router = Router();

router.post('/register', validate({ body: registerSchema }), userApiController.register);
router.post('/login', validate({ body: loginSchema }), userApiController.login);
router.post('/logout', requireAuth, userApiController.logout);
router.get('/me', requireAuth, userApiController.me);
