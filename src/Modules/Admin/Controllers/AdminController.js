import AdminService from '../Services/AdminService.js';

const renderAdmin = async (req, res, next, serviceMethod, ...args) => {
    try {
        const viewModel = await AdminService[serviceMethod](...args);
        res.render('Admin/Main.ejs', viewModel);
    } catch (error) {
        next(error);
    }
};

const AdminController = {
    dashboard: (req, res, next) => renderAdmin(req, res, next, 'getDashboardViewModel'),
    usersList: (req, res, next) => renderAdmin(req, res, next, 'getUsersViewModel', parseInt(req.query.page) || 1),
    companiesList: (req, res, next) => renderAdmin(req, res, next, 'getCompaniesViewModel', parseInt(req.query.page) || 1),
    vacanciesList: (req, res, next) => renderAdmin(req, res, next, 'getVacanciesViewModel', parseInt(req.query.page) || 1),
    blogsList: (req, res, next) => renderAdmin(req, res, next, 'getBlogsViewModel', parseInt(req.query.page) || 1),
    newsList: (req, res, next) => renderAdmin(req, res, next, 'getNewsViewModel', parseInt(req.query.page) || 1),
    jobSeekersList: (req, res, next) => renderAdmin(req, res, next, 'getJobSeekersViewModel', parseInt(req.query.page) || 1),
    pricingList: (req, res, next) => renderAdmin(req, res, next, 'getPricingViewModel'),

    // Placeholders for the rest to avoid 404s
    categoriesList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Kategoriyalar', 'Admin/Category/Index.ejs', 'admin-categories'),
    citiesList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Şəhərlər', 'Admin/City/Index.ejs', 'admin-cities'),
    rssList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'RSS', 'Admin/RssSource/Index.ejs', 'admin-rss'),
    cvsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'CVlər', 'Admin/Cv/Index.ejs', 'admin-cvs'),
    visitorsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Ziyarətçilər', 'Admin/Visitor/Index.ejs', 'admin-visitors'),
    logsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Loglar', 'Admin/Log/Index.ejs', 'admin-logs'),
    settingsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Ayarlar', 'Admin/Settings/Index.ejs', 'admin-settings'),
    seoList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'SEO', 'Admin/Seo/Index.ejs', 'admin-seo'),
};

export default AdminController;
