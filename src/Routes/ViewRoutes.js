import express from 'express';
import viewController from '../Controllers/ViewController.js';
import jobDataController from '../Controllers/JobDataController.js';
import authMiddleware from '../Middlewares/Auth.js';
import visitorLogger from '../Middlewares/Visitors.js';

const router = express.Router();

// ============================================================
// PUBLIC PAGES
// ============================================================
router.get('/', viewController.home);
router.get('/auth', viewController.auth);
router.get('/vakansiyalar', visitorLogger, viewController.jobs);
router.get('/resumes', visitorLogger, viewController.resumes);
router.get('/about-us', visitorLogger, viewController.aboutUs);
router.get('/contact', visitorLogger, viewController.contactUs);
router.get('/add-job', authMiddleware.authenticate, visitorLogger, viewController.addJob);
router.get('/faq', visitorLogger, viewController.faq);
router.get('/qiymetler', visitorLogger, viewController.pricing);
router.get('/blogs', visitorLogger, viewController.blogs);
router.get('/blogs/:slug', visitorLogger, viewController.blog);
router.get('/vakansiyalar/:id/details', jobDataController.details);

// SEO: Sitemap & Robots
router.get('/sitemap.xml', viewController.sitemap);
router.get('/robots.txt', viewController.robots);

// Public CV & Company listing pages
router.get('/cv-ler', visitorLogger, viewController.cvList);
router.get('/cv-ler/:id', visitorLogger, viewController.cvDetail);
router.get('/sirketler', visitorLogger, viewController.companyList);
router.get('/sirket/:id', visitorLogger, viewController.companyDetail);

// News pages
router.get('/xeberler', visitorLogger, viewController.newsList);
router.get('/xeberler/:slug', visitorLogger, viewController.newsDetail);

// ============================================================
// PROTECTED PAGES (User Dashboard & CV management)
// ============================================================
router.get('/dashboard', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.userDashboard);
router.get('/company/dashboard', authMiddleware.authenticate, authMiddleware.authorize('company'), viewController.companyDashboard);
router.get('/company/settings', authMiddleware.authenticate, authMiddleware.authorize('company'), viewController.companySettings);
router.get('/cv/create', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.cvCreate);
router.get('/cv/upload', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.cvUpload);
router.get('/cv/edit/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.cvEdit);

export default router;
