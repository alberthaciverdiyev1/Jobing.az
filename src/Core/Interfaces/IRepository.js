export default class IRepository {
    async findAll(options) { throw new Error("Method 'findAll()' must be implemented."); }
    async findById(id, options) { throw new Error("Method 'findById()' must be implemented."); }
    async findOne(options) { throw new Error("Method 'findOne()' must be implemented."); }
    async create(data, options) { throw new Error("Method 'create()' must be implemented."); }
    async update(id, data, options) { throw new Error("Method 'update()' must be implemented."); }
    async delete(id, options) { throw new Error("Method 'delete()' must be implemented."); }
}
