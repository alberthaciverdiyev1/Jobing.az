import VacancyRepository from '../../Vacancy/Repositories/VacancyRepository.js';
import UserRepository from '../../Auth/Repositories/UserRepository.js';
import CompanyRepository from '../../Company/Repositories/CompanyRepository.js';
import JobSeekerRepository from '../../CV/Repositories/JobSeekerRepository.js';
import BlogRepository from '../../Content/Repositories/BlogRepository.js';
import NewsRepository from '../../Content/Repositories/NewsRepository.js';
import PricingPlanRepository from '../../Vacancy/Repositories/PricingPlanRepository.js';

class AdminService {
    async getDashboardViewModel() {
        const totalUsers = await UserRepository.model.count();
        const totalVacancies = await VacancyRepository.model.count();
        const totalCompanies = await CompanyRepository.model.count();

        return {
            title: 'Admin Dashboard',
            body: 'Admin/Home/Index.ejs',
            currentPage: 'admin-dashboard',
            stats: { totalUsers, totalVacancies, totalCompanies }
        };
    }

    async getUsersViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await UserRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'İstifadəçilər', body: 'Admin/User/Index.ejs', currentPage: 'admin-users',
            users: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getCompaniesViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await CompanyRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Şirkətlər', body: 'Admin/Company/Index.ejs', currentPage: 'admin-companies',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getVacanciesViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await VacancyRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Vakansiyalar', body: 'Admin/Job/Index.ejs', currentPage: 'admin-jobs',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getBlogsViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await BlogRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Bloglar', body: 'Admin/Blog/Index.ejs', currentPage: 'admin-blogs',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getNewsViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await NewsRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'Xəbərlər', body: 'Admin/News/Index.ejs', currentPage: 'admin-news',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getJobSeekersViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await JobSeekerRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return {
            title: 'İş Axtaranlar', body: 'Admin/JobSeeker/Index.ejs', currentPage: 'admin-jobseekers',
            data: rows, totalPages: Math.ceil(count / limit), page
        };
    }

    async getPricingViewModel() {
        const plans = await PricingPlanRepository.model.findAll();
        return {
            title: 'Qiymətlər', body: 'Admin/Pricing/Index.ejs', currentPage: 'admin-pricing',
            data: plans
        };
    }

    // Generic placeholders for others
    async getGenericViewModel(title, bodyPath, currentPage) {
        return { title, body: bodyPath, currentPage, data: [], page: 1, totalPages: 1 };
    }
}
export default new AdminService();
