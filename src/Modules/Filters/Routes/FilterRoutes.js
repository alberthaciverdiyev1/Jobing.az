import { Router } from 'express';
import filterController from '../Controllers/FilterController.js';

const router = Router();

// Filter endpoints
router.get('/api/filters', filterController.getAll);
router.get('/api/filters/active', filterController.getAllActive);
router.get('/api/filters/:id', filterController.getById);
router.post('/api/filters', filterController.create);
router.put('/api/filters/:id', filterController.update);
router.delete('/api/filters/:id', filterController.delete);

// FilterOption endpoints
router.get('/api/filters/options/:id', filterController.getOptionById);
router.post('/api/filters/:filterId/options', filterController.addOption);
router.put('/api/filters/options/:id', filterController.updateOption);
router.delete('/api/filters/options/:id', filterController.deleteOption);

export default router;
