import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import IBlogRepository from '../Interfaces/IBlogRepository.js';
import Blog from '../Entities/Blog.js';

class BlogRepository extends BaseRepository {
    constructor() {
        super(Blog);
    }
    
    async findPublished(limit, offset) {
        return await this.model.findAndCountAll({
            where: { isPublished: true },
            limit,
            offset,
            order: [['publishedAt', 'DESC']],
            include: ['author']
        });
    }

    async findBySlugOrId(idOrSlug) {
        const query = isNaN(idOrSlug) ? { slug: idOrSlug } : { id: parseInt(idOrSlug) };
        return await this.model.findOne({
            where: query,
            include: ['author']
        });
    }
}
export default new BlogRepository();
