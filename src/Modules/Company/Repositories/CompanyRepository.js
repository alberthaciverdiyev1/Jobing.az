import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import ICompanyRepository from '../Interfaces/ICompanyRepository.js';
import Company from '../Entities/Company.js';
import Vacancy from '../../Vacancy/Entities/Vacancy.js';
import { Op } from 'sequelize';

class CompanyRepository extends BaseRepository {
    constructor() {
        super(Company);
    }
    
    async findByCompanyName(companyName) {
        return await this.model.findOne({ where: { companyName } });
    }

    async findCompaniesWithVacancies(limit, offset, search) {
        const where = {};
        if (search) {
            where.companyName = { [Op.iLike]: `%${search}%` };
        }
        
        return await this.model.findAndCountAll({
            where,
            limit,
            offset,
            order: [['companyName', 'ASC']],
            include: [{
                model: Vacancy,
                as: 'vacancies', // Note: Needs to match association alias if we define it, otherwise it's handled via User <-> Company
                required: false,
                where: { isActive: true }
            }]
        });
    }
}
Object.setPrototypeOf(CompanyRepository.prototype, ICompanyRepository.prototype);
export default new CompanyRepository();
