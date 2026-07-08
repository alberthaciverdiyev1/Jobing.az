import express from 'express';
import companyController from '../Controllers/CompanyController.js';
import categoryController from '../Controllers/CategoryController.js';
import jobDataController from '../Controllers/JobDataController.js';
import siteController from '../Controllers/SiteController.js';
import scrapeController from '../Controllers/ScrapeController.js';
import cityController from '../Controllers/CityController.js';
import blogController from '../Controllers/BlogController.js';
import authController from '../Controllers/AuthController.js';
import cvController from '../Controllers/CVController.js';
import applicationController from '../Controllers/ApplicationController.js';
import viewController from '../Controllers/ViewController.js';
import newsController from '../Controllers/NewsController.js';
import jobSeekerController from '../Controllers/JobSeekerController.js';
import validator from '../Validators/Main.js';
import authMiddleware from '../Middlewares/Auth.js';
import { authLimiter, jobLimiter } from '../Middlewares/RateLimit.js';

const router = express.Router();

// ============================================================
// AUTH
// ============================================================
router.post('/api/auth/register', authLimiter, validator.registerValidator, authController.register);
router.post('/api/auth/login', authLimiter, validator.loginValidator, authController.login);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/logout', authController.logout);
router.get('/api/auth/me', authController.getMe);

// ============================================================
// NEWS API (public)
// ============================================================
router.get('/api/news', newsController.publicList);
router.get('/api/news/:slug', newsController.publicDetail);
router.get('/api/news-categories', newsController.getCategories);
router.get('/api/news-most-read', newsController.getMostRead);

// ============================================================
// CV (protected — user)
// ============================================================
router.post('/api/cv', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.create);
router.post('/api/cv/upload', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.upload);
router.get('/api/cv', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.list);
router.get('/api/cv/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.getById);
router.put('/api/cv/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.update);
router.delete('/api/cv/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), cvController.delete);

// ============================================================
// PUBLIC CV & COMPANY API
// ============================================================
router.get('/api/public/cvs', cvController.publicList);
router.get('/api/public/cvs/:id', cvController.publicDetail);
router.get('/api/public/companies', companyController.publicList);
router.get('/api/public/companies/:id', companyController.publicDetail);

// ============================================================
// USER APPLICATIONS (protected — user)
// ============================================================
router.get('/api/applications', authMiddleware.authenticate, authMiddleware.authorize('user'), applicationController.getMyApplications);
router.post('/api/applications', authMiddleware.authenticate, authMiddleware.authorize('user'), applicationController.create);
router.put('/api/applications/:id/respond', authMiddleware.authenticate, authMiddleware.authorize('user'), applicationController.userRespond);

// ============================================================
// BLOG API
// ============================================================
router.post('/api/blog/add', blogController.create);
router.get('/api/blogs', blogController.getAll);
router.get('/api/blog/:id', blogController.getAll);

// ============================================================
// JOB DATA API
// ============================================================
router.post('/api/jobs', jobDataController.create);
router.get('/api/jobs', jobDataController.getAll);
router.get('/api/jobs/:id', jobDataController.getSiteById);
router.put('/api/jobs/:id', jobDataController.updateSite);
router.delete('/api/jobs/:id', jobDataController.deleteSite);
router.post('/api/jobs/remove-duplicates', jobDataController.removeDuplicates);
router.post('/api/jobs/request-all-sites', jobDataController.requestAllSites);
router.post('/api/jobs/add-request', authMiddleware.authenticate, jobLimiter, validator.addJobValidator, jobDataController.addJobRequest);

// ============================================================
// PRICING & PROMOTION
// ============================================================
router.get('/api/pricing/plans', jobDataController.getPricingPlans);
router.post('/api/pricing/request', jobLimiter, validator.promotionValidator, jobDataController.promotionRequest);

// ============================================================
// JOB SEEKER API
// ============================================================
router.post('/api/job-seeker', authMiddleware.authenticate, authMiddleware.authorize('user'), jobLimiter, validator.addJobSeekerValidator, jobSeekerController.create);
router.get('/api/job-seekers', jobSeekerController.getAll);
router.get('/api/job-seeker/:id', jobSeekerController.getById);
router.get('/api/job-seeker/my-ads', authMiddleware.authenticate, authMiddleware.authorize('user'), jobSeekerController.getMyAds);
router.delete('/api/job-seeker/:id', authMiddleware.authenticate, authMiddleware.authorize('user'), jobSeekerController.delete);

// ============================================================
// SITE API
// ============================================================
router.post('/api/site', validator.siteValidator, siteController.create);
router.get('/api/site', siteController.getAll);
router.get('/api/site/:id', siteController.findById);
router.put('/api/site/:id', validator.siteValidator, siteController.update);
router.delete('/api/site/:id', siteController.delete);

// ============================================================
// COMPANY API
// ============================================================
router.post('/api/companies', companyController.create);
router.post('/api/companies/download-logos', companyController.downloadCompanyLogos);
router.get('/api/companies/:id', companyController.findById);
router.put('/api/companies/:id', validator.companyValidator, companyController.update);
router.delete('/api/companies/:id', companyController.delete);
router.post('/api/companies/remove-duplicates', companyController.removeDuplicates);

// ============================================================
// COMPANY PROFILE (protected — company)
// ============================================================
router.get('/api/company/profile', authMiddleware.authenticate, authMiddleware.authorize('company'), companyController.getMyProfile);
router.put('/api/company/profile', authMiddleware.authenticate, authMiddleware.authorize('company'), companyController.updateMyProfile);
router.post('/api/company/upload-logo', authMiddleware.authenticate, authMiddleware.authorize('company'), companyController.uploadLogo);
router.post('/api/company/upload-banner', authMiddleware.authenticate, authMiddleware.authorize('company'), companyController.uploadBanner);

// ============================================================
// CATEGORY API
// ============================================================
router.post('/api/foreign-categories', categoryController.addForeignCategories);
router.get('/api/foreign-categories', categoryController.getForeignCategories);
router.get('/api/categories', categoryController.getLocalCategories);

// ============================================================
// CITY API
// ============================================================
router.post('/api/cities', cityController.create);
router.get('/api/cities', cityController.getAll);

// ============================================================
// SCRAPE
// ============================================================
router.get('/api/scrape', scrapeController.getData);

// ============================================================
// ENUMS & STATS
// ============================================================
router.get('/education', viewController.education);
router.get('/experience', viewController.experience);
router.get('/statistics', viewController.statistics);


// ============================================================
// MAIL
// ============================================================
router.post('/send-mail', viewController.sendMail);

export default router;
