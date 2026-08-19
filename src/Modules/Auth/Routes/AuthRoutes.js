import express from 'express';
import authController from '../Controllers/AuthController.js';
import authMiddleware from '../../../Middlewares/Auth.js';
import { authLimiter } from '../../../Middlewares/RateLimit.js';
import { validateBody, schemas } from '../../../Middlewares/Validation.js';

const router = express.Router();

// Public pages
// /auth is used by navbar links and by authMiddleware redirects
router.get('/auth', authController.loginPage);
router.get('/login', authController.loginPage);
router.post('/login', authLimiter, validateBody(schemas.loginSchema), authController.loginPost);

router.get('/register', authController.registerPage);
router.post('/register', authLimiter, validateBody(schemas.registerSchema), authController.registerPost);

router.get('/logout', authController.logout);

// JSON API endpoints (used by the SPA login/register forms)
router.post('/api/auth/login', authLimiter, validateBody(schemas.loginSchema), authController.apiLogin);
router.post('/api/auth/register', authLimiter, validateBody(schemas.registerSchema), authController.apiRegister);
router.get('/api/auth/logout', authController.apiLogout);
router.post('/api/auth/logout', authController.apiLogout);

// Protected profile routes
router.get('/profile', authMiddleware.authenticate, authController.profilePage);
router.post('/profile/update', authMiddleware.authenticate, authController.updateProfilePost);

export default router;
