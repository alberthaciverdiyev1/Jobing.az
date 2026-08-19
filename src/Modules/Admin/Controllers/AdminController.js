import AdminService from '../Services/AdminService.js';

const renderAdmin = async (req, res, next, serviceMethod, ...args) => {
    try {
        const viewModel = await AdminService[serviceMethod](...args);
        // Admin/Main.ejs and Admin/Partials/Js.ejs expect a `js` variable
        res.render('Admin/Main.ejs', { js: null, ...viewModel });
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

    // Unified Filters page — manages categories, cities, education, experience, etc.
    filtersList: (req, res, next) => renderAdmin(req, res, next, 'getFiltersViewModel'),

    // Placeholders for the rest to avoid 404s
    rssList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'RSS', 'RssSource/Index.ejs', 'admin-rss'),
    cvsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'CVlər', 'Cv/Index.ejs', 'admin-cvs'),
    visitorsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Ziyarətçilər', 'Visitor/Index.ejs', 'admin-visitors'),
    logsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Loglar', 'Log/Index.ejs', 'admin-logs'),
    settingsList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'Ayarlar', 'Settings/Index.ejs', 'admin-settings'),
    seoList: (req, res, next) => renderAdmin(req, res, next, 'getGenericViewModel', 'SEO', 'Seo/Index.ejs', 'admin-seo'),
};

export default AdminController;
