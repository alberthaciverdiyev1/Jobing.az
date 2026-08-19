import BaseRepository from '../../../Core/Repository/BaseRepository.js';
import PricingPlan from '../Entities/PricingPlan.js';

class PricingPlanRepository extends BaseRepository {
    constructor() {
        super(PricingPlan);
    }
}
export default new PricingPlanRepository();
