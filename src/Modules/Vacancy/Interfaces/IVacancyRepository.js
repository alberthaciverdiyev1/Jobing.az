import IRepository from '../../../Core/Interfaces/IRepository.js';

export default class IVacancyRepository extends IRepository {
    async findActiveVacancies(limit, offset, search) { throw new Error("Method not implemented."); }
    async findBySlugOrId(idOrSlug) { throw new Error("Method not implemented."); }
    async findByCompany(companyName, companyId) { throw new Error("Method not implemented."); }
    async getCountPastDays(days) { throw new Error("Method not implemented."); }
}
