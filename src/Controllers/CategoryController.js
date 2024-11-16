import CategoryService from '../Services/CategoryService.js';
import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";
import SmartJobAz from "../Helpers/SiteBasedScrapes/SmartJobAz.js";
import Enums from '../Config/Enums.js';

const CategoryController = {
    addForeignCategories: async (req, res) => {
        try {
            const boss = new BossAz();
            const smartJob = new SmartJobAz();

            // const bossAzCategories = await boss.Categories();
            const smartJobCategories = await smartJob.Categories(); 
            let categories = [...smartJobCategories];
            // let categories = [...smartJobCategories, ...bossAzCategories];

            const response = await CategoryService.addForeignCategories(categories);
            res.status(response.status).json({ message: response.message, count: response.count });
        } catch (error) {
            res.status(500).json({ message: 'Error creating category: ' + error.message });
        }
    },

    getForeignCategories: async (req, res) => {
        try {
            const categories = await CategoryService.getForeignCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving categories: ' + error.message });
        }
    },

    getLocalCategories: async (req, res) => {
        try {           
            const categories = await CategoryService.getLocalCategories(req.query);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving categories: ' + error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const company = await CategoryService.findById(req.params.id);
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
            const company = await CategoryService.update(req.params.id, req.body);
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
            await CategoryService.delete(req.params.id);
            res.status(200).json({ message: 'Company successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting company: ' + error.message });
        }
    }
};

export default CategoryController;
