import AdminService from '../Services/AdminService.js';

const AdminController = {
    dashboard: async (req, res, next) => {
        try {
            const viewModel = await AdminService.getDashboardViewModel();
            res.render('AdminLayout', viewModel);
        } catch (error) {
            next(error);
        }
    },

    usersList: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const viewModel = await AdminService.getUsersViewModel(page);
            res.render('AdminLayout', viewModel);
        } catch (error) {
            next(error);
        }
    },

    vacanciesList: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const viewModel = await AdminService.getVacanciesViewModel(page);
            res.render('AdminLayout', viewModel);
        } catch (error) {
            next(error);
        }
    }
};

export default AdminController;
