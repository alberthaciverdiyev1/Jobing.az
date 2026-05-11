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
            const news = await News.findOne({ slug, isActive: true });
            if (!news) throw new Error('News not found');

            // Increment view count
            news.views = (news.views || 0) + 1;
            await news.save();

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
