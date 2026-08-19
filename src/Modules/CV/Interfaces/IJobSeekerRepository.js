import IRepository from '../../../Core/Interfaces/IRepository.js';
export default class IJobSeekerRepository extends IRepository {
    async findActiveJobSeekers(limit, offset, search) { throw new Error("Method not implemented."); }
    async findBySlugOrId(idOrSlug) { throw new Error("Method not implemented."); }
    async findByUser(userId) { throw new Error("Method not implemented."); }
}
