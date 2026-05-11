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

const AdminController = {

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

            const recentJobs = await Job.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();

            const view = {
                title: 'Admin Panel',
                body: "Home/Index.ejs",
                js: "Index.js",
                stats: { totalJobs, totalCompanies, totalUsers, totalCvs, totalBlogs, totalVisitors, dailyVisitors, totalSites, totalCategories },
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

            const jobsLast7Days = await Job.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            });

            const recentJobs = await Job.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title companyName isActive createdAt')
                .lean();

            res.json({ totalJobs, totalCompanies, totalUsers, totalCvs, totalBlogs, totalVisitors, dailyVisitors, totalSites, jobsLast7Days, recentJobs });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
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

            res.json({ jobs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getJob: async (req, res) => {
        try {
            const job = await Job.findById(req.params.id).lean();
            if (!job) return res.status(404).json({ error: 'Job not found' });
            res.json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createJob: async (req, res) => {
        try {
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
            res.json({ ...company, jobCount });
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
            const user = await User.findById(req.params.id).select('-password').lean();
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
            const blog = await Blog.create(req.body);
            res.status(201).json(blog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateBlog: async (req, res) => {
        try {
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
                .populate('userId', 'name surname email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            res.json({ cvs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCv: async (req, res) => {
        try {
            const cv = await CV.findById(req.params.id).populate('userId', 'name surname email').lean();
            if (!cv) return res.status(404).json({ error: 'CV not found' });
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

            const totalVisits = visitors.reduce((sum, v) => sum + (v.visitCount || 0), 0);

            // Daily stats for chart
            const dailyStats = await Visitor.aggregate([
                { $match: { deletedAt: null } },
                { $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastVisit' } },
                    visits: { $sum: '$visitCount' },
                    count: { $sum: 1 }
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
    }
};

export default AdminController;
