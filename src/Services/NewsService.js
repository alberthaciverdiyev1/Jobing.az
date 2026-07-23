import News from '../Models/News.js';

const NewsService = {
    /** Create a news article */
    create: async (data) => {
        try {
            const news = await News.create(data);
            return news;
        } catch (error) {
            throw new Error('Error creating news: ' + error.message);
        }
    },

    /** List all active news (paginated, filterable by category) */
    getAll: async ({ category, page = 1, limit = 12 } = {}) => {
        try {
            const query = { isActive: true };
            if (category) query.category = category;

            const total = await News.countDocuments(query);
            const news = await News.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('title slug imageUrl description category views createdAt')
                .lean();

            return { news, total, page: Number(page), totalPages: Math.ceil(total / limit) };
        } catch (error) {
            throw new Error('Error listing news: ' + error.message);
        }
    },

    /** Get a single news article by slug + increment views */
    details: async (slug) => {
        try {
            // Atomic increment — no need to fetch full doc, modify, then save
            const news = await News.findOneAndUpdate(
                { slug, isActive: true },
                { $inc: { views: 1 } },
                { new: true }
            ).lean();
            if (!news) throw new Error('News not found');

            return news;
        } catch (error) {
            throw new Error('Error fetching news: ' + error.message);
        }
    },

    /** Get most read news (top 10 by views) */
    getMostRead: async (limit = 10) => {
        try {
            return await News.find({ isActive: true })
                .sort({ views: -1 })
                .limit(limit)
                .select('title slug imageUrl description views createdAt')
                .lean();
        } catch (error) {
            throw new Error('Error fetching most read news: ' + error.message);
        }
    },

    /** Get similar news (same category, excluding current) */
    getSimilar: async (category, excludeSlug, limit = 4) => {
        try {
            if (!category) return [];
            return await News.find({
                isActive: true,
                category,
                slug: { $ne: excludeSlug }
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('title slug imageUrl description views createdAt')
                .lean();
        } catch (error) {
            throw new Error('Error fetching similar news: ' + error.message);
        }
    },

    /** Get all distinct categories */
    getCategories: async () => {
        try {
            return await News.distinct('category', { isActive: true });
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    },

    // ============================================================
    // ADMIN METHODS
    // ============================================================

    /** Admin: list all news (including inactive, paginated) */
    getAllAdmin: async ({ page = 1, limit = 20, search } = {}) => {
        try {
            const query = {};
            if (search) query.title = { $regex: search, $options: 'i' };

            const total = await News.countDocuments(query);
            const news = await News.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            return { news, total, page: Number(page), totalPages: Math.ceil(total / limit) };
        } catch (error) {
            throw new Error('Error listing news: ' + error.message);
        }
    },

    /** Admin: find by MongoDB ID */
    findById: async (id) => {
        try {
            const news = await News.findById(id);
            if (!news) throw new Error('News not found');
            return news;
        } catch (error) {
            throw new Error('Error fetching news: ' + error.message);
        }
    },

    /** Update news */
    update: async (id, data) => {
        try {
            const news = await News.findByIdAndUpdate(id, data, { new: true });
            if (!news) throw new Error('News not found');
            return news;
        } catch (error) {
            throw new Error('Error updating news: ' + error.message);
        }
    },

    /** Delete news */
    delete: async (id) => {
        try {
            const news = await News.findByIdAndDelete(id);
            if (!news) throw new Error('News not found');
            return { message: 'News deleted' };
        } catch (error) {
            throw new Error('Error deleting news: ' + error.message);
        }
    }
};

export default NewsService;
