import { Router } from 'express';
import * as userWebController from '../Controllers/UserWebController.js';
import { requireAuth } from '../Middlewares/RequireAuth.js';

export const basePath = '/';

export const router = Router();

router.get('/register', userWebController.showRegister);
router.post('/register', userWebController.register);

router.get('/login', userWebController.showLogin);
router.post('/login', userWebController.login);

router.post('/logout', userWebController.logout);

router.get('/profile', requireAuth, userWebController.profile);
