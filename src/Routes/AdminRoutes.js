import express from 'express';
import adminController from '../Controllers/AdminController.js';
import authMiddleware from '../Middlewares/Auth.js';

const router = express.Router();
const admin = [authMiddleware.authenticate, authMiddleware.authorize('admin')];

// ============================================================
// ADMIN PAGES
// ============================================================
router.get('/admin', ...admin, adminController.adminIndex);
router.get('/admin/dashboard', ...admin, adminController.adminIndex);
router.get('/admin/jobs', ...admin, adminController.adminJobsView);
router.get('/admin/companies', ...admin, adminController.adminCompaniesView);
router.get('/admin/users', ...admin, adminController.adminUsersView);
router.get('/admin/categories', ...admin, adminController.adminCategoriesView);
router.get('/admin/cities', ...admin, adminController.adminCitiesView);
router.get('/admin/sites', ...admin, adminController.adminSitesView);
router.get('/admin/blogs', ...admin, adminController.adminBlogsView);
router.get('/admin/blogs/add', ...admin, adminController.adminBlogsAddView);
router.get('/admin/blogs/edit/:id', ...admin, adminController.adminBlogsEditView);
router.get('/admin/news', ...admin, adminController.adminNewsView);
router.get('/admin/news/add', ...admin, adminController.adminNewsAddView);
router.get('/admin/news/view/:id', ...admin, adminController.adminNewsViewPage);
router.get('/admin/news/edit/:id', ...admin, adminController.adminNewsEditView);
router.get('/admin/cvs', ...admin, adminController.adminCvsView);
router.get('/admin/visitors', ...admin, adminController.adminVisitorsView);
router.get('/admin/logs', ...admin, adminController.adminLogsView);
router.get('/admin/pricing', ...admin, adminController.adminPricingView);
router.get('/admin/settings', ...admin, adminController.adminSettingsView);
router.get('/admin/rss-sources', ...admin, adminController.adminRssSourcesView);
router.get('/admin/seo', ...admin, adminController.adminSeoView);

// ============================================================
// ADMIN API
// ============================================================

// Dashboard
router.get('/api/admin/stats', ...admin, adminController.dashboardStats);
router.get('/api/admin/enums', ...admin, adminController.getEnums);

// Jobs
router.get('/api/admin/jobs', ...admin, adminController.getJobs);
router.get('/api/admin/jobs/:id', ...admin, adminController.getJob);
router.post('/api/admin/jobs', ...admin, adminController.createJob);
router.put('/api/admin/jobs/:id', ...admin, adminController.updateJob);
router.delete('/api/admin/jobs/:id', ...admin, adminController.deleteJob);
router.patch('/api/admin/jobs/:id/toggle', ...admin, adminController.toggleJobActive);
router.post('/api/admin/jobs/remove-duplicates', ...admin, adminController.removeDuplicateJobs);

// Companies
router.get('/api/admin/companies', ...admin, adminController.getCompanies);
router.get('/api/admin/companies/:id', ...admin, adminController.getCompany);
router.post('/api/admin/companies', ...admin, adminController.createCompany);
router.put('/api/admin/companies/:id', ...admin, adminController.updateCompany);
router.delete('/api/admin/companies/:id', ...admin, adminController.deleteCompany);

// Users
router.get('/api/admin/users', ...admin, adminController.getUsers);
router.get('/api/admin/users/:id', ...admin, adminController.getUser);
router.post('/api/admin/users', ...admin, adminController.createUser);
router.put('/api/admin/users/:id', ...admin, adminController.updateUser);
router.delete('/api/admin/users/:id', ...admin, adminController.deleteUser);

// Categories
router.get('/api/admin/categories', ...admin, adminController.getCategories);
router.get('/api/admin/categories/:id', ...admin, adminController.getCategory);
router.post('/api/admin/categories', ...admin, adminController.createCategory);
router.put('/api/admin/categories/:id', ...admin, adminController.updateCategory);
router.delete('/api/admin/categories/:id', ...admin, adminController.deleteCategory);
router.post('/api/admin/categories/:id/upload-logo', ...admin, adminController.uploadCategoryLogo);

// Cities
router.get('/api/admin/cities', ...admin, adminController.getCities);
router.get('/api/admin/cities/:id', ...admin, adminController.getCity);
router.post('/api/admin/cities', ...admin, adminController.createCity);
router.put('/api/admin/cities/:id', ...admin, adminController.updateCity);
router.delete('/api/admin/cities/:id', ...admin, adminController.deleteCity);

// Sites
router.get('/api/admin/sites', ...admin, adminController.getSites);
router.get('/api/admin/sites/:id', ...admin, adminController.getSite);
router.post('/api/admin/sites', ...admin, adminController.createSite);
router.put('/api/admin/sites/:id', ...admin, adminController.updateSite);
router.delete('/api/admin/sites/:id', ...admin, adminController.deleteSite);

// Blogs
router.get('/api/admin/blogs', ...admin, adminController.getBlogs);
router.get('/api/admin/blogs/:id', ...admin, adminController.getBlog);
router.post('/api/admin/blogs', ...admin, adminController.createBlog);
router.put('/api/admin/blogs/:id', ...admin, adminController.updateBlog);
router.delete('/api/admin/blogs/:id', ...admin, adminController.deleteBlog);
router.post('/api/admin/blogs/upload-image', ...admin, adminController.uploadBlogImage);

// News
router.get('/api/admin/news', ...admin, adminController.getNews);
router.get('/api/admin/news/:id', ...admin, adminController.getNewsItem);
router.post('/api/admin/news', ...admin, adminController.createNews);
router.put('/api/admin/news/:id', ...admin, adminController.updateNews);
router.delete('/api/admin/news/:id', ...admin, adminController.deleteNews);

// Logs, CVs, Visitors
router.get('/api/admin/logs', ...admin, adminController.getLogs);
router.get('/api/admin/cvs', ...admin, adminController.getCvs);
router.get('/api/admin/cvs/:id', ...admin, adminController.getCv);
router.patch('/api/admin/cvs/:id/toggle', ...admin, adminController.toggleCvActive);
router.delete('/api/admin/cvs/:id', ...admin, adminController.deleteCv);
router.get('/api/admin/visitors', ...admin, adminController.getVisitors);

// RSS Sources
router.get('/api/admin/rss-sources', ...admin, adminController.getRssSources);
router.post('/api/admin/rss-sources', ...admin, adminController.createRssSource);
router.post('/api/admin/rss-sources/import-all', ...admin, adminController.importAllRss);
router.delete('/api/admin/rss-sources/:id', ...admin, adminController.deleteRssSource);
router.post('/api/admin/rss-sources/:id/import', ...admin, adminController.importRssSource);

// SEO
router.get('/api/admin/seo', ...admin, adminController.getSeoList);
router.get('/api/admin/seo/defaults', ...admin, adminController.getSeoDefaults);
router.post('/api/admin/seo', ...admin, adminController.saveSeo);
router.delete('/api/admin/seo/:id', ...admin, adminController.deleteSeo);

// Pricing Plans
router.get('/api/admin/pricing', ...admin, adminController.getPricingPlans);
router.get('/api/admin/pricing/:id', ...admin, adminController.getPricingPlan);
router.post('/api/admin/pricing', ...admin, adminController.createPricingPlan);
router.put('/api/admin/pricing/:id', ...admin, adminController.updatePricingPlan);
router.delete('/api/admin/pricing/:id', ...admin, adminController.deletePricingPlan);

// Promotion Requests
router.get('/api/admin/promotion-requests', ...admin, adminController.getPromotionRequests);
router.patch('/api/admin/promotion-requests/:id', ...admin, adminController.updatePromotionStatus);

// Scraping
router.post('/api/admin/scrape/all', ...admin, adminController.triggerScrapeAll);
router.post('/api/admin/scrape/main', ...admin, adminController.triggerScrapeMain);
router.post('/api/admin/scrape/cancel', ...admin, adminController.cancelScraping);

export default router;
