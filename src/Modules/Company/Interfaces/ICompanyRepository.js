import IRepository from '../../../Core/Interfaces/IRepository.js';
export default class ICompanyRepository extends IRepository {
    async findByCompanyName(name) { throw new Error("Not implemented"); }
    async findCompaniesWithVacancies(limit, offset, search) { throw new Error("Not implemented"); }
}
