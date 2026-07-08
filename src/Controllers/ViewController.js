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
import JobData from "../Models/JobData.js";
import Company from "../Models/Company.js";
import PricingPlan from "../Models/PricingPlan.js";
import JobSeekerService from "../Services/JobSeekerService.js";
import CityService from "../Services/CityService.js";

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
            description: 'Azərbaycanda ən son vakansiyalar, iş elanları və karyera imkanları. Jobing.az ilə iş axtarışınızı başlayın.',
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
            description: 'Jobing.az-a daxil olun və ya yeni hesab yaradın. İş axtarışı və elan yerləşdirmə üçün qeydiyyatdan keçin.',
            body: "Auth/Index.ejs",
            js: "Auth.js",
            currentPage: 'auth',
            authMessage: req.query.message || null,
            authRedirect: req.query.redirect || null
        };
        res.render('Main', view);
    },
    jobs: async (req, res) => {
        const view = {
            title: 'Vakansiyalar',
            description: 'Azərbaycandakı ən son vakansiya elanları. Minlərlə iş imkanı arasından sizə uyğun olanı tapın.',
            body: "Jobs/Index.ejs",
            js: "Jobs.js",
            currentPage: 'jobs'
        };
        res.render('Main', view);
    },
    resumes: async (req, res) => {
        const view = {
            title: 'CV-lər',
            description: 'İş axtaranların CV-ləri. Namizədlərin təcrübə və bacarıqlarını kəşf edin.',
            body: "Jobs/Index.ejs",
            js: "Jobs.js",
            currentPage: 'resumes'
        };
        res.render('Main', view);
    },
    blogs: async (req, res) => {
        const view = {
            title: 'Bloqlar',
            description: 'Karyera məsləhətləri, iş axtarışı strategiyaları və peşəkar inkişaf haqqında bloq yazıları.',
            body: "Blog/List.ejs",
            js: "Blog.js",
            currentPage: 'blogs'
        };
        res.render('Main', view);
    },

    blog: async (req, res) => {
        try {
            const {slug} = req.params;
            const blog = await BlogService.details(slug);
            const view = {
                title: blog.name,
                description: blog.description || blog.name,
                ogTitle: blog.name,
                ogDescription: blog.description || blog.name,
                ogImage: blog.imageUrl || undefined,
                ogType: 'article',
                body: 'Blog/Details.ejs',
                js: 'Blog.js',
                currentPage: 'blogs',
                blog: blog
            };
            res.render('Main', view);
        } catch (error) {
            res.redirect('/blogs');
        }
    },

    // ============================================
    // NEWS
    // ============================================
    newsList: async (req, res) => {
        try {
            const categories = await NewsService.getCategories();
            const view = {
                title: 'Xəbərlər',
                description: 'Ən son iş və karyera xəbərləri. Azərbaycanda iş dünyası haqqında güncəl məlumatlar.',
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
                description: news.description || news.title,
                ogTitle: news.title,
                ogDescription: news.description || news.title,
                ogImage: news.imageUrl || undefined,
                ogType: 'article',
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
            description: 'Jobing.az - Azərbaycanın ən böyük iş axtarış platforması. Missiyamız iş axtaranlar və işəgötürənləri bir araya gətirməkdir.',
            body: "AboutUs/Index.ejs",
            js: null,
            currentPage: 'about'
        };
        res.render('Main', view);
    },
    faq: async (req, res) => {
        const view = {
            title: 'Tez-tez verilən suallar',
            description: 'İş axtarışı, CV yaratma, elan yerləşdirmə və digər mövzularda ən çox verilən suallar.',
            body: "AboutUs/Faq.ejs",
            js: null,
            currentPage: 'faq'
        };
        res.render('Main', view);
    },
    contactUs: async (req, res) => {
        const view = {
            title: 'Bizimlə Əlaqə',
            description: 'Jobing.az ilə əlaqə saxlayın. Suallarınız, təklif və rəyləriniz üçün bizə yazın.',
            body: "ContactUs/Index.ejs",
            js: 'ContactUs.js',
            currentPage: 'contact'
        };
        res.render('Main', view);
    },
    addJob: async (req, res) => {
        let companyInfo = null;
        if (req.user?.role === 'company' && req.user?.companyName) {
            try {
                companyInfo = await Company.findOne({ companyName: req.user.companyName })
                    .select('companyName email phone')
                    .lean();
            } catch (e) { /* silent */ }
        }
        const view = {
            title: 'Yeni vakansiya',
            description: 'Şirkətiniz üçün yeni vakansiya elanı yerləşdirin. İş axtaran ən uyğun namizədlərə çatın.',
            body: "Jobs/Add.ejs",
            js: 'NewJob.js',
            currentPage: 'add-job',
            companyInfo
        };
        res.render('Main', view);
    },

    // Job Seeker pages
    jobSeekers: async (req, res) => {
        const view = {
            title: 'İş Axtaranlar',
            description: 'İş axtaran namizədlər. Kimlər iş axtarır? Profillərə baxın, əlaqə qurun.',
            body: "JobSeeker/Index.ejs",
            js: "JobSeekers.js",
            currentPage: 'job-seekers'
        };
        res.render('Main', view);
    },

    addJobSeeker: async (req, res) => {
        const cvs = await CVService.findByUser(req.user._id, false);
        const view = {
            title: 'Mən İş Axtarıram',
            description: 'Özünüz haqqında məlumatları paylaşın, işəgötürənlər sizi tapsın.',
            body: "JobSeeker/Add.ejs",
            js: "NewJobSeeker.js",
            currentPage: 'add-job-seeker',
            cvs
        };
        res.render('Main', view);
    },

    // Dashboard - User
    userDashboard: async (req, res) => {
        const cvs = await CVService.findByUser(req.user._id, false);
        const jobSeekerAds = await JobSeekerService.findByUser(req.user._id);
        const view = {
            title: 'Mənim Panelim',
            description: 'CV-lərinizi idarə edin, müraciətlərinizi izləyin.',
            body: "Dashboard/Index.ejs",
            js: "Dashboard.js",
            currentPage: 'dashboard',
            cvs,
            jobSeekerAds,
            msg: req.query.msg || null
        };
        res.render('Main', view);
    },

    // Dashboard - Company
    companyDashboard: async (req, res) => {
        const company = await Company.findOne({ companyName: req.user.companyName }).lean();
        const jobs = await JobDataService.findByCompany(req.user.companyName, company?._id);
        const view = {
            title: 'Şirkət Paneli',
            description: 'Vakansiyalarınızı idarə edin, müraciətlərə baxın.',
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
            description: 'Şirkət məlumatlarınızı redaktə edin və profilinizi yeniləyin.',
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
            description: 'Peşəkar CV-nizi yaradın və işəgötürənlərə nümayiş etdirin.',
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
            description: 'Mövcud CV-nizi yükləyin və işəgötürənlərlə paylaşın.',
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
                description: 'CV-nizi redaktə edin və yeniləyin.',
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
            description: 'İş axtaranların peşəkar CV-ləri. Namizədlərin təcrübə və bacarıqlarını kəşf edin.',
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
            description: 'Namizədin CV profili, təcrübə və bacarıqları.',
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
            description: 'Azərbaycanda fəaliyyət göstərən şirkətlər və onların vakansiyaları.',
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
            description: 'Şirkət profili və aktiv vakansiyaları.',
            body: "Company/Detail.ejs",
            js: "Company.js",
            currentPage: 'company-detail'
        };
        res.render('Main', view);
    },

    // ============================================
    // PRICING PAGE
    // ============================================
    pricing: async (req, res) => {
        try {
            const plans = await PricingPlan.find({ isActive: true }).sort({ type: 1, price: 1 }).lean();
            const allPromote = plans.filter(p => p.type === 'promote');
            const allPremium = plans.filter(p => p.type === 'premium');
            const promoteDaily = allPromote.filter(p => p.duration === 'daily');
            const promoteMonthly = allPromote.filter(p => p.duration === 'monthly');
            const premiumDaily = allPremium.filter(p => p.duration === 'daily');
            const premiumMonthly = allPremium.filter(p => p.duration === 'monthly');

            const view = {
                title: 'Qiymətlər',
                description: 'Jobing.az premium və irəli çəkmə planları. Vakansiyanızı önə çıxarın və daha çox namizədə çatdırın.',
                body: "Pricing/Index.ejs",
                js: null,
                currentPage: 'pricing',
                promoteDaily,
                promoteMonthly,
                premiumDaily,
                premiumMonthly,
                hasDaily: promoteDaily.length > 0 || premiumDaily.length > 0,
                hasMonthly: promoteMonthly.length > 0 || premiumMonthly.length > 0,
                plans
            };
            res.render('Main', view);
        } catch (error) {
            console.error('pricing page error:', error.message);
            res.status(500).render('Partials/Error.ejs');
        }
    },

    // ============================================
    // SEO: Sitemap
    // ============================================
    sitemap: async (req, res) => {
        try {
            const baseUrl = 'https://jobing.az';
            const today = new Date().toISOString().split('T')[0];

            // Static pages
            const staticPages = [
                { loc: '/', priority: '1.00', changefreq: 'daily' },
                { loc: '/vakansiyalar', priority: '0.90', changefreq: 'hourly' },
                { loc: '/sirketler', priority: '0.80', changefreq: 'daily' },
                { loc: '/cv-ler', priority: '0.70', changefreq: 'daily' },
                { loc: '/qiymetler', priority: '0.70', changefreq: 'weekly' },
                { loc: '/blogs', priority: '0.70', changefreq: 'weekly' },
                { loc: '/xeberler', priority: '0.70', changefreq: 'daily' },
                { loc: '/about-us', priority: '0.50', changefreq: 'monthly' },
                { loc: '/contact', priority: '0.50', changefreq: 'monthly' },
                { loc: '/faq', priority: '0.50', changefreq: 'monthly' },
            ];

            // Fetch active jobs for dynamic URLs
            const jobs = await JobData.find({ isActive: true })
                .select('slug updatedAt')
                .sort({ updatedAt: -1 })
                .limit(50000)
                .lean();

            const jobUrls = jobs.filter(j => j.slug).map(j => ({
                loc: `/vakansiyalar/${j.slug}/details`,
                priority: '0.80',
                changefreq: 'daily',
                lastmod: j.updatedAt ? new Date(j.updatedAt).toISOString().split('T')[0] : today
            }));

            // Fetch blogs
            const blogs = await Blog.find({ isActive: true })
                .select('slug updatedAt')
                .sort({ updatedAt: -1 })
                .lean();

            const blogUrls = blogs.filter(b => b.slug).map(b => ({
                loc: `/blogs/${b.slug}`,
                priority: '0.60',
                changefreq: 'weekly',
                lastmod: b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : today
            }));

            const allUrls = [...staticPages, ...jobUrls, ...blogUrls];

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
            allUrls.forEach(u => {
                xml += '  <url>\n';
                xml += `    <loc>${baseUrl}${u.loc}</loc>\n`;
                if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
                xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
                xml += `    <priority>${u.priority}</priority>\n`;
                xml += '  </url>\n';
            });
            xml += '</urlset>';

            res.header('Content-Type', 'application/xml');
            res.send(xml);
        } catch (error) {
            console.error('Sitemap error:', error.message);
            res.status(500).send('Sitemap generation failed');
        }
    },

    // ============================================
    // SEO: Robots.txt
    // ============================================
    robots: async (req, res) => {
        res.type('text/plain');
        res.send(`User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /company/*
Disallow: /hr/*
Disallow: /admin/*
Disallow: /cv/create
Disallow: /cv/upload
Disallow: /cv/edit/*
Disallow: /add-job

Sitemap: https://jobing.az/sitemap.xml
`);
    },

    statistics: async (req, res) => {
        const company = await CompanyService.count();
        const vacancy = await JobDataService.count();
        const visitor = await VisitorService.count(30);
        const dailyVisitor = await VisitorService.dailyCount();
        const totalVisitor = await VisitorService.count(365);
        res.status(200).json({status: 200, message: "", data: {company, vacancy, visitor, dailyVisitor, totalVisitor}});
    },

    // ============================================================
    // USER PROFILE SETTINGS
    // ============================================================
    userSettings: async (req, res) => {
        let cities = [];
        try { cities = await CityService.getAll({ site: 'BossAz' }); } catch (e) { console.error('userSettings cities error:', e.message); }
        const view = {
            title: 'Profil Ayarları',
            description: 'Şəxsi məlumatlarınızı yeniləyin.',
            body: "Profile/Settings.ejs",
            js: null,
            currentPage: 'settings',
            cities
        };
        res.render('Main', view);
    },
};

export default ViewController;
