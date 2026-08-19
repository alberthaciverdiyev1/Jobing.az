import IRepository from '../Interfaces/IRepository.js';

export default class BaseRepository extends IRepository {
    constructor(model) {
        super();
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async findOne(options = {}) {
        return await this.model.findOne(options);
    }

    async create(data, options = {}) {
        return await this.model.create(data, options);
    }

    async update(id, data, options = {}) {
        const record = await this.model.findByPk(id);
        if (!record) return null;
        return await record.update(data, options);
    }

    async delete(id, options = {}) {
        const record = await this.model.findByPk(id);
        if (!record) return false;
        await record.destroy(options);
        return true;
    }
}
