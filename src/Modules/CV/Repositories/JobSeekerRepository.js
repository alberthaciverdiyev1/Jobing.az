import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import IJobSeekerRepository from '../Interfaces/IJobSeekerRepository.js';
import JobSeeker from '../Entities/JobSeeker.js';
import { Op } from 'sequelize';

class JobSeekerRepository extends BaseRepository {
    constructor() {
        super(JobSeeker);
    }
    
    async findActiveJobSeekers(limit, offset, search) {
        const where = { isActive: true };
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { userName: { [Op.iLike]: `%${search}%` } }
            ];
        }
        return await this.model.findAndCountAll({
            where, limit, offset, order: [['createdAt', 'DESC']],
            include: ['filterOptions'] // Load dynamic filters
        });
    }

    async findBySlugOrId(idOrSlug) {
        const query = isNaN(idOrSlug) ? { slug: idOrSlug } : { id: parseInt(idOrSlug) };
        return await this.model.findOne({
            where: query,
            include: ['filterOptions', 'poster']
        });
    }

    async findByUser(userId) {
        return await this.model.findAll({
            where: { postedBy: userId },
            order: [['createdAt', 'DESC']]
        });
    }
}
export default new JobSeekerRepository();
