import express from 'express';
import userController from '../Controllers/UserController.js';
import companyController from '../Controllers/CompanyController.js';
import categoryController from '../Controllers/CategoryController.js';
import jobDataController from '../Controllers/JobDataController.js';
import siteController from '../Controllers/SiteController.js';
import scrapeController from '../Controllers/ScrapeController.js';
import viewController from "../Controllers/ViewController.js";
import cityController from '../Controllers/CityController.js';

import validator from '../Validators/Main.js'
import visitorLogger from "../Middlewares/Visitors.js";
import adminController from "../Controllers/AdminController.js";
import blogController from "../Controllers/BlogController.js";
import authController from "../Controllers/AuthController.js";
import cvController from "../Controllers/CVController.js";
import authMiddleware from "../Middlewares/Auth.js";

const router = express.Router();

// ============================================================
// AUTH ROUTES
// ============================================================
router.post('/api/auth/register', validator.registerValidator, authController.register);
router.post('/api/auth/login', validator.loginValidator, authController.login);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/me', authController.getMe);

// ============================================================
// CV ROUTES (protected - user role required)
// ============================================================
router.post('/api/cv', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.create);
router.post('/api/cv/upload', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.upload);
router.get('/api/cv', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.list);
router.get('/api/cv/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.getById);
router.put('/api/cv/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.update);
router.delete('/api/cv/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.delete);

// ============================================================
// DASHBOARD ROUTES (protected)
// ============================================================
router.get('/dashboard', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.userDashboard);
router.get('/company/dashboard', authMiddleware.authenticate, authMiddleware.authorize('company'), viewController.companyDashboard);

// CV view routes (protected)
router.get('/cv/create', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.cvCreate);
router.get('/cv/upload', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.cvUpload);
router.get('/cv/edit/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), viewController.cvEdit);

// ============================================================
// LEGACY API ROUTES (User - will be deprecated)
// ============================================================
router.post('/api/users', validator.registerValidator, userController.createUser);         // CREATE
router.get('/api/users', userController.getUsers);                                         // READ ALL
router.get('/api/users/:id', userController.getUserById);                                  // READ ONE
router.put('/api/users/:id', userController.updateUser);                                   // UPDATE
router.delete('/api/users/:id', userController.deleteUser);                                // DELETE

// ============================================================
// BLOG ROUTES
// ============================================================
router.post('/api/blog/add', blogController.create);
router.get('/api/blogs', blogController.getAll);
router.get('/api/blog/:id', blogController.getAll);

// ============================================================
// JOB DATA ROUTES
// ============================================================
router.post('/api/jobs', jobDataController.create);
router.get('/api/jobs', jobDataController.getAll);
router.get('/api/jobs/:id', jobDataController.getSiteById);
router.put('/api/jobs/:id', jobDataController.updateSite);
router.delete('/api/jobs/:id', jobDataController.deleteSite);
router.post('/api/jobs/remove-duplicates', jobDataController.removeDuplicates);
router.post('/api/jobs/request-all-sites', jobDataController.requestAllSites)
router.post('/api/jobs/add-request', validator.addJobValidator, jobDataController.addJobRequest)
router.get('/vakansiyalar/:id/details', jobDataController.details);

// ============================================================
// SITE ROUTES
// ============================================================
router.post('/api/site', validator.siteValidator, siteController.create);
router.get('/api/site', siteController.getAll);
router.get('/api/site/:id', siteController.findById);
router.put('/api/site/:id', validator.siteValidator, siteController.update);
router.delete('/api/site/:id', siteController.delete);

// ============================================================
// COMPANY ROUTES
// ============================================================
router.post('/api/companies', companyController.create);
router.post('/api/companies/download-logos', companyController.downloadCompanyLogos);
router.get('/api/companies/:id', companyController.findById);
router.put('/api/companies/:id', validator.companyValidator, companyController.update);
router.delete('/api/companies/:id', companyController.delete);
router.post('/api/companies/remove-duplicates', companyController.removeDuplicates);

// ============================================================
// CATEGORY ROUTES
// ============================================================
router.post('/api/foreign-categories', categoryController.addForeignCategories);
router.get('/api/foreign-categories', categoryController.getForeignCategories);
router.get('/api/categories', categoryController.getLocalCategories);

// ============================================================
// CITY ROUTES
// ============================================================
router.post('/api/cities', cityController.create);
router.get('/api/cities', cityController.getAll);

// ============================================================
// SCRAPE ROUTES
// ============================================================
router.get('/api/scrape', scrapeController.getData);

// ============================================================
// VIEW ROUTES
// ============================================================
router.get('/', viewController.home);
router.get('/auth', viewController.auth);
router.get('/vakansiyalar', visitorLogger, viewController.jobs);
router.get('/resumes', visitorLogger, viewController.resumes)
router.get('/about-us', visitorLogger, viewController.aboutUs);
router.get('/contact', visitorLogger, viewController.contactUs);
router.get('/add-job', visitorLogger, viewController.addJob);
router.get('/faq', visitorLogger, viewController.faq);
router.get('/blogs', visitorLogger, viewController.blogs);
router.get('/blogs/:slug', visitorLogger, viewController.blog);
router.get('/statistics', viewController.statistics)

// Enums
router.get('/education', viewController.education);
router.get('/experience', viewController.experience);

// Change language
router.post('/set-lang', (req, res) => {
    const { language } = req.body;
    if (i18n.getLocales().includes(language)) {
        res.cookie('lang', language);
        res.send({ message: 'Language updated successfully' });
    } else {
        res.status(400).send({ error: 'Invalid language' });
    }
});

// ============================================================
// ADMIN PANEL
// ============================================================
router.get('/admin', adminController.adminIndex);
router.get('/admin/categories', adminController.adminCategoryView);
router.get('/admin/blogs', adminController.adminBlogsView);
router.get('/admin/blogs/add', adminController.adminBlogsAddView);

// ============================================================
// SEND MAIL
// ============================================================
router.post('/send-mail', viewController.sendMail);

// ============================================================
// 404 HANDLER
// ============================================================
router.use((req, res) => {
    res.render('Partials/Error.ejs');
});

router.use((err, req, res, next) => {
    res.render('Partials/Error.ejs');
});

export default router;
