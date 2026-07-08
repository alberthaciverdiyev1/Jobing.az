import JobSeekerService from '../Services/JobSeekerService.js';
import CityService from '../Services/CityService.js';
import Enums from '../Config/Enums.js';
import { sendNewJobSeekerRequest } from '../Helpers/TelegramBot.js';
import sendEmail from '../Helpers/NodeMailer.js';

const JobSeekerController = {
    create: async (req, res) => {
        try {
            const description = req.body.data.aboutJob || '';
            const data = {
                title: req.body.data.position,
                userName: req.body.data.username,
                email: req.body.data.email,
                phone: req.body.data.phone,
                categoryId: req.body.data.category,
                cityId: req.body.data.city,
                educationId: req.body.data.education,
                experienceId: req.body.data.experience,
                description,
                postedBy: req.user._id,
                isActive: false
            };

            const doc = await JobSeekerService.create(data);
            data.id = doc._id;
            data.slug = doc.slug;

            sendNewJobSeekerRequest(data).catch(() => {});
            sendEmail({
                title: "Jobing.az",
                text: "İş axtarışı elanınız yoxlaniş üçün Jobing.az komandasına göndərildi. Qısa zaman içində sizə geri dönüş ediləcək."
            }, req.body.data.email, "support - Jobing.az").catch(() => {});

            res.status(200).json({ status: 200, message: 'Məlumat uğurla əlavə edildi!', id: doc._id, slug: doc.slug });
        } catch (error) {
            res.status(500).json({ message: 'Xəta baş verdi: ' + error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const filters = {
                keyword: req.query.keyword,
                categoryId: req.query.categoryId,
                cityId: req.query.cityId,
                educationId: req.query.educationId,
                experienceId: req.query.experienceId,
                offset: req.query.offset || 0,
                limit: req.query.limit || 20
            };
            const result = await JobSeekerService.getAll(filters);
            res.json({ jobs: result.docs, totalCount: result.total });
        } catch (error) {
            res.status(500).json({ message: 'Xəta baş verdi: ' + error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const doc = await JobSeekerService.getById(req.params.id);
            if (!doc) return res.status(404).json({ message: 'Elan tapılmadı' });
            doc.education = Object.entries(Enums.Education)
                .filter(([key, value]) => Number(value) === doc.educationId);
            doc.experience = Object.entries(Enums.Experience)
                .filter(([key, value]) => Number(value) === doc.experienceId);
            doc.education = doc.education.length > 0 ? doc.education[0][0] : null;
            doc.experience = doc.experience.length > 0 ? doc.experience[0][0] : null;
            let cityName = null;
            try { cityName = (await CityService.findById(doc.cityId))?.name; } catch {}
            doc.cityName = cityName;
            res.json(doc);
        } catch (error) {
            res.status(500).json({ message: 'Xəta baş verdi: ' + error.message });
        }
    },

    getMyAds: async (req, res) => {
        try {
            const docs = await JobSeekerService.findByUser(req.user._id);
            res.json(docs);
        } catch (error) {
            res.status(500).json({ message: 'Xəta baş verdi: ' + error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const doc = await JobSeekerService.delete(req.params.id, req.user._id);
            if (!doc) return res.status(404).json({ message: 'Elan tapılmadı və ya silmə icazəniz yoxdur' });
            res.json({ status: 200, message: 'Elan silindi' });
        } catch (error) {
            res.status(500).json({ message: 'Xəta baş verdi: ' + error.message });
        }
    },

    details: async (req, res) => {
        try {
            const data = await JobSeekerService.getById(req.params.id);
            if (!data) return res.status(404).render('Partials/Error.ejs');

            data.education = Object.entries(Enums.Education)
                .filter(([key, value]) => Number(value) === data.educationId);
            data.experience = Object.entries(Enums.Experience)
                .filter(([key, value]) => Number(value) === data.experienceId);
            data.education = data.education.length > 0 ? data.education[0][0] : null;
            data.experience = data.experience.length > 0 ? data.experience[0][0] : null;

            let cityName = null;
            try { cityName = (await CityService.findById(data.cityId))?.name; } catch {}
            data.cityName = cityName;

            const plainDescription = data.description
                ? data.description.replace(/<[^>]*>/g, '').trim().slice(0, 300)
                : null;

            const view = {
                title: data.title + ' — ' + (data.userName || 'İş Axtaran'),
                description: `${data.userName} — ${data.title}. ${data.cityName || ''}. ${plainDescription || ''}`,
                ogTitle: `${data.title} — ${data.userName}`,
                ogType: 'article',
                body: "JobSeeker/Details.ejs",
                data: data,
                js: null,
                currentPage: 'job-seekers'
            };

            res.render('Main', view);

            if (data._id) {
                JobSeekerService.incrementViewCount(data._id).catch(() => {});
            }
        } catch (error) {
            res.status(500).json({ message: 'Error: ' + error.message });
        }
    }
};

export default JobSeekerController;
