import JobService from '../Services/JobDataService.js';
import CategoryService from '../Services/CategoryService.js';

import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";
import Category from "../Models/Category.js";
import SmartJobAz from "../Helpers/SiteBasedScrapes/SmartJobAz.js";

const jobDataController = {
    create: async (req, res) => {
        try {
            const categories = await CategoryService.getAll();
            const bossAz = new BossAz();
            // const smatJobAz = new SmartJobAz();
            // const smartJobAzJobs = await smatJobAz.Jobs();
            // return smartJobAzJobs;
            const jobs = await bossAz.Jobs(categories);
            // console.log(jobs);
            // return; 
            const response = await JobService.create(jobs);
            res.status(response.status).json({message:response.message});
        } catch (error) {
            res.status(500).json({message: 'Error creating site: ' + error.message});
        }
    },

    getAll: async (req, res) => {
        try {
            const jobs = await JobService.getAllJobs();
            res.status(200).json(jobs);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving jobs: ' + error.message});
        }
    },

    getSiteById: async (req, res) => {
        try {
            const site = await JobService.findSiteById(req.params.id);
            if (!site) {
                return res.status(404).json({message: 'Site not found'});
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving site: ' + error.message});
        }
    },

    updateSite: async (req, res) => {
        try {
            const site = await JobService.updateSite(req.params.id, req.body);
            if (!site) {
                return res.status(404).json({message: 'Site not found'});
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({message: 'Error updating site: ' + error.message});
        }
    },

    deleteSite: async (req, res) => {
        try {
            await JobService.deleteSite(req.params.id);
            res.status(200).json({message: 'Site successfully deleted'});
        } catch (error) {
            res.status(500).json({message: 'Error deleting site: ' + error.message});
        }
    }
};

export default jobDataController;
