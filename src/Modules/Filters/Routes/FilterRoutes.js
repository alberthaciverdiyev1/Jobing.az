import { Router } from 'express';
import filterController from '../Controllers/FilterController.js';
import authMiddleware from '../../../Middlewares/Auth.js';

const router = Router();

// Admin guard for all mutating operations
const adminOnly = [authMiddleware.authenticate, authMiddleware.authorize('admin')];

// Filter endpoints
router.get('/api/filters', filterController.getAll);
router.get('/api/filters/active', filterController.getAllActive);
router.get('/api/filters/all', filterController.getAllWithAllOptions);
router.get('/api/filters/:id', filterController.getById);
router.post('/api/filters', adminOnly, filterController.create);
router.put('/api/filters/:id', adminOnly, filterController.update);
router.delete('/api/filters/:id', adminOnly, filterController.delete);

// FilterOption endpoints
router.get('/api/filters/options/:id', filterController.getOptionById);
router.post('/api/filters/:filterId/options', adminOnly, filterController.addOption);
router.put('/api/filters/options/:id', adminOnly, filterController.updateOption);
router.delete('/api/filters/options/:id', adminOnly, filterController.deleteOption);

export default router;
