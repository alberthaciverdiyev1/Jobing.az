import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import ICVRepository from '../Interfaces/ICVRepository.js';
import CV from '../Entities/CV.js';

class CVRepository extends BaseRepository {
    constructor() {
        super(CV);
    }
    
    async findByUserId(userId) {
        return await this.model.findAll({ where: { userId, isActive: true } });
    }
}
Object.setPrototypeOf(CVRepository.prototype, ICVRepository.prototype);
export default new CVRepository();
