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
router.get('/api/auth/logout', authController.logout);
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
// ADMIN PANEL PAGES (protected - admin role required)
// ============================================================
router.get('/admin', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminIndex);
router.get('/admin/dashboard', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminIndex);
router.get('/admin/jobs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminJobsView);
router.get('/admin/companies', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminCompaniesView);
router.get('/admin/users', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminUsersView);
router.get('/admin/categories', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminCategoriesView);
router.get('/admin/cities', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminCitiesView);
router.get('/admin/sites', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminSitesView);
router.get('/admin/blogs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminBlogsView);
router.get('/admin/blogs/add', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminBlogsAddView);
router.get('/admin/blogs/edit/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminBlogsEditView);
router.get('/admin/cvs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminCvsView);
router.get('/admin/visitors', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminVisitorsView);
router.get('/admin/settings', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.adminSettingsView);

// ============================================================
// ADMIN API (protected - admin role required)
// ============================================================

// Dashboard
router.get('/api/admin/stats', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.dashboardStats);

// Enums (for client-side resolution)
router.get('/api/admin/enums', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getEnums);

// Jobs
router.get('/api/admin/jobs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getJobs);
router.get('/api/admin/jobs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getJob);
router.post('/api/admin/jobs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createJob);
router.put('/api/admin/jobs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateJob);
router.delete('/api/admin/jobs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteJob);
router.patch('/api/admin/jobs/:id/toggle', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.toggleJobActive);

// Companies
router.get('/api/admin/companies', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCompanies);
router.get('/api/admin/companies/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCompany);
router.post('/api/admin/companies', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createCompany);
router.put('/api/admin/companies/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateCompany);
router.delete('/api/admin/companies/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteCompany);

// Users
router.get('/api/admin/users', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getUsers);
router.get('/api/admin/users/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getUser);
router.post('/api/admin/users', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createUser);
router.put('/api/admin/users/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateUser);
router.delete('/api/admin/users/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteUser);

// Categories
router.get('/api/admin/categories', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCategories);
router.get('/api/admin/categories/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCategory);
router.post('/api/admin/categories', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createCategory);
router.put('/api/admin/categories/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateCategory);
router.delete('/api/admin/categories/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteCategory);

// Cities
router.get('/api/admin/cities', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCities);
router.get('/api/admin/cities/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCity);
router.post('/api/admin/cities', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createCity);
router.put('/api/admin/cities/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateCity);
router.delete('/api/admin/cities/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteCity);

// Sites
router.get('/api/admin/sites', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getSites);
router.get('/api/admin/sites/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getSite);
router.post('/api/admin/sites', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createSite);
router.put('/api/admin/sites/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateSite);
router.delete('/api/admin/sites/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteSite);

// Blogs
router.get('/api/admin/blogs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getBlogs);
router.get('/api/admin/blogs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getBlog);
router.post('/api/admin/blogs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.createBlog);
router.put('/api/admin/blogs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.updateBlog);
router.delete('/api/admin/blogs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteBlog);

// CVs
router.get('/api/admin/cvs', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCvs);
router.get('/api/admin/cvs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getCv);
router.delete('/api/admin/cvs/:id', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.deleteCv);

// Visitors
router.get('/api/admin/visitors', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.getVisitors);

// Scraping triggers
router.post('/api/admin/scrape/all', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.triggerScrapeAll);
router.post('/api/admin/scrape/main', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.triggerScrapeMain);
router.post('/api/admin/scrape/cancel', authMiddleware.authenticate, authMiddleware.authorize('admin'), adminController.cancelScraping);

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
