import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import multer from 'multer';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import Job from '../Models/JobData.js';
import User from '../Models/User.js';
import Company from '../Models/Company.js';
import Category from '../Models/Category.js';
import City from '../Models/City.js';
import Site from '../Models/Site.js';
import Blog from '../Models/Blog.js';
import CV from '../Models/CV.js';
import Visitor from '../Models/Visitor.js';
import VisitorService from '../Services/VisitorService.js';
import JobService from '../Services/JobDataService.js';
import NewsService from '../Services/NewsService.js';
import RssSource from '../Models/RssSource.js';
import RssImportService from '../Services/RssImportService.js';
import Seo from '../Models/Seo.js';
import Log from '../Models/Log.js';
import Enums from '../Config/Enums.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// REVERSE ENUM LOOKUP MAPS
// ============================================================

const _jobTypeMap = {};
Object.entries(Enums.JobTypes).forEach(([key, val]) => {
    _jobTypeMap[val] = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

const _educationMap = {};
Object.entries(Enums.Education).forEach(([key, val]) => {
    _educationMap[val] = key.replace(/([A-Z])/g, ' $1').trim();
});

const _experienceMap = {};
Object.entries(Enums.Experience).forEach(([key, val]) => {
    _experienceMap[val] = key;
});

const _siteIdMap = {};
Object.entries(Enums.SitesWithId).forEach(([key, val]) => {
    _siteIdMap[val] = key.replace(/([A-Z])/g, ' $1').trim();
});

// Blog image upload config
const blogImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), 'uploads', 'blog');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `blog-${uuidv4()}${ext}`);
    }
});
const blogUploadMiddleware = multer({
    storage: blogImageStorage,
    fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        if (allowed.test(path.extname(file.originalname))) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, jpeg, png, gif, webp, svg) are allowed'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

// Category logo upload config
const categoryLogoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), 'uploads', 'category');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `category-${uuidv4()}${ext}`);
    }
});
const categoryLogoUploadMiddleware = multer({
    storage: categoryLogoStorage,
    fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        if (allowed.test(path.extname(file.originalname))) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, jpeg, png, gif, webp, svg) are allowed'), false);
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 }
}).single('logo');

// ============================================================
// VISITOR IP-TO-LOCATION MAPPING (SIMPLIFIED)
// ============================================================

function _resolveVisitorLocation(visitor) {
    if (!visitor || !visitor.ip) {
        visitor._location = 'Unknown';
        return visitor;
    }
    const ip = visitor.ip.trim();
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('127.')) {
        visitor._location = 'Localhost';
    } else if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
        visitor._location = 'Baku, Azerbaijan';
    } else {
        visitor._location = 'Baku, Azerbaijan';
    }
    return visitor;
}

const AdminController = {

    // ============================================================
    // HELPER: RESOLVE JOB ENUMS
    // ============================================================

    _resolveJobEnums(job) {
        if (!job) return job;

        if (job.jobType !== undefined && job.jobType !== null) {
            let jobTypeVal = job.jobType;
            if (typeof jobTypeVal === 'string') {
                if (/^0x[0-9a-f]+$/i.test(jobTypeVal)) {
                    jobTypeVal = parseInt(jobTypeVal, 16);
                } else {
                    jobTypeVal = Number(jobTypeVal);
                }
            }
            job._jobTypeName = _jobTypeMap[jobTypeVal] || 'Unknown';
        }

        if (job.educationId !== undefined && job.educationId !== null) {
            job._educationName = _educationMap[job.educationId] || 'Unknown';
        }

        if (job.experienceId !== undefined && job.experienceId !== null) {
            job._experienceName = _experienceMap[job.experienceId] || 'Unknown';
        }

        return job;
    },

    // ============================================================
    // PAGE RENDERERS
    // ============================================================

    adminIndex: async (req, res) => {
        try {
            const totalJobs = await Job.countDocuments({ isActive: true });
            const totalCompanies = await Company.countDocuments({ deletedAt: null });
            const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
            const totalCvs = await CV.countDocuments({ isActive: true, deletedAt: null });
            const totalBlogs = await Blog.countDocuments({ isActive: true });
            const totalVisitors = await Visitor.countDocuments({ deletedAt: null });
            const dailyVisitors = await VisitorService.dailyCount();
            const totalSites = await Site.countDocuments({ isActive: true });
            const totalCategories = await Category.countDocuments();
            const totalNews = await import('../Models/News.js').then(m => m.default.countDocuments());

            const recentJobs = await Job.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();

            const view = {
                title: 'Admin Panel',
                body: "Home/Index.ejs",
                js: "Index.js",
                stats: { totalJobs, totalCompanies, totalUsers, totalCvs, totalBlogs, totalVisitors, dailyVisitors, totalSites, totalCategories, totalNews },
                recentJobs
            };
            res.render('Admin/Main', view);
        } catch (error) {
            console.error('Admin dashboard error:', error);
            res.render('Admin/Main', { title: 'Admin Panel', body: "Home/Index.ejs", js: "Index.js", stats: {}, recentJobs: [] });
        }
    },

    adminJobsView: async (req, res) => {
        const view = { title: 'Jobs - Admin Panel', body: "Job/Index.ejs", js: "Job.js" };
        res.render('Admin/Main', view);
    },

    adminCompaniesView: async (req, res) => {
        const view = { title: 'Companies - Admin Panel', body: "Company/Index.ejs", js: "Company.js" };
        res.render('Admin/Main', view);
    },

    adminUsersView: async (req, res) => {
        const view = { title: 'Users - Admin Panel', body: "User/Index.ejs", js: "User.js" };
        res.render('Admin/Main', view);
    },

    adminCategoriesView: async (req, res) => {
        const view = { title: 'Categories - Admin Panel', body: "Category/Index.ejs", js: "Category.js" };
        res.render('Admin/Main', view);
    },

    adminCitiesView: async (req, res) => {
        const view = { title: 'Cities - Admin Panel', body: "City/Index.ejs", js: "City.js" };
        res.render('Admin/Main', view);
    },

    adminSitesView: async (req, res) => {
        const view = { title: 'Sites - Admin Panel', body: "Site/Index.ejs", js: "Site.js" };
        res.render('Admin/Main', view);
    },

    adminBlogsView: async (req, res) => {
        const view = { title: 'Blogs - Admin Panel', body: "Blog/Index.ejs", js: "Blog.js" };
        res.render('Admin/Main', view);
    },

    adminBlogsAddView: async (req, res) => {
        const view = { title: 'Add Blog - Admin Panel', body: "Blog/Add.ejs", js: "Blog.js" };
        res.render('Admin/Main', view);
    },

    adminBlogsEditView: async (req, res) => {
        try {
            const blog = await Blog.findById(req.params.id).lean();
            if (!blog) return res.redirect('/admin/blogs');
            const view = { title: 'Edit Blog - Admin Panel', body: "Blog/Edit.ejs", js: "Blog.js", blog };
            res.render('Admin/Main', view);
        } catch {
            res.redirect('/admin/blogs');
        }
    },

    // ============================================================
    // ADMIN NEWS PAGES
    // ============================================================

    adminNewsView: async (req, res) => {
        const view = { title: 'News - Admin Panel', body: "News/Index.ejs", js: "News.js" };
        res.render('Admin/Main', view);
    },

    adminNewsAddView: async (req, res) => {
        const view = { title: 'Add News - Admin Panel', body: "News/Add.ejs", js: "News.js" };
        res.render('Admin/Main', view);
    },

    adminNewsEditView: async (req, res) => {
        try {
            const news = await NewsService.findById(req.params.id);
            if (!news) return res.redirect('/admin/news');
            const view = { title: 'Edit News - Admin Panel', body: "News/Edit.ejs", js: "News.js", news };
            res.render('Admin/Main', view);
        } catch {
            res.redirect('/admin/news');
        }
    },

    adminNewsViewPage: async (req, res) => {
        try {
            const news = await NewsService.findById(req.params.id);
            if (!news) return res.redirect('/admin/news');
            const view = { title: 'View News - Admin Panel', body: "News/View.ejs", js: "News.js", news };
            res.render('Admin/Main', view);
        } catch {
            res.redirect('/admin/news');
        }
    },

    adminRssSourcesView: async (req, res) => {
        const view = { title: 'RSS Sources - Admin Panel', body: "RssSource/Index.ejs", js: "RssSource.js" };
        res.render('Admin/Main', view);
    },

    getRssSources: async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const total = await RssSource.countDocuments();
            const sources = await RssSource.find()
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean();
            res.json({ sources, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createRssSource: async (req, res) => {
        try {
            const source = await RssSource.create(req.body);
            res.status(201).json(source);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteRssSource: async (req, res) => {
        try {
            await RssSource.findByIdAndDelete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    importRssSource: async (req, res) => {
        try {
            const result = await RssImportService.importSingle(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    importAllRss: async (req, res) => {
        try {
            const results = await RssImportService.importAll();
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    adminCvsView: async (req, res) => {
        const view = { title: 'CVs - Admin Panel', body: "Cv/Index.ejs", js: "Cv.js" };
        res.render('Admin/Main', view);
    },

    adminVisitorsView: async (req, res) => {
        const view = { title: 'Visitors - Admin Panel', body: "Visitor/Index.ejs", js: "Visitor.js" };
        res.render('Admin/Main', view);
    },

    adminSettingsView: async (req, res) => {
        const view = { title: 'Settings - Admin Panel', body: "Settings/Index.ejs", js: "Settings.js" };
        res.render('Admin/Main', view);
    },

    adminLogsView: async (req, res) => {
        const view = { title: 'Error Logs - Admin Panel', body: "Log/Index.ejs", js: "Log.js" };
        res.render('Admin/Main', view);
    },

    // ============================================================
    // API - DASHBOARD STATS
    // ============================================================

    dashboardStats: async (req, res) => {
        try {
            const totalJobs = await Job.countDocuments({ isActive: true });
            const totalCompanies = await Company.countDocuments({ deletedAt: null });
            const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
            const totalCvs = await CV.countDocuments({ isActive: true, deletedAt: null });
            const totalBlogs = await Blog.countDocuments({ isActive: true });
            const totalVisitors = await Visitor.countDocuments({ deletedAt: null });
            const dailyVisitors = await VisitorService.dailyCount();
            const totalSites = await Site.countDocuments({ isActive: true });
            const totalNews = await (await import('../Models/News.js')).default.countDocuments();

            const jobsLast7Days = await Job.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            });

            const recentJobs = await Job.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title companyName isActive createdAt')
                .lean();

            res.json({ totalJobs, totalCompanies, totalUsers, totalCvs, totalBlogs, totalVisitors, dailyVisitors, totalSites, totalNews, jobsLast7Days, recentJobs });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - ENUMS
    // ============================================================

    getEnums: async (req, res) => {
        const jobTypes = {};
        Object.entries(Enums.JobTypes).forEach(([key, val]) => {
            jobTypes[val] = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        });
        const education = {};
        Object.entries(Enums.Education).forEach(([key, val]) => {
            education[val] = key.replace(/([A-Z])/g, ' $1').trim();
        });
        const experience = {};
        Object.entries(Enums.Experience).forEach(([key, val]) => {
            experience[val] = key;
        });
        const sites = {};
        Object.entries(Enums.SitesWithId).forEach(([key, val]) => {
            sites[val] = key.replace(/([A-Z])/g, ' $1').trim();
        });
        res.json({ jobTypes, education, experience, sites });
    },

    // ============================================================
    // API - JOBS CRUD
    // ============================================================

    getJobs: async (req, res) => {
        try {
            const { page = 1, limit = 20, search, isActive, categoryId, sort } = req.query;
            const query = {};
            if (search) query.title = { $regex: search, $options: 'i' };
            if (isActive !== undefined) query.isActive = isActive === 'true';
            if (categoryId) query.categoryId = Number(categoryId);

            let sortObj = { createdAt: -1 };
            if (sort === 'title') sortObj = { title: 1 };
            if (sort === '-title') sortObj = { title: -1 };

            const total = await Job.countDocuments(query);
            const jobs = await Job.find(query)
                .sort(sortObj)
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            jobs.forEach(job => AdminController._resolveJobEnums(job));

            res.json({ jobs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getJob: async (req, res) => {
        try {
            const job = await Job.findById(req.params.id).lean();
            if (!job) return res.status(404).json({ error: 'Job not found' });
            AdminController._resolveJobEnums(job);
            res.json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createJob: async (req, res) => {
        try {
            if (!req.body.slug && req.body.title) {
                req.body.slug = slugify(req.body.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 8);
            }
            const job = await Job.create(req.body);
            res.status(201).json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateJob: async (req, res) => {
        try {
            const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!job) return res.status(404).json({ error: 'Job not found' });
            res.json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteJob: async (req, res) => {
        try {
            const job = await Job.findByIdAndDelete(req.params.id);
            if (!job) return res.status(404).json({ error: 'Job not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    toggleJobActive: async (req, res) => {
        try {
            const job = await Job.findById(req.params.id);
            if (!job) return res.status(404).json({ error: 'Job not found' });
            job.isActive = !job.isActive;
            await job.save();
            res.json({ isActive: job.isActive });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    removeDuplicateJobs: async (req, res) => {
        try {
            const result = await JobService.removeDuplicates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - COMPANIES CRUD
    // ============================================================

    getCompanies: async (req, res) => {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const query = { deletedAt: null };
            if (search) query.companyName = { $regex: search, $options: 'i' };

            const total = await Company.countDocuments(query);
            const companies = await Company.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            res.json({ companies, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCompany: async (req, res) => {
        try {
            const company = await Company.findById(req.params.id).lean();
            if (!company) return res.status(404).json({ error: 'Company not found' });
            const jobCount = await Job.countDocuments({ companyName: company.companyName });
            const jobs = await Job.find({ companyName: company.companyName })
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
            jobs.forEach(job => AdminController._resolveJobEnums(job));
            res.json({ ...company, jobCount, jobs });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createCompany: async (req, res) => {
        try {
            const company = await Company.create(req.body);
            res.status(201).json(company);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateCompany: async (req, res) => {
        try {
            const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!company) return res.status(404).json({ error: 'Company not found' });
            res.json(company);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteCompany: async (req, res) => {
        try {
            const company = await Company.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
            if (!company) return res.status(404).json({ error: 'Company not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - USERS CRUD
    // ============================================================

    getUsers: async (req, res) => {
        try {
            const { page = 1, limit = 20, search, role } = req.query;
            const query = {};
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { surname: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } }
                ];
            }
            if (role) query.role = role;

            const total = await User.countDocuments(query);
            const users = await User.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .select('-password')
                .lean();

            res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password').populate('companyIds', 'companyName').lean();
            if (!user) return res.status(404).json({ error: 'User not found' });
            const jobCount = user.role === 'company'
                ? await Job.countDocuments({ companyName: user.companyName })
                : 0;
            const cvCount = user.role === 'user'
                ? await CV.countDocuments({ userId: user._id, deletedAt: null })
                : 0;
            res.json({ ...user, jobCount, cvCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const { password, ...rest } = req.body;
            const user = new User({ ...rest, password: password || 'default123' });
            await user.save();
            res.status(201).json(user.toJSON());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (updateData.password) {
                const user = await User.findById(req.params.id);
                if (!user) return res.status(404).json({ error: 'User not found' });
                user.password = updateData.password;
                delete updateData.password;
                Object.assign(user, updateData);
                await user.save();
                return res.json(user.toJSON());
            }
            const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - CATEGORIES CRUD
    // ============================================================

    getCategories: async (req, res) => {
        try {
            const categories = await Category.find().sort({ categoryName: 1 }).lean();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCategory: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id).lean();
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createCategory: async (req, res) => {
        try {
            const category = await Category.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - CITIES CRUD
    // ============================================================

    getCities: async (req, res) => {
        try {
            const cities = await City.find().sort({ name: 1 }).lean();
            res.json(cities);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCity: async (req, res) => {
        try {
            const city = await City.findById(req.params.id).lean();
            if (!city) return res.status(404).json({ error: 'City not found' });
            res.json(city);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createCity: async (req, res) => {
        try {
            const city = await City.create(req.body);
            res.status(201).json(city);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateCity: async (req, res) => {
        try {
            const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!city) return res.status(404).json({ error: 'City not found' });
            res.json(city);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteCity: async (req, res) => {
        try {
            const city = await City.findByIdAndDelete(req.params.id);
            if (!city) return res.status(404).json({ error: 'City not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - SITES CRUD
    // ============================================================

    getSites: async (req, res) => {
        try {
            const sites = await Site.find({ deletedAt: null }).sort({ name: 1 }).lean();
            res.json(sites);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getSite: async (req, res) => {
        try {
            const site = await Site.findById(req.params.id).lean();
            if (!site) return res.status(404).json({ error: 'Site not found' });
            res.json(site);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createSite: async (req, res) => {
        try {
            const site = await Site.create(req.body);
            res.status(201).json(site);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateSite: async (req, res) => {
        try {
            const site = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!site) return res.status(404).json({ error: 'Site not found' });
            res.json(site);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteSite: async (req, res) => {
        try {
            const site = await Site.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
            if (!site) return res.status(404).json({ error: 'Site not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - BLOGS CRUD
    // ============================================================

    getBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
            res.json(blogs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBlog: async (req, res) => {
        try {
            const blog = await Blog.findById(req.params.id).lean();
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.json(blog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createBlog: async (req, res) => {
        try {
            if (!req.body.slug && req.body.name) {
                req.body.slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 100000);
            }
            const blog = await Blog.create(req.body);
            res.status(201).json(blog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateBlog: async (req, res) => {
        try {
            if (!req.body.slug && req.body.name) {
                req.body.slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 100000);
            }
            const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.json(blog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const blog = await Blog.findByIdAndDelete(req.params.id);
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - NEWS CRUD
    // ============================================================

    getNews: async (req, res) => {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const result = await NewsService.getAllAdmin({ page: Number(page), limit: Number(limit), search });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getNewsItem: async (req, res) => {
        try {
            const news = await NewsService.findById(req.params.id);
            res.json(news);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createNews: async (req, res) => {
        try {
            if (req.body.description) {
                req.body.description = req.body.description.replace(/<[^>]*>/g, '');
            }
            const news = await NewsService.create(req.body);
            res.status(201).json(news);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateNews: async (req, res) => {
        try {
            if (req.body.description) {
                req.body.description = req.body.description.replace(/<[^>]*>/g, '');
            }
            const news = await NewsService.update(req.params.id, req.body);
            res.json(news);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteNews: async (req, res) => {
        try {
            await NewsService.delete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    uploadBlogImage: async (req, res) => {
        blogUploadMiddleware(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message || 'Image upload failed' });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No image file provided' });
            }
            res.json({ url: `/uploads/blog/${req.file.filename}` });
        });
    },

    // ============================================================
    // API - CATEGORY LOGO UPLOAD
    // ============================================================

    uploadCategoryLogo: async (req, res) => {
        categoryLogoUploadMiddleware(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message || 'Logo upload failed' });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No logo file provided' });
            }

            try {
                const category = await Category.findById(req.params.id);
                if (!category) {
                    return res.status(404).json({ error: 'Category not found' });
                }

                // Delete old logo file if exists
                if (category.logoUrl) {
                    const oldPath = path.join(process.cwd(), category.logoUrl.replace(/^\//, ''));
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }

                category.logoUrl = `/uploads/category/${req.file.filename}`;
                await category.save();

                res.json({ logoUrl: category.logoUrl });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },

    // ============================================================
    // API - ERROR LOGS
    // ============================================================


    getLogs: async (req, res) => {
        try {
            const { days = 1, level, source } = req.query;
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - Number(days));
            const query = { createdAt: { $gte: cutoff } };
            if (level && ["info", "warn", "error"].includes(level)) {
                query.level = level;
            }
            if (source) {
                query.source = source;
            }
            const logs = await Log.find(query)
                .sort({ createdAt: -1 })
                .limit(200)
                .lean();
            res.json({ logs, total: logs.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - CVs
    // ============================================================

    getCvs: async (req, res) => {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const query = { deletedAt: null };
            if (search) {
                query.$or = [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ];
            }

            const total = await CV.countDocuments(query);
            const cvs = await CV.find(query)
                .populate('userId', 'name surname email phone isActive')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            // Ensure userId details are properly resolved
            const resolvedCvs = cvs.map(cv => {
                if (cv.userId && typeof cv.userId === 'object') {
                    cv._user = cv.userId;
                    if (!cv.fullName && cv.userId.name) {
                        cv.fullName = `${cv.userId.name} ${cv.userId.surname || ''}`.trim();
                    }
                    if (!cv.email && cv.userId.email) {
                        cv.email = cv.userId.email;
                    }
                } else if (!cv.userId) {
                    cv._user = null;
                }
                return cv;
            });

            res.json({ cvs: resolvedCvs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCv: async (req, res) => {
        try {
            const cv = await CV.findById(req.params.id).populate('userId', 'name surname email phone isActive').lean();
            if (!cv) return res.status(404).json({ error: 'CV not found' });
            if (cv.userId && typeof cv.userId === 'object') {
                cv._user = cv.userId;
            }
            res.json(cv);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteCv: async (req, res) => {
        try {
            const cv = await CV.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
            if (!cv) return res.status(404).json({ error: 'CV not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    toggleCvActive: async (req, res) => {
        try {
            const cv = await CV.findById(req.params.id);
            if (!cv) return res.status(404).json({ error: 'CV not found' });
            cv.isActive = !cv.isActive;
            await cv.save();
            res.json({ isActive: cv.isActive });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - VISITORS
    // ============================================================

    getVisitors: async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const query = { deletedAt: null };

            const total = await Visitor.countDocuments(query);
            const visitors = await Visitor.find(query)
                .sort({ lastVisit: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            // Resolve approximate geolocation for each visitor
            visitors.forEach(visitor => _resolveVisitorLocation(visitor));

            const totalVisits = visitors.reduce((sum, v) => sum + (v.visitCount || 0), 0);

            // Daily stats for chart (count unique visitors per day, not sum of visitCount)
            const dailyStats = await Visitor.aggregate([
                { $match: { deletedAt: null, lastVisit: { $ne: null } } },
                { $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastVisit' } },
                    visits: { $sum: 1 },
                    totalVisitsSum: { $sum: '$visitCount' }
                }},
                { $sort: { _id: -1 } },
                { $limit: 30 }
            ]);

            res.json({ visitors, total, totalVisits, dailyStats, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - SCRAPING TRIGGERS
    // ============================================================

    triggerScrapeAll: async (req, res) => {
        try {
            const { requestAllSites } = await import('../Helpers/Automation.js');
            await requestAllSites(false);
            res.json({ success: true, message: 'Scraping started for all sites' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    triggerScrapeMain: async (req, res) => {
        try {
            const { requestAllSites } = await import('../Helpers/Automation.js');
            await requestAllSites(true);
            res.json({ success: true, message: 'Scraping started for main cities' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    cancelScraping: async (req, res) => {
        try {
            const { cancelRequest } = await import('../Helpers/Automation.js');
            cancelRequest();
            res.json({ success: true, message: 'Scraping cancelled' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // SEO MANAGEMENT
    // ============================================================

    adminSeoView: async (req, res) => {
        const view = { title: 'SEO Management - Admin Panel', body: "Seo/Index.ejs", js: "Seo.js" };
        res.render('Admin/Main', view);
    },

    getSeoList: async (req, res) => {
        try {
            const entries = await Seo.find().sort({ route: 1 }).lean();
            res.json({ success: true, data: entries });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getSeoDefaults: async (req, res) => {
        const defaults = {
            '/': { title: 'Ana Səhifə', description: 'Azərbaycanda ən son vakansiyalar, iş elanları və karyera imkanları. Jobing.az ilə iş axtarışınızı başlayın.' },
            '/auth': { title: 'Giriş / Qeydiyyat', description: 'Jobing.az-a daxil olun və ya yeni hesab yaradın. İş axtarışı və elan yerləşdirmə üçün qeydiyyatdan keçin.' },
            '/vakansiyalar': { title: 'Vakansiyalar', description: 'Azərbaycandakı ən son vakansiya elanları. Minlərlə iş imkanı arasından sizə uyğun olanı tapın.' },
            '/sirketler': { title: 'Şirkətlər', description: 'Azərbaycanda fəaliyyət göstərən şirkətlər və onların vakansiyaları.' },
            '/cv-ler': { title: 'CV-lər', description: 'İş axtaranların peşəkar CV-ləri. Namizədlərin təcrübə və bacarıqlarını kəşf edin.' },
            '/resumes': { title: 'CV-lər', description: 'İş axtaranların CV-ləri. Namizədlərin təcrübə və bacarıqlarını kəşf edin.' },
            '/about-us': { title: 'Haqqımızda', description: 'Jobing.az - Azərbaycanın ən böyük iş axtarış platforması. Missiyamız iş axtaranlar və işəgötürənləri bir araya gətirməkdir.' },
            '/contact': { title: 'Bizimlə Əlaqə', description: 'Jobing.az ilə əlaqə saxlayın. Suallarınız, təklif və rəyləriniz üçün bizə yazın.' },
            '/faq': { title: 'Tez-tez verilən suallar', description: 'İş axtarışı, CV yaratma, elan yerləşdirmə və digər mövzularda ən çox verilən suallar.' },
            '/blogs': { title: 'Bloqlar', description: 'Karyera məsləhətləri, iş axtarışı strategiyaları və peşəkar inkişaf haqqında bloq yazıları.' },
            '/xeberler': { title: 'Xəbərlər', description: 'Ən son iş və karyera xəbərləri. Azərbaycanda iş dünyası haqqında güncəl məlumatlar.' },
            '/add-job': { title: 'Yeni vakansiya', description: 'Şirkətiniz üçün yeni vakansiya elanı yerləşdirin. İş axtaran ən uyğun namizədlərə çatın.' },
            '/dashboard': { title: 'Mənim Panelim', description: 'CV-lərinizi idarə edin, müraciətlərinizi izləyin.' },
            '/company/dashboard': { title: 'Şirkət Paneli', description: 'Vakansiyalarınızı idarə edin, müraciətlərə baxın.' },
            '/company/settings': { title: 'Şirkət Profili', description: 'Şirkət məlumatlarınızı redaktə edin və profilinizi yeniləyin.' },
            '/cv/create': { title: 'CV Yarat', description: 'Peşəkar CV-nizi yaradın və işəgötürənlərə nümayiş etdirin.' },
            '/cv/upload': { title: 'CV Yüklə', description: 'Mövcud CV-nizi yükləyin və işəgötürənlərlə paylaşın.' }
        };
        res.json({ success: true, data: defaults });
    },

    saveSeo: async (req, res) => {
        try {
            const { route, title, description, headerHtml, bodyTopHtml, bodyBottomHtml, footerHtml, ogTitle, ogDescription, ogImage, canonical, customRoute, noindex, isActive } = req.body;
            if (!route) {
                return res.status(400).json({ success: false, error: 'Route is required' });
            }

            const data = {
                title: title || '',
                description: description || '',
                headerHtml: headerHtml || '',
                bodyTopHtml: bodyTopHtml || '',
                bodyBottomHtml: bodyBottomHtml || '',
                footerHtml: footerHtml || '',
                ogTitle: ogTitle || '',
                ogDescription: ogDescription || '',
                ogImage: ogImage || '',
                canonical: canonical || '',
                customRoute: customRoute || '',
                noindex: !!noindex,
                isActive: isActive !== undefined ? isActive : true
            };

            const seo = await Seo.findOneAndUpdate(
                { route: route.trim() },
                { $set: data },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            ).lean();

            res.json({ success: true, data: seo });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    deleteSeo: async (req, res) => {
        try {
            await Seo.findByIdAndDelete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

export default AdminController;
