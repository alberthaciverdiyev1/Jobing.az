import express from 'express';
import authController from '../Controllers/AuthController.js';
import authMiddleware from '../../../Middlewares/Auth.js';
import { authLimiter } from '../../../Middlewares/RateLimit.js';
import { validateBody, schemas } from '../../../Middlewares/Validation.js';

const router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authLimiter, validateBody(schemas.loginSchema), authController.loginPost);

router.get('/register', authController.registerPage);
router.post('/register', authLimiter, validateBody(schemas.registerSchema), authController.registerPost);

router.get('/logout', authController.logout);

router.get('/profile', authMiddleware.authenticate, authController.profilePage);
router.post('/profile/update', authMiddleware.authenticate, authController.updateProfilePost);

export default router;
