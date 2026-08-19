import CompanyService from '../Services/CompanyService.js';
import CompanyRepository from '../Repositories/CompanyRepository.js';
import VacancyRepository from '../../Vacancy/Repositories/VacancyRepository.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadFile = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = 'uploads/company/';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => cb(null, `company-${Date.now()}${path.extname(file.originalname)}`)
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('file');

const CompanyController = {
    list: async (req, res, next) => {
        try {
            const viewModel = await CompanyService.getCompaniesListViewModel(req.query);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    details: async (req, res, next) => {
        try {
            const viewModel = await CompanyService.getCompanyDetailsViewModel(req.params.id);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    myProfilePage: async (req, res, next) => {
        try {
            if (req.user.role !== 'company') return res.redirect('/');
            const company = await CompanyRepository.findByCompanyName(req.user.companyName);
            const jobs = await VacancyRepository.model.findAll({
                where: { companyName: req.user.companyName },
                order: [['createdAt', 'DESC']],
                limit: 50
            });
            res.render('Main', {
                title: 'Şirkət Profili',
                body: 'Dashboard/Company.ejs',
                js: 'CompanyProfile.js',
                currentPage: 'company-profile',
                company,
                jobs
            });
        } catch (error) {
            next(error);
        }
    },

    updateMyProfilePost: async (req, res, next) => {
        try {
            const company = await CompanyRepository.findByCompanyName(req.user.companyName);
            await CompanyService.updateProfile(company.id, req.body);
            res.redirect('/sirket-profili?success=true');
        } catch (error) {
            res.redirect(`/sirket-profili?error=${encodeURIComponent(error.message)}`);
        }
    }
};

export default CompanyController;
