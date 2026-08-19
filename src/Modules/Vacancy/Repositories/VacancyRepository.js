import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import IVacancyRepository from '../Interfaces/IVacancyRepository.js';
import Vacancy from '../Entities/Vacancy.js';
import { Op } from 'sequelize';

class VacancyRepository extends BaseRepository {
    constructor() {
        super(Vacancy);
    }

    async findActiveVacancies(limit, offset, search) {
        const where = { isActive: true };
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { companyName: { [Op.iLike]: `%${search}%` } }
            ];
        }

        return await this.model.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
    }

    async findBySlugOrId(idOrSlug) {
        const query = isNaN(idOrSlug) ? { slug: idOrSlug } : { id: parseInt(idOrSlug) };
        return await this.model.findOne({
            where: query,
            include: ['filterOptions', 'poster']
        });
    }

    async findByCompany(companyName, companyId) {
        const where = { isActive: true };
        if (companyName && companyId) {
            where[Op.or] = [{ companyName }, { companyId: companyId.toString() }];
        } else if (companyId) {
            where.companyId = companyId.toString();
        } else if (companyName) {
            where.companyName = companyName;
        } else {
            return [];
        }

        return await this.model.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: 50
        });
    }

    async getCountPastDays(days) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        
        return await this.model.count({
            where: { createdAt: { [Op.gte]: pastDate } }
        });
    }
}

export default new VacancyRepository();
