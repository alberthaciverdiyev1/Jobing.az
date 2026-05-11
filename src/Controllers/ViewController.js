import Enums from "../Config/Enums.js";
import sendEmail from "../Helpers/NodeMailer.js";
import CategoryService from "../Services/CategoryService.js";
import CompanyService from "../Services/CompanyService.js";
import JobDataService from "../Services/JobDataService.js";
import VisitorService from "../Services/VisitorService.js";
import Blog from "../Models/Blog.js";
import BlogService from "../Services/BlogService.js";
import CVService from "../Services/CVService.js";
import NewsService from "../Services/NewsService.js";

const ViewController = {
    home: async (req, res) => {
        let topCategories = [];
        try {
            topCategories = await JobDataService.getTopCategories();
        } catch (error) {
            console.error('home topCategories error:', error.message);
        }
        const view = {
            title: 'Ana Səhifə',
            body: "Home/Index.ejs",
            js: "Home.js",
            currentPage: 'home',
            topCategories
        };
        res.render('Main', view);
    },
    auth: async (req, res) => {
        // If already logged in, redirect to dashboard
        if (req.user) {
            if (req.user.role === 'company') return res.redirect('/company/dashboard');
            if (req.user.role === 'hr') return res.redirect('/hr/dashboard');
            return res.redirect('/dashboard');
        }
        const view = {
            title: 'Giriş / Qeydiyyat',
            body: "Auth/Index.ejs",
            js: "Auth.js",
            currentPage: 'auth'
        };
        res.render('Main', view);
    },
    jobs: async (req, res) => {
        const view = {
            title: 'Vakansiyalar',
            body: "Jobs/Index.ejs",
            js: "Jobs.js",
            currentPage: 'jobs'
        };
        res.render('Main', view);
    },
    resumes: async (req, res) => {
        const view = {
            title: 'CV-lər',
            body: "Jobs/Index.ejs",
            js: "Jobs.js",
            currentPage: 'resumes'
        };
        res.render('Main', view);
    },
    blogs: async (req, res) => {
        const view = {
            title: 'Bloqlar',
            body: "Blog/List.ejs",
            js: "Blog.js",
            currentPage: 'blogs'
        };
        res.render('Main', view);
    },

    blog: async (req, res) => {
        const {slug} = req.params;
        const blog = await BlogService.details(slug);
        const view = {
            title: blog.name,
            body: 'Blog/Details.ejs',
            js: 'Blog.js',
            currentPage: 'blogs',
            blog: blog
        };
        res.render('Main', view);
    },

    // ============================================
    // NEWS
    // ============================================
    newsList: async (req, res) => {
        try {
            const categories = await NewsService.getCategories();
            const view = {
                title: 'Xəbərlər',
                body: "News/List.ejs",
                js: "NewsList.js",
                currentPage: 'news',
                categories
            };
            res.render('Main', view);
        } catch (error) {
            console.error('newsList error:', error.message);
            res.render('Partials/Error.ejs');
        }
    },

    newsDetail: async (req, res) => {
        const { slug } = req.params;
        try {
            const news = await NewsService.details(slug);
            const mostRead = await NewsService.getMostRead();
            const similar = await NewsService.getSimilar(news.category, slug);
            const view = {
                title: news.title,
                body: 'News/Detail.ejs',
                js: 'NewsDetail.js',
                currentPage: 'news',
                news,
                mostRead,
                similar
            };
            res.render('Main', view);
        } catch {
            res.status(404).render('Partials/Error.ejs');
        }
    },

    aboutUs: async (req, res) => {
        const view = {
            title: 'Haqqımızda',
            body: "AboutUs/Index.ejs",
            js: null,
            currentPage: 'about'
        };
        res.render('Main', view);
    },
    faq: async (req, res) => {
        const view = {
            title: 'Tez-tez verilən suallar',
            body: "AboutUs/Faq.ejs",
            js: null,
            currentPage: 'faq'
        };
        res.render('Main', view);
    },
    contactUs: async (req, res) => {
        const view = {
            title: 'Bizimlə Əlaqə',
            body: "ContactUs/Index.ejs",
            js: 'ContactUs.js',
            currentPage: 'contact'
        };
        res.render('Main', view);
    },
    addJob: async (req, res) => {
        // Only company, hr, and admin users can post jobs
        if (req.user && req.user.role === 'user') {
            return res.redirect('/dashboard');
        }
        const view = {
            title: 'Yeni vakansiya',
            body: "Jobs/Add.ejs",
            js: 'NewJob.js',
            currentPage: 'add-job'
        };
        res.render('Main', view);
    },

    // Dashboard - User
    userDashboard: async (req, res) => {
        const cvs = await CVService.findByUser(req.user._id);
        const view = {
            title: 'Mənim Panelim',
            body: "Dashboard/Index.ejs",
            js: "Dashboard.js",
            currentPage: 'dashboard',
            cvs
        };
        res.render('Main', view);
    },

    // Dashboard - Company
    companyDashboard: async (req, res) => {
        const jobs = await JobDataService.findByCompany(req.user.companyName);
        const view = {
            title: 'Şirkət Paneli',
            body: "Dashboard/Company.ejs",
            js: "Dashboard.js",
            currentPage: 'company-dashboard',
            jobs
        };
        res.render('Main', view);
    },

    // Company Profile Settings
    companySettings: async (req, res) => {
        let company = null;
        if (req.user.companyName) {
            company = await CompanyService.findByCompanyName(req.user.companyName);
        }
        const view = {
            title: 'Şirkət Profili',
            body: "Dashboard/CompanySettings.ejs",
            js: "CompanySettings.js",
            currentPage: 'company-settings',
            company
        };
        res.render('Main', view);
    },

    // CV Create page
    cvCreate: async (req, res) => {
        const view = {
            title: 'CV Yarat',
            body: "CV/Create.ejs",
            js: "CV.js",
            currentPage: 'cv-create'
        };
        res.render('Main', view);
    },

    // CV Upload page
    cvUpload: async (req, res) => {
        const view = {
            title: 'CV Yüklə',
            body: "CV/Upload.ejs",
            js: "CV.js",
            currentPage: 'cv-upload'
        };
        res.render('Main', view);
    },

    // CV Edit page
    cvEdit: async (req, res) => {
        try {
            const cv = await CVService.findByIdAndUser(req.params.id, req.user._id);
            if (!cv) {
                return res.status(404).send('CV tapılmadı');
            }
            const view = {
                title: 'CV Redaktə Et',
                body: "CV/Create.ejs",
                js: "CV.js",
                currentPage: 'cv-edit',
                cv
            };
            res.render('Main', view);
        } catch {
            res.status(500).send('Xəta baş verdi');
        }
    },

    education: (req, res) => {
        const educationData = Enums.Education;
        res.status(200).json(educationData);
    },
    experience: (req, res) => {
        const experience = Enums.Experience;
        res.status(200).json(experience);
    },
    sendMail: async (req, res) => {
        const response = await sendEmail(req.body.data);
        res.status(200).json({status: response.status, message: response.message});
    },
    // CV List page
    cvList: async (req, res) => {
        const view = {
            title: 'CV-lər',
            body: "CV/List.ejs",
            js: "CVList.js",
            currentPage: 'cv-list'
        };
        res.render('Main', view);
    },

    // CV Detail page
    cvDetail: async (req, res) => {
        const view = {
            title: 'CV',
            body: "CV/Detail.ejs",
            js: "CVDetail.js",
            currentPage: 'cv-detail'
        };
        res.render('Main', view);
    },

    // Company List page
    companyList: async (req, res) => {
        const view = {
            title: 'Şirkətlər',
            body: "Company/List.ejs",
            js: "Company.js",
            currentPage: 'company-list'
        };
        res.render('Main', view);
    },

    // Company Detail page
    companyDetail: async (req, res) => {
        const view = {
            title: 'Şirkət',
            body: "Company/Detail.ejs",
            js: "Company.js",
            currentPage: 'company-detail'
        };
        res.render('Main', view);
    },

    statistics: async (req, res) => {
        const company = await CompanyService.count();
        const vacancy = await JobDataService.count();
        const visitor = await VisitorService.count(30);
        const dailyVisitor = await VisitorService.dailyCount();
        const totalVisitor = await VisitorService.count(365);
        res.status(200).json({status: 200, message: "", data: {company, vacancy, visitor, dailyVisitor, totalVisitor}});
    }
};

export default ViewController;
