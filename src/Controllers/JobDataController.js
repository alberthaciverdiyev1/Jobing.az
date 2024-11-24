import JobService from '../Services/JobDataService.js';
import CategoryService from '../Services/CategoryService.js';

import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";
import Category from "../Models/Category.js";
import SmartJobAz from "../Helpers/SiteBasedScrapes/SmartJobAz.js";
import CityService from '../Services/CityService.js';
import Enums from '../Config/Enums.js';
import OfferAz from '../Helpers/SiteBasedScrapes/OfferAz.js';
import HelloJobAz from '../Helpers/SiteBasedScrapes/HelloJobAz.js';
const jobDataController = {
    create: async (req, res) => {
        try {
            const categories = await CategoryService.getLocalCategories({});
            if (!categories || categories.length === 0) {
                throw new Error("No categories found");
            }

            const cities = await CityService.getAll({ site: "BossAz" });
            if (!cities || cities.length === 0) {
                throw new Error("No cities found");
            }

            const smartJobAz = new SmartJobAz();
            const bossAz = new BossAz();
            const offerAz = new OfferAz();
            const helloJobAz = new HelloJobAz();

            let smartJobAzJobs = [];
            let bossAzjobs = [];
            let offerAzjobs = [];
            let helloJobAzJobs = [];
            const errors = [];

            try {
                helloJobAzJobs = await helloJobAz.Jobs(categories, cities);
            } catch (error) {
                const errorMessage = "Error fetching HelloJobAz jobs: " + error.message;
                errors.push(errorMessage);
            }

            try {
                offerAzjobs = await offerAz.Jobs(categories, cities);
            } catch (error) {
                const errorMessage = "Error fetching OfferAz jobs: " + error.message;
                errors.push(errorMessage);
            }

            try {
                smartJobAzJobs = await smartJobAz.Jobs(categories, cities);
            } catch (error) {
                const errorMessage = "Error fetching SmartJobAz jobs: " + error.message;
                errors.push(errorMessage);
            }

            try {
                bossAzjobs = await bossAz.Jobs(categories, cities);
            } catch (error) {
                const errorMessage = "Error fetching BossAz jobs: " + error.message;
                errors.push(errorMessage);
            }

            const data = [...(bossAzjobs || []), ...(smartJobAzJobs || []), ...(offerAzjobs || []), ...(helloJobAzJobs || [])];

            if (data.length === 0) {
                throw new Error("No jobs fetched from any source");
            }

            const response = await JobService.create(data);
            if (!response || !response.status || !response.message) {
                throw new Error("Invalid response from JobService");
            }

            res.status(response.status).json({
                message: response.message,
                errors: errors.length > 0 ? errors : null,
            });

        } catch (error) {
            res.status(500).json({
                message: "Error scrape jobs",
                error: error.message || "Unknown error",
            });
        }
    },

    getAll: async (req, res) => {
        try {
            let data = {
                categoryId: req.query.categoryId,
                cityId: req.query.cityId,
                keyword: req.query.keyword,
                jobType: req.query.jobType,
                minSalary: req.query.minSalary,
                maxSalary: req.query.maxSalary,
                experience: req.query.experience,
                educationId: req.query.educationId,
                offset: req.query.offset,
            }

            const jobs = await JobService.getAllJobs(data);
            res.status(200).json(jobs);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving jobs: ' + error.message });
        }
    },

    getSiteById: async (req, res) => {
        try {
            const site = await JobService.findSiteById(req.params.id);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving site: ' + error.message });
        }
    },

    updateSite: async (req, res) => {
        try {
            const site = await JobService.updateSite(req.params.id, req.body);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error updating site: ' + error.message });
        }
    },

    removeDuplicates: async (req, res) => {
        try {
            const site = await JobService.removeDuplicates();

            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error updating site: ' + error.message });
        }
    },


    deleteSite: async (req, res) => {
        try {
            await JobService.deleteSite(req.params.id);
            res.status(200).json({ message: 'Site successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting site: ' + error.message });
        }
    }
};

export default jobDataController;
