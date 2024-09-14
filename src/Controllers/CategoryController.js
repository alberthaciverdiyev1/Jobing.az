import CategoryService from '../Services/CategoryService.js';
import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";

const CategoryController = {
    create: async (req, res) => {
        try {
           const b = new BossAz();
            const options = await b.Categories();
            const response = await CategoryService.create(options);
            res.status(response.status).json({ message: response.message, count: response.count });
        } catch (error) {
            res.status(500).json({message: 'Error creating category: ' + error.message});
        }
    },

    getAll: async (req, res) => {
        try {
            const companies = await CategoryService.getAll();
            res.status(200).json(companies);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving company: ' + error.message});
        }
    },

    findById: async (req, res) => {
        try {
            const company = await CategoryService.findById(req.params.id);
            if (!company) {
                return res.status(404).json({message: 'Company not found'});
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving company: ' + error.message});
        }
    },

    update: async (req, res) => {
        try {
            const company = await CategoryService.update(req.params.id, req.body);
            if (!company) {
                return res.status(404).json({message: 'Company not found'});
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({message: 'Error updating company: ' + error.message});
        }
    },

    delete: async (req, res) => {
        try {
            await CategoryService.delete(req.params.id);
            res.status(200).json({message: 'Company successfully deleted'});
        } catch (error) {
            res.status(500).json({message: 'Error deleting company: ' + error.message});
        }
    }
};

export default CategoryController;
