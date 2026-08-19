import VacancyRepository from '../Repositories/VacancyRepository.js';
import IVacancyService from '../Interfaces/IVacancyService.js';
import CompanyRepository from '../../Company/Repositories/CompanyRepository.js';
import slugify from 'slugify';
import sendEmail from '../../../Helpers/NodeMailer.js';
import { sendNewJobRequest } from '../../../Helpers/TelegramBot.js';
import sequelize from '../../../Config/Database.js'; // Added for transactions

class VacancyService extends IVacancyService {
    
    async getListViewModel(query) {
        const limit = parseInt(query.limit, 10) || 20;
        const offset = parseInt(query.offset, 10) || 0;
        const search = query.search || '';

        const { count, rows } = await VacancyRepository.findActiveVacancies(limit, offset, search);

        return {
            title: 'Vakansiyalar | Jobing.az',
            description: 'Ən son vakansiyalar',
            currentPage: 'vacancies',
            jobs: rows,
            totalCount: count,
            hideLoadMore: (limit + offset >= count),
            body: "Jobs/List.ejs",
            js: "List.js"
        };
    }

    async getDetailsViewModel(idOrSlug, locale = 'az') {
        const vacancy = await VacancyRepository.findBySlugOrId(idOrSlug);
        if (!vacancy) throw new Error('Vacancy not found');

        vacancy.viewCount += 1;
        vacancy.save().catch(() => {});

        const categoryFilter = vacancy.filterOptions?.find(f => f.Filter?.key === 'category');
        const cityFilter = vacancy.filterOptions?.find(f => f.Filter?.key === 'city');
        const educationFilter = vacancy.filterOptions?.find(f => f.Filter?.key === 'education');
        const experienceFilter = vacancy.filterOptions?.find(f => f.Filter?.key === 'experience');

        vacancy.categoryName = categoryFilter ? categoryFilter.name[locale] : null;
        vacancy.location = cityFilter ? cityFilter.name[locale] : vacancy.location;
        vacancy.education = educationFilter ? educationFilter.name[locale] : null;
        vacancy.experience = experienceFilter ? experienceFilter.name[locale] : null;

        const plainDescription = vacancy.description
            ? vacancy.description.replace(/<[^>]*>/g, '').trim().slice(0, 300)
            : null;

        return {
            title: vacancy.title,
            description: `${vacancy.title} — ${vacancy.companyName}. ${vacancy.location || ''}. Maaş: ${vacancy.minSalary || ''}${vacancy.minSalary && vacancy.maxSalary ? ' - ' : ''}${vacancy.maxSalary || ''} AZN. ${plainDescription || ''}`,
            ogTitle: `${vacancy.title} — ${vacancy.companyName}`,
            ogDescription: `${vacancy.title} vakansiyası. ${vacancy.companyName} şirkəti işçi axtarır.`,
            ogType: 'article',
            body: "Jobs/Details.ejs",
            data: vacancy,
            js: 'Details.js',
            currentPage: 'jobs'
        };
    }

    async createVacancy(data, userId) {
        const t = await sequelize.transaction();
        
        try {
            let companyId = null;
            if (data.companyName) {
                const company = await CompanyRepository.findOne({ where: { companyName: data.companyName }, transaction: t });
                if (company) {
                    companyId = company.id;
                } else {
                    const newComp = await CompanyRepository.model.create({ companyName: data.companyName }, { transaction: t });
                    companyId = newComp.id;
                }
            }

            const vacancy = await VacancyRepository.model.create({
                title: data.title,
                description: data.description,
                email: data.email,
                phone: data.phone,
                location: data.location,
                minSalary: data.minSalary,
                maxSalary: data.maxSalary,
                minAge: data.minAge,
                maxAge: data.maxAge,
                companyName: data.companyName,
                companyId: companyId,
                userName: data.username,
                applicationMethod: data.applicationMethod || 'both',
                postedBy: userId,
                isActive: false
            }, { transaction: t });

            vacancy.slug = `${slugify(vacancy.title || 'vacancy', { lower: true, strict: true, locale: 'tr' })}-${vacancy.id}`;
            await vacancy.save({ transaction: t });

            if (data.filterOptionIds && Array.isArray(data.filterOptionIds)) {
                await vacancy.setFilterOptions(data.filterOptionIds, { transaction: t });
            }

            await t.commit(); // Transaction successful!

            sendEmail({
                title: "Jobing.az",
                text: "Sizin vakansiyanız yoxlaniş üçün Jobing.az komandasına göndərildi."
            }, data.email, "support - Jobing.az").catch(() => {});

            sendNewJobRequest({
                ...data,
                id: vacancy.id,
                slug: vacancy.slug,
                redirectUrl: `/vakansiyalar/${vacancy.slug}/details`
            }).catch(() => {});

            return vacancy;
        } catch (error) {
            await t.rollback(); // Rollback if any step fails
            throw error;
        }
    }

    async deleteVacancy(id) {
        const success = await VacancyRepository.delete(id);
        if (!success) throw new Error('Vacancy not found');
        return true;
    }
}

export default new VacancyService();
