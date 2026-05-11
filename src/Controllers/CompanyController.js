import BossAz from '../Helpers/SiteBasedScrapes/BossAz.js';
import SmartJobAz from '../Helpers/SiteBasedScrapes/SmartJobAz.js';
import CompanyService from '../Services/CompanyService.js';
import JobData from '../Models/JobData.js';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types'
import axios from 'axios';
import pLimit from 'p-limit';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Multer setup for company logo/banner uploads
const companyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/company/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `company-${Date.now()}${ext}`);
    }
});
const uploadFile = multer({
    storage: companyStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    }
}).single('file');


const CompanyController = {
    create: async (req, res) => {
        try {
            const boss = new BossAz;
            const smartJob = new SmartJobAz;

            const bossAzCompanies = await boss.Companies();
            // const smartJobCategories = await smartJob.Categories(); 
            // let categories = [...smartJobCategories, ...bossAzCategories];

            const response = await CompanyService.create(bossAzCompanies);
            res.status(response.status).json({ message: response.message, count: response.count })
        } catch (error) {
            res.status(500).json({ message: 'Error creating company: ' + error.message });
        }
    },

    removeDuplicates: async (req, res) => {
        try {
            const response = await CompanyService.removeDuplicates();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error duplicate company: ' + error.message });
        }
    },

    downloadCompanyLogos: async (req, res) => {
        try {
            const response = await CompanyService.downloadCompanyLogos();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error duplicate company: ' + error.message });
        }
    },


    findById: async (req, res) => {
        try {
            const company = await CompanyService.findById(req.params.id);
            if (!company) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving company: ' + error.message });
        }
    },

    update: async (req, res) => {
        try {
            const company = await CompanyService.update(req.params.id, req.body);
            if (!company) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({ message: 'Error updating company: ' + error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await CompanyService.delete(req.params.id);
            res.status(200).json({ message: 'Company successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting company: ' + error.message });
        }
    },

    // Public: list companies with pagination and vacancy counts
    publicList: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const search = req.query.search || '';

            const { companies, total, page: currentPage, totalPages } = await CompanyService.getPaginated(page, limit, search);

            const result = await Promise.all(companies.map(async (c) => {
                const vacancyCount = await JobData.countDocuments({ companyName: c.companyName, isActive: true });
                return {
                    _id: c._id,
                    companyName: c.companyName,
                    imageUrl: c.imageUrl,
                    website: c.website,
                    vacancyCount
                };
            }));

            res.json({
                companies: result.filter(c => c.vacancyCount > 0 || c.companyName),
                total,
                page: currentPage,
                totalPages
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Public: company detail with jobs
    publicDetail: async (req, res) => {
        try {
            const company = await CompanyService.findById(req.params.id);
            if (!company) return res.status(404).json({ error: 'Company not found' });

            const jobs = await JobData.find({ companyName: company.companyName, isActive: true })
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();

            let imageUrl = company.imageUrl || '';
            if (imageUrl.includes('src/Public')) {
                imageUrl = imageUrl.slice(imageUrl.indexOf('src/Public') + 10);
            }

            res.json({ company: { ...company.toObject(), imageUrl }, jobs });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // COMPANY PROFILE (for authenticated company users)
    // ============================================================

    /** Get the company's own profile */
    getMyProfile: async (req, res) => {
        try {
            const company = await CompanyService.findByCompanyName(req.user.companyName);
            if (!company) {
                return res.status(404).json({ error: 'Şirkət tapılmadı' });
            }
            res.json({ company });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /** Update company profile */
    updateMyProfile: async (req, res) => {
        try {
            const company = await CompanyService.findByCompanyName(req.user.companyName);
            if (!company) {
                return res.status(404).json({ error: 'Şirkət tapılmadı' });
            }

            const updated = await CompanyService.updateProfile(company._id, req.body);
            res.json({ company: updated, message: 'Məlumatlar yeniləndi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /** Upload company logo */
    uploadLogo: async (req, res) => {
        uploadFile(req, res, async (err) => {
            if (err) return res.status(400).json({ error: 'Fayl yüklənə bilmədi' });
            if (!req.file) return res.status(400).json({ error: 'Fayl seçilməyib' });

            try {
                const company = await CompanyService.findByCompanyName(req.user.companyName);
                if (!company) return res.status(404).json({ error: 'Şirkət tapılmadı' });

                const fileUrl = `/uploads/company/${req.file.filename}`;
                await CompanyService.updateProfile(company._id, { imageUrl: fileUrl });
                res.json({ imageUrl: fileUrl, message: 'Logo yeniləndi' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },

    /** Upload company banner */
    uploadBanner: async (req, res) => {
        uploadFile(req, res, async (err) => {
            if (err) return res.status(400).json({ error: 'Fayl yüklənə bilmədi' });
            if (!req.file) return res.status(400).json({ error: 'Fayl seçilməyib' });

            try {
                const company = await CompanyService.findByCompanyName(req.user.companyName);
                if (!company) return res.status(404).json({ error: 'Şirkət tapılmadı' });

                const fileUrl = `/uploads/company/${req.file.filename}`;
                await CompanyService.updateProfile(company._id, { bannerUrl: fileUrl });
                res.json({ bannerUrl: fileUrl, message: 'Banner yeniləndi' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
};

export default CompanyController;
