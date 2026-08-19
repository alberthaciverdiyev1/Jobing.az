import VacancyRepository from '../../Vacancy/Repositories/VacancyRepository.js';
import UserRepository from '../../Auth/Repositories/UserRepository.js';
import CompanyRepository from '../../Company/Repositories/CompanyRepository.js';

class AdminService {
    async getDashboardViewModel() {
        const totalUsers = await UserRepository.model.count();
        const totalVacancies = await VacancyRepository.model.count();
        const totalCompanies = await CompanyRepository.model.count();

        return {
            title: 'Admin Dashboard',
            body: 'Admin/Dashboard.ejs',
            currentPage: 'admin-dashboard',
            stats: { totalUsers, totalVacancies, totalCompanies }
        };
    }

    async getUsersViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await UserRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        
        return {
            title: 'İstifadəçilər',
            body: 'Admin/Users.ejs',
            currentPage: 'admin-users',
            users: rows,
            totalPages: Math.ceil(count / limit),
            page
        };
    }

    async getVacanciesViewModel(page = 1) {
        const limit = 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await VacancyRepository.model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });

        return {
            title: 'Vakansiyalar (Admin)',
            body: 'Admin/Vacancies.ejs',
            currentPage: 'admin-vacancies',
            vacancies: rows,
            totalPages: Math.ceil(count / limit),
            page
        };
    }
}
export default new AdminService();
