import ContentService from '../Services/ContentService.js';

const ContentController = {
    // GET /bloq
    blogList: async (req, res, next) => {
        try {
            const viewModel = await ContentService.getBlogListViewModel(req.query);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // GET /bloq/:id/details
    blogDetails: async (req, res, next) => {
        try {
            const viewModel = await ContentService.getBlogDetailsViewModel(req.params.id);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // GET /xeberler
    newsList: async (req, res, next) => {
        try {
            const viewModel = await ContentService.getNewsListViewModel(req.query);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // GET /xeberler/:id/details
    newsDetails: async (req, res, next) => {
        try {
            const viewModel = await ContentService.getNewsDetailsViewModel(req.params.id);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    }
};

export default ContentController;
