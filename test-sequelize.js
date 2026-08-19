import { connectPromise } from './src/Config/Database.js';
import './src/Modules/Filters/Entities/Filter.js';
import './src/Modules/Filters/Entities/FilterOption.js';
import './src/Modules/Auth/Entities/User.js';
import './src/Modules/Company/Entities/Company.js';
import './src/Modules/Vacancy/Entities/Vacancy.js';
import './src/Modules/CV/Entities/CV.js';
import './src/Modules/CV/Entities/JobSeeker.js';
import './src/Modules/Content/Entities/Blog.js';
import './src/Modules/Content/Entities/News.js';
import './src/Modules/Vacancy/Entities/Application.js';
import './src/Modules/Vacancy/Entities/PricingPlan.js';
import './src/Modules/Vacancy/Entities/PromotionRequest.js';
import './src/Modules/System/Entities/Log.js';
import './src/Modules/System/Entities/RssSource.js';
import './src/Modules/System/Entities/Seo.js';
import './src/Modules/System/Entities/Site.js';
import './src/Modules/System/Entities/Visitor.js';
import setupAssociations from './src/Config/Associations.js';

async function test() {
    setupAssociations();
    await connectPromise;
    console.log("Sequelize connection successful and ALL models synced.");
    process.exit(0);
}
test();
