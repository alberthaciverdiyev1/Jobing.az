import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import Filter from '../Entities/Filter.js';
import FilterOption from '../Entities/FilterOption.js';

class FilterRepository extends BaseRepository {
    constructor() {
        super(Filter);
    }

    async getFiltersWithOptions() {
        return await this.model.findAll({
            include: [{ model: FilterOption, as: 'options', where: { isActive: true }, required: false }],
            order: [
                ['sortOrder', 'ASC'],
                [{ model: FilterOption, as: 'options' }, 'sortOrder', 'ASC']
            ]
        });
    }
}

export default new FilterRepository();
