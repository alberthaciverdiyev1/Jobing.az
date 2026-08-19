import CompanyRepository from '../Repositories/CompanyRepository.js';
import VacancyRepository from '../../Vacancy/Repositories/VacancyRepository.js';
import ICompanyService from '../Interfaces/ICompanyService.js';

class CompanyService extends ICompanyService {
    async getCompaniesListViewModel(query) {
        const limit = parseInt(query.limit, 10) || 12;
        const offset = parseInt(query.offset, 10) || 0;
        const search = query.search || '';

        // Simplistic approach for now since direct association might need tweak
        const { count, rows } = await CompanyRepository.model.findAndCountAll({
            where: search ? { companyName: { [import('sequelize').Op.iLike]: `%${search}%` } } : {},
            limit, offset
        });

        return {
            title: 'Şirkətlər | Jobing.az',
            description: 'İşəgötürən şirkətlər',
            currentPage: 'companies',
            companies: rows,
            totalCount: count,
            hideLoadMore: (limit + offset >= count),
            body: "Company/List.ejs",
            js: "CompanyList.js"
        };
    }

    async getCompanyDetailsViewModel(id) {
        const company = await CompanyRepository.findById(id);
        if (!company) throw new Error('Şirkət tapılmadı');

        const jobs = await VacancyRepository.model.findAll({
            where: { companyName: company.companyName, isActive: true },
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        return {
            title: `${company.companyName} | Jobing.az`,
            description: `${company.companyName} şirkətinin iş elanları`,
            ogTitle: company.companyName,
            ogImage: company.imageUrl,
            ogType: 'website',
            body: "Company/Details.ejs",
            data: company,
            jobs,
            js: null,
            currentPage: 'companies'
        };
    }

    async updateProfile(companyId, data) {
        const company = await CompanyRepository.update(companyId, data);
        if (!company) throw new Error('Şirkət tapılmadı');
        return company;
    }
}
export default new CompanyService();
