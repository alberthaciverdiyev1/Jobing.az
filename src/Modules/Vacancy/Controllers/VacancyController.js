import VacancyService from '../Services/VacancyService.js';

const vacancyController = {
    
    // Renders the list of active vacancies
    list: async (req, res, next) => {
        try {
            const viewModel = await VacancyService.getListViewModel(req.query);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // Renders the vacancy details page
    details: async (req, res, next) => {
        try {
            const locale = res.locals.locale || req.locale || 'az';
            const viewModel = await VacancyService.getDetailsViewModel(req.params.id, locale);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // Renders the Add Vacancy form page
    addPage: (req, res) => {
        res.render('Main', {
            title: 'Vakansiya Əlavə Et',
            body: 'Jobs/Add.ejs',
            js: 'AddJob.js',
            currentPage: 'add-job',
            // The form disables company fields when companyInfo is present
            companyInfo: null
        });
    },

    // Handles the form submission (POST)
    addPost: async (req, res, next) => {
        try {
            const userId = req.user ? req.user.id : null;
            await VacancyService.createVacancy(req.body, userId);
            // No API response! Just redirect to success page or home
            res.redirect('/vakansiyalar?success=true');
        } catch (error) {
            next(error);
        }
    },

    // Deletes vacancy and redirects
    deletePost: async (req, res, next) => {
        try {
            await VacancyService.deleteVacancy(req.params.id);
            res.redirect('/vakansiyalar');
        } catch (error) {
            next(error);
        }
    }
};

export default vacancyController;
