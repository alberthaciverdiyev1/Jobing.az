import IRepository from '../../../Core/Interfaces/IRepository.js';
export default class INewsRepository extends IRepository {
    async findPublished(limit, offset) { throw new Error("Method not implemented."); }
    async findBySlugOrId(idOrSlug) { throw new Error("Method not implemented."); }
}
