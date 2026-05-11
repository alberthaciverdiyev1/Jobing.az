import NewsService from '../Services/NewsService.js';

const NewsController = {
    /** Public: list news with pagination */
    publicList: async (req, res) => {
        try {
            const { category, page = 1, limit = 12 } = req.query;
            const result = await NewsService.getAll({ category, page: Number(page), limit: Number(limit) });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /** Public: single news detail */
    publicDetail: async (req, res) => {
        try {
            const news = await NewsService.details(req.params.slug);
            const mostRead = await NewsService.getMostRead();
            const similar = await NewsService.getSimilar(news.category, req.params.slug);
            res.json({ news, mostRead, similar });
        } catch (error) {
            const status = error.message === 'News not found' ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    },

    /** Public: get all categories */
    getCategories: async (req, res) => {
        try {
            const categories = await NewsService.getCategories();
            res.json({ categories });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /** Public: most read news */
    getMostRead: async (req, res) => {
        try {
            const mostRead = await NewsService.getMostRead();
            res.json({ mostRead });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default NewsController;
