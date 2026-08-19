import BlogRepository from '../Repositories/BlogRepository.js';
import NewsRepository from '../Repositories/NewsRepository.js';
import IContentService from '../Interfaces/IContentService.js';

class ContentService extends IContentService {
    async getBlogListViewModel(query) {
        const limit = parseInt(query.limit, 10) || 12;
        const offset = parseInt(query.offset, 10) || 0;
        
        const { count, rows } = await BlogRepository.findPublished(limit, offset);
        
        return {
            title: 'Bloq | Jobing.az',
            description: 'Karyera məsləhətləri və bloq yazıları',
            currentPage: 'blog',
            blogs: rows,
            totalCount: count,
            hideLoadMore: (limit + offset >= count),
            body: "Blog/List.ejs",
            js: "Blog.js"
        };
    }

    async getBlogDetailsViewModel(idOrSlug) {
        const blog = await BlogRepository.findBySlugOrId(idOrSlug);
        if (!blog) throw new Error('Bloq tapılmadı');

        blog.viewCount += 1;
        blog.save().catch(() => {});

        return {
            title: blog.title,
            description: blog.excerpt || blog.title,
            ogTitle: blog.title,
            ogImage: blog.coverImage,
            ogType: 'article',
            body: "Blog/Details.ejs",
            data: blog,
            js: null,
            currentPage: 'blog'
        };
    }

    async getNewsListViewModel(query) {
        const limit = parseInt(query.limit, 10) || 12;
        const offset = parseInt(query.offset, 10) || 0;
        
        const { count, rows } = await NewsRepository.findPublished(limit, offset);
        
        return {
            title: 'Xəbərlər | Jobing.az',
            description: 'Ən son xəbərlər',
            currentPage: 'news',
            news: rows,
            totalCount: count,
            hideLoadMore: (limit + offset >= count),
            body: "News/List.ejs",
            js: "News.js"
        };
    }

    async getNewsDetailsViewModel(idOrSlug) {
        const newsItem = await NewsRepository.findBySlugOrId(idOrSlug);
        if (!newsItem) throw new Error('Xəbər tapılmadı');

        newsItem.viewCount += 1;
        newsItem.save().catch(() => {});

        return {
            title: newsItem.title,
            description: newsItem.excerpt || newsItem.title,
            ogTitle: newsItem.title,
            ogImage: newsItem.coverImage,
            ogType: 'article',
            body: "News/Detail.ejs",
            data: newsItem,
            js: null,
            currentPage: 'news'
        };
    }
}
export default new ContentService();
