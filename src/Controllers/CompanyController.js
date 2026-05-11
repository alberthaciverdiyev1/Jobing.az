import BossAz from '../Helpers/SiteBasedScrapes/BossAz.js';
import SmartJobAz from '../Helpers/SiteBasedScrapes/SmartJobAz.js';
import CompanyService from '../Services/CompanyService.js';
import JobData from '../Models/JobData.js';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types'
import axios from 'axios';
import pLimit from 'p-limit';


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

    // Public: list all companies with vacancy counts
    publicList: async (req, res) => {
        try {
            const companies = await CompanyService.getAll();
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
            res.json(result.filter(c => c.vacancyCount > 0 || c.companyName));
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
    }
};

export default CompanyController;
