import JobSeekerRepository from '../Repositories/JobSeekerRepository.js';
import CVRepository from '../Repositories/CVRepository.js';
import IJobSeekerService from '../Interfaces/IJobSeekerService.js';
import slugify from 'slugify';
import sendEmail from '../../../Helpers/NodeMailer.js';
import { sendNewJobSeekerRequest } from '../../../Helpers/TelegramBot.js';
import sequelize from '../../../Config/Database.js';

class JobSeekerService extends IJobSeekerService {
    async getListViewModel(query) {
        const limit = parseInt(query.limit, 10) || 20;
        const offset = parseInt(query.offset, 10) || 0;
        const search = query.search || '';

        const { count, rows } = await JobSeekerRepository.findActiveJobSeekers(limit, offset, search);

        return {
            title: 'İş Axtaranlar | Jobing.az',
            description: 'Ən son iş axtaranlar',
            currentPage: 'job-seekers',
            jobs: rows,
            totalCount: count,
            hideLoadMore: (limit + offset >= count),
            body: "JobSeeker/Index.ejs",
            js: "JobSeekerList.js"
        };
    }

    async getDetailsViewModel(idOrSlug, locale = 'az', viewer = null) {
        const doc = await JobSeekerRepository.findBySlugOrId(idOrSlug);
        if (!doc) throw new Error('Job seeker not found');

        doc.viewCount += 1;
        if (viewer) {
            let viewers = Array.isArray(doc.viewers) ? doc.viewers : [];
            viewers.push({ ...viewer, viewDate: new Date() });
            doc.viewers = viewers;
        }
        await doc.save().catch(() => {});

        const categoryFilter = doc.filterOptions?.find(f => f.Filter?.key === 'category');
        const cityFilter = doc.filterOptions?.find(f => f.Filter?.key === 'city');
        const educationFilter = doc.filterOptions?.find(f => f.Filter?.key === 'education');
        const experienceFilter = doc.filterOptions?.find(f => f.Filter?.key === 'experience');

        doc.categoryName = categoryFilter ? categoryFilter.name[locale] : null;
        doc.cityName = cityFilter ? cityFilter.name[locale] : null;
        doc.education = educationFilter ? educationFilter.name[locale] : null;
        doc.experience = experienceFilter ? experienceFilter.name[locale] : null;

        if (doc.poster) doc.age = doc.poster.age;

        const plainDescription = doc.description
            ? doc.description.replace(/<[^>]*>/g, '').trim().slice(0, 300)
            : null;

        return {
            title: doc.title + ' — ' + (doc.userName || 'İş Axtaran'),
            description: `${doc.userName} — ${doc.title}. ${doc.cityName || ''}. ${plainDescription || ''}`,
            ogTitle: `${doc.title} — ${doc.userName}`,
            ogType: 'article',
            body: "JobSeeker/Details.ejs",
            data: doc,
            js: null,
            currentPage: 'job-seekers'
        };
    }

    async createJobSeeker(data, userId, file) {
        const t = await sequelize.transaction();
        try {
            let cvUrl = null;
            let cvFileName = null;

            if (data.selectedCV) {
                const existingCv = await CVRepository.findById(data.selectedCV, { transaction: t });
                if (existingCv && existingCv.userId === userId && existingCv.fileUrl) {
                    cvUrl = existingCv.fileUrl;
                    cvFileName = existingCv.fileName || existingCv.title;
                }
            } else if (file) {
                cvUrl = `/uploads/cv/${file.filename}`;
                cvFileName = file.originalname;
            }

            const doc = await JobSeekerRepository.model.create({
                title: data.title,
                description: data.description,
                userName: data.userName,
                email: data.email,
                phone: data.phone,
                salary: data.salary ? Number(data.salary) : null,
                salaryNegotiable: data.salaryNegotiable === 'true',
                cvUrl,
                cvFileName,
                postedBy: userId,
                isActive: false
            }, { transaction: t });

            doc.slug = `${slugify(doc.title || 'job-seeker', { lower: true, strict: true, locale: 'tr' })}-${doc.id}`;
            await doc.save({ transaction: t });

            if (data.filterOptionIds && Array.isArray(data.filterOptionIds)) {
                await doc.setFilterOptions(data.filterOptionIds, { transaction: t });
            }

            await t.commit(); // Transaction successful!

            sendEmail({
                title: "Jobing.az",
                text: "İş axtarışı elanınız yoxlaniş üçün Jobing.az komandasına göndərildi."
            }, data.email, "support - Jobing.az").catch(() => {});

            sendNewJobSeekerRequest({ ...data, id: doc.id, slug: doc.slug }).catch(() => {});

            return doc;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async deleteJobSeeker(id, userId) {
        const doc = await JobSeekerRepository.findById(id);
        if (!doc) throw new Error('Elan tapılmadı');
        
        if (doc.postedBy !== userId) throw new Error('Silmə icazəniz yoxdur');

        await doc.destroy();
        return true;
    }
}
export default new JobSeekerService();
