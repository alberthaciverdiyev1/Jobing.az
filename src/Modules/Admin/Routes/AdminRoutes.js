import express from 'express';
import adminController from '../Controllers/AdminController.js';
import authMiddleware from '../../../Middlewares/Auth.js';

const router = express.Router();

// Keep these protected by admin middleware
router.get('/admin', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.dashboard);
router.get('/admin/users', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.usersList);
router.get('/admin/vacancies', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.vacanciesList);

export default router;
