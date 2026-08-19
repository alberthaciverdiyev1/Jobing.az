import express from 'express';
import companyController from '../Controllers/CompanyController.js';
import authMiddleware from '../../../Middlewares/Auth.js';

const router = express.Router();

router.get('/sirketler', companyController.list);
router.get('/sirketler/:id/details', companyController.details);

router.get('/sirket-profili', authMiddleware.authenticate, companyController.myProfilePage);
router.post('/sirket-profili/update', authMiddleware.authenticate, companyController.updateMyProfilePost);

export default router;
