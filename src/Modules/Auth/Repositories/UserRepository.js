import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import IUserRepository from '../Interfaces/IUserRepository.js';
import User from '../Entities/User.js';

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }
    
    async findByEmail(email) {
        return await this.model.findOne({ where: { email } });
    }

    async findActiveByEmail(email) {
        return await this.model.findOne({ where: { email, isActive: true } });
    }
}

export default new UserRepository();
