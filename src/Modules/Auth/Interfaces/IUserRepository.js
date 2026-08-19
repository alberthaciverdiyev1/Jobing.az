import IRepository from '../../../Core/Interfaces/IRepository.js';

export default class IUserRepository extends IRepository {
    async findByEmail(email) { throw new Error("Method not implemented."); }
    async findActiveByEmail(email) { throw new Error("Method not implemented."); }
}
