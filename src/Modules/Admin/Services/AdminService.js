import VacancyRepository from '../../Vacancy/Repositories/VacancyRepository.js';
import UserRepository from '../../Auth/Repositories/UserRepository.js';
import CompanyRepository from '../../Company/Repositories/CompanyRepository.js';
import JobSeekerRepository from '../../CV/Repositories/JobSeekerRepository.js';
import CVRepository from '../../CV/Repositories/CVRepository.js';
import BlogRepository from '../../Content/Repositories/BlogRepository.js';
import NewsRepository from '../../Content/Repositories/NewsRepository.js';
import PricingPlanRepository from '../../Vacancy/Repositories/PricingPlanRepository.js';
import Visitor from '../../System/Entities/Visitor.js';
import Site from '../../System/Entities/Site.js';
import FilterRepository from '../../Filters/Repositories/FilterRepository.js';
import FilterOption from '../../Filters/Entities/FilterOption.js';

class AdminService {
    async getDashboardViewModel() {
        const totalUsers = await UserRepository.model.count();
        const totalJobs = await VacancyRepository.model.count();
        const totalCompanies = await CompanyRepository.model.count();
        const totalCvs = await CVRepository.model.count();
        const totalBlogs = await BlogRepository.model.count();
        const totalNews = await NewsRepository.model.count();
        const totalVisitors = await Visitor.count();
        const totalSites = await Site.count();

        const recentJobs = await VacancyRepository.model.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        return {
            title: 'Admin Dashboard',
            body: 'Home/Index.ejs',
            currentPage: 'admin-dashboard',
            stats: { totalUsers, totalJobs, totalCompanies, totalCvs, totalBlogs, totalNews, totalVisitors, totalSites },
            recentJobs
        };
    }

    async getUsersViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await UserRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'İstifadəçilər', body: 'User/Index.ejs', currentPage: 'admin-users',
            users: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getCompaniesViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await CompanyRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Şirkətlər', body: 'Company/Index.ejs', currentPage: 'admin-companies',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getVacanciesViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await VacancyRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Vakansiyalar', body: 'Job/Index.ejs', currentPage: 'admin-jobs',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getBlogsViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await BlogRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Bloglar', body: 'Blog/Index.ejs', currentPage: 'admin-blogs',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getNewsViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await NewsRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Xəbərlər', body: 'News/Index.ejs', currentPage: 'admin-news',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getJobSeekersViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await JobSeekerRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'İş Axtaranlar', body: 'JobSeeker/Index.ejs', currentPage: 'admin-jobseekers',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getPricingViewModel() {
        const plans = await PricingPlanRepository.model.findAll();
        return {
            title: 'Qiymətlər', body: 'Pricing/Index.ejs', currentPage: 'admin-pricing',
            data: plans
        };
    }

    async getFiltersViewModel() {
        const filters = await FilterRepository.findAll({
            include: [{ model: FilterOption, as: 'options', required: false }],
            order: [
                ['sortOrder', 'ASC'],
                [{ model: FilterOption, as: 'options' }, 'sortOrder', 'ASC']
            ]
        });
        return {
            title: 'Filtrelər',
            body: 'Filter/Index.ejs',
            js: 'Filter.js',
            currentPage: 'admin-filters',
            filters
        };
    }

    // Generic placeholders for others
    async getGenericViewModel(title, bodyPath, currentPage) {
        return { title, body: bodyPath, currentPage, data: [], page: 1, totalPages: 1 };
    }
}
export default new AdminService();
