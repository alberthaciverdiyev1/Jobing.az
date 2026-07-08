import JobSeekerService from '../Services/JobSeekerService.js';
import CityService from '../Services/CityService.js';
import CVService from '../Services/CVService.js';
import User from '../Models/User.js';
import Enums from '../Config/Enums.js';
import { sendNewJobSeekerRequest } from '../Helpers/TelegramBot.js';
import sendEmail from '../Helpers/NodeMailer.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const jsCvDir = 'uploads/cv/';
if (!fs.existsSync(jsCvDir)) {
    fs.mkdirSync(jsCvDir, { recursive: true });
}

const jsCvStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/cv/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `js-cv-${uuidv4()}${ext}`);
    }
});

const jsCvFileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Yalnız PDF, DOC, DOCX, TXT, RTF, JPG, PNG faylları yüklənə bilər'), false);
    }
};

export const uploadJobSeekerCV = multer({
    storage: jsCvStorage,
    fileFilter: jsCvFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('cvFile');

const JobSeekerController = {
    create: async (req, res) => {
        try {
            const description = req.body.aboutJob || '';
            const data = {
                title: req.body.position,
                userName: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                categoryId: req.body.category,
                cityId: req.body.city,
                educationId: req.body.education,
                experienceId: req.body.experience,
                description,
                postedBy: req.user._id,
                isActive: false
            };

            // Handle CV from existing CV or file upload
            if (req.body.selectedCV) {
                const existingCv = await CVService.findById(req.body.selectedCV);
                if (existingCv && existingCv.userId.toString() === req.user._id.toString()) {
                    if (existingCv.fileUrl) {
                        data.cvUrl = existingCv.fileUrl;
                        data.cvFileName = existingCv.fileName || existingCv.title;
                    }
                }
            } else if (req.file) {
                data.cvUrl = `/uploads/cv/${req.file.filename}`;
                data.cvFileName = req.file.originalname;
            }

            const doc = await JobSeekerService.create(data);
            data.id = doc._id;
            data.slug = doc.slug;

            sendNewJobSeekerRequest(data).catch(() => {});
            sendEmail({
                title: "Jobing.az",
                text: "İş axtarışı elanınız yoxlaniş üçün Jobing.az komandasına göndərildi. Qısa zaman içində sizə geri dönüş ediləcək."
            }, data.email, "support - Jobing.az").catch(() => {});

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
            const docs = result.docs || [];
            // Resolve city names and education/experience labels for listing cards
            for (const doc of docs) {
                if (doc.cityId) {
                    try {
                        const city = await CityService.findById(doc.cityId);
                        doc.cityName = city?.name || null;
                    } catch {}
                }
                if (doc.educationId != null) {
                    const entry = Object.entries(Enums.Education).find(([, v]) => Number(v) === doc.educationId);
                    if (entry) doc.education = entry[0];
                }
                if (doc.experienceId != null) {
                    const entry = Object.entries(Enums.Experience).find(([, v]) => Number(v) === doc.experienceId);
                    if (entry) doc.experience = entry[0];
                }
            }
            res.json({ jobs: docs, totalCount: result.total });
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
            // Populate age from user
            if (doc.postedBy) {
                try {
                    const userData = await User.findById(doc.postedBy).select('age').lean();
                    if (userData && userData.age) doc.age = userData.age;
                } catch {}
            }
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

            // Populate age from user
            if (data.postedBy) {
                try {
                    const userData = await User.findById(data.postedBy).select('age').lean();
                    if (userData && userData.age) data.age = userData.age;
                } catch {}
            }

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
