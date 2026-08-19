import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import FilterOption from '../Entities/FilterOption.js';

class FilterOptionRepository extends BaseRepository {
    constructor() {
        super(FilterOption);
    }
}

export default new FilterOptionRepository();
