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
            let insertedJobCount = 0;
            const errors = [];
    
            const insertJobs = async (jobs, sourceName) => {
                if (jobs.length > 0) {
                    try {
                        const response = await JobService.create(jobs);
                        if (!response || !response.status || !response.message) {
                            throw new Error(`Invalid response from JobService for ${sourceName}`);
                        }
                        console.log(`${sourceName} jobs successfully inserted`);
                        insertedJobCount += response.count;
                        return response;
                    } catch (error) {
                        const errorMessage = `Error inserting ${sourceName} jobs: ` + error.message;
                        errors.push(errorMessage);
                        console.error(errorMessage);
                    }
                }
            };

            let helloJobAzJobs = [];
            try {
                helloJobAzJobs = await helloJobAz.Jobs(categories, cities);
                await insertJobs(helloJobAzJobs, "HelloJobAz");
            } catch (error) {
                errors.push(`Error fetching HelloJobAz jobs: ${error.message}`);
            }
    
            let offerAzjobs = [];
            try {
                offerAzjobs = await offerAz.Jobs(categories, cities);
                await insertJobs(offerAzjobs, "OfferAz");
            } catch (error) {
                errors.push(`Error fetching OfferAz jobs: ${error.message}`);
            }
    
            let smartJobAzJobs = [];
            try {
                smartJobAzJobs = await smartJobAz.Jobs(categories, cities);
                await insertJobs(smartJobAzJobs, "SmartJobAz");
            } catch (error) {
                errors.push(`Error fetching SmartJobAz jobs: ${error.message}`);
            }
    
            let bossAzjobs = [];
            try {
                bossAzjobs = await bossAz.Jobs(categories, cities);
                await insertJobs(bossAzjobs, "BossAz");
            } catch (error) {
                errors.push(`Error fetching BossAz jobs: ${error.message}`);
            }
    
            res.status(201).json({
                errors: errors.length > 0 ? errors : null,
                status: 201,
                message: `Insertion completed. Number of records inserted: ${insertedJobCount}`,
            });
    
        } catch (error) {
            res.status(500).json({
                message: "Error scraping jobs",
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
