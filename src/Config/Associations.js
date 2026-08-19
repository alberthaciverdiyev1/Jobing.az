import User from '../Modules/Auth/Entities/User.js';
import Company from '../Modules/Company/Entities/Company.js';
import Vacancy from '../Modules/Vacancy/Entities/Vacancy.js';
import CV from '../Modules/CV/Entities/CV.js';
import JobSeeker from '../Modules/CV/Entities/JobSeeker.js';
import FilterOption from '../Modules/Filters/Entities/FilterOption.js';
import Blog from '../Modules/Content/Entities/Blog.js';
import News from '../Modules/Content/Entities/News.js';
import Application from '../Modules/Vacancy/Entities/Application.js';
import PricingPlan from '../Modules/Vacancy/Entities/PricingPlan.js';
import PromotionRequest from '../Modules/Vacancy/Entities/PromotionRequest.js';

User.belongsToMany(Company, { through: 'user_companies', foreignKey: 'userId', otherKey: 'companyId', as: 'companies' });
Company.belongsToMany(User, { through: 'user_companies', foreignKey: 'companyId', otherKey: 'userId', as: 'users' });


User.hasMany(CV, { foreignKey: 'userId', as: 'cvs' });
CV.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(JobSeeker, { foreignKey: 'postedBy', as: 'jobSeekerPosts' });
JobSeeker.belongsTo(User, { foreignKey: 'postedBy', as: 'poster' });

Vacancy.belongsToMany(FilterOption, { through: 'vacancy_filter_options', foreignKey: 'vacancyId', otherKey: 'filterOptionId', as: 'filterOptions' });
FilterOption.belongsToMany(Vacancy, { through: 'vacancy_filter_options', foreignKey: 'filterOptionId', otherKey: 'vacancyId', as: 'vacancies' });

JobSeeker.belongsToMany(FilterOption, { through: 'jobseeker_filter_options', foreignKey: 'jobSeekerId', otherKey: 'filterOptionId', as: 'filterOptions' });
FilterOption.belongsToMany(JobSeeker, { through: 'jobseeker_filter_options', foreignKey: 'filterOptionId', otherKey: 'jobSeekerId', as: 'jobSeekers' });

Vacancy.hasMany(Application, { foreignKey: 'vacancyId', as: 'applications' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CV.hasMany(Application, { foreignKey: 'cvId', as: 'applications' });
Application.belongsTo(CV, { foreignKey: 'cvId', as: 'cv' });

PricingPlan.hasMany(PromotionRequest, { foreignKey: 'planId', as: 'promotionRequests' });
PromotionRequest.belongsTo(PricingPlan, { foreignKey: 'planId', as: 'plan' });

Vacancy.hasMany(PromotionRequest, { foreignKey: 'vacancyId', as: 'promotionRequests' });
PromotionRequest.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

User.hasMany(PromotionRequest, { foreignKey: 'userId', as: 'promotionRequests' });
PromotionRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(News, { foreignKey: 'authorId', as: 'news' });
News.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Blog.belongsToMany(FilterOption, { through: 'blog_filter_options', foreignKey: 'blogId', otherKey: 'filterOptionId', as: 'filterOptions' });
FilterOption.belongsToMany(Blog, { through: 'blog_filter_options', foreignKey: 'filterOptionId', otherKey: 'blogId', as: 'blogs' });

export default function setupAssociations() {
    console.log("Database associations setup complete.");
}
