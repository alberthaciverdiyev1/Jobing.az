import BossAz from '../Helpers/SiteBasedScrapes/BossAz.js';
import SmartJobAz from '../Helpers/SiteBasedScrapes/SmartJobAz.js';
import CompanyService from '../Services/CompanyService.js';

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

    getAll: async (req, res) => {
        try {
            const companies = await CompanyService.getAll();
            res.status(200).json(companies);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving company: ' + error.message });
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
    }
};

export default CompanyController;
