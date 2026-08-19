import express from 'express';
import vacancyController from '../Controllers/VacancyController.js';
import authMiddleware from '../../../Middlewares/Auth.js';
import { addJobValidator } from '../Validators/VacancyValidator.js';
import { jobLimiter } from '../../../Middlewares/RateLimit.js';

const router = express.Router();

// Pure MVC Routes - No APIs!
router.get('/vakansiyalar', vacancyController.list);
router.get('/vakansiyalar/elave-et', vacancyController.addPage);
router.post('/vakansiyalar/elave-et', authMiddleware.authenticate, jobLimiter, addJobValidator, vacancyController.addPost);
router.get('/vakansiyalar/:id/details', vacancyController.details);

// Only for admins usually, but keeping it standard web format
router.post('/vakansiyalar/:id/delete', authMiddleware.authenticate, vacancyController.deletePost);

export default router;
