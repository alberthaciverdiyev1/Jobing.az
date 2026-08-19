import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import INewsRepository from '../Interfaces/INewsRepository.js';
import News from '../Entities/News.js';

class NewsRepository extends BaseRepository {
    constructor() {
        super(News);
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
Object.setPrototypeOf(NewsRepository.prototype, INewsRepository.prototype);
export default new NewsRepository();
