import express from 'express';
import adminController from '../Controllers/AdminController.js';
import authMiddleware from '../../../Middlewares/Auth.js';

const router = express.Router();

// Apply auth/admin middleware to all /admin routes
router.use('/admin', authMiddleware.authenticate, authMiddleware.authorize('admin'));

router.get('/admin', adminController.dashboard);
router.get('/admin/users', adminController.usersList);
router.get('/admin/companies', adminController.companiesList);
router.get('/admin/jobs', adminController.vacanciesList);
router.get('/admin/categories', adminController.categoriesList);
router.get('/admin/cities', adminController.citiesList);
router.get('/admin/blogs', adminController.blogsList);
router.get('/admin/news', adminController.newsList);
router.get('/admin/rss-sources', adminController.rssList);
router.get('/admin/cvs', adminController.cvsList);
router.get('/admin/job-seekers', adminController.jobSeekersList);
router.get('/admin/pricing', adminController.pricingList);
router.get('/admin/visitors', adminController.visitorsList);
router.get('/admin/logs', adminController.logsList);
router.get('/admin/settings', adminController.settingsList);
router.get('/admin/seo', adminController.seoList);

export default router;
