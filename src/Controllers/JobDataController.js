import JobService from '../Services/JobDataService.js';
import CategoryService from '../Services/CategoryService.js';

import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";
import Category from "../Models/Category.js";
import SmartJobAz from "../Helpers/SiteBasedScrapes/SmartJobAz.js";
import JobSearchAz from "../Helpers/SiteBasedScrapes/JobSearchAz.js";
import CityService from '../Services/CityService.js';
import Enums from '../Config/Enums.js';
import OfferAz from '../Helpers/SiteBasedScrapes/OfferAz.js';
import HelloJobAz from '../Helpers/SiteBasedScrapes/HelloJobAz.js';
import sendEmail from "../Helpers/NodeMailer.js";
import {formatDate} from "../Helpers/FormatDate.js";
import {requestAllSites} from '../Helpers/Automation.js';
import {sendTgMessage} from "../Helpers/TelegramBot.js";

const jobDataController = {
    //
    // create: async (req, res) => {
    //     try {
    //         const to = process.env.CRON_MAIL_USER;
    //
    //         await sendEmail({
    //             title: "Cron started",
    //             text: `Cron started at ${formatDate()}`,
    //         }, to, "Cron started");
    //
    //         const categories = await CategoryService.getLocalCategories({});
    //         if (!categories || categories.length === 0) {
    //             throw new Error("No categories found");
    //         }
    //
    //         const cities = await CityService.getAll({site: "BossAz"});
    //         if (!cities || cities.length === 0) {
    //             throw new Error("No cities found");
    //         }
    //
    //         const sources = [
    //             {instance: new BossAz(), name: "BossAz"},
    //             {instance: new HelloJobAz(), name: "HelloJobAz"},
    //             {instance: new OfferAz(), name: "OfferAz"},
    //             {instance: new SmartJobAz(), name: "SmartJobAz"},
    //             {instance: new JobSearchAz(), name: "JobSearchAz"},
    //         ];
    //
    //         let insertedJobCount = 0;
    //         const errors = [];
    //
    //         for (const category of categories) {
    //             for (const {instance, name} of sources) {
    //                 try {
    //                     const jobs = await instance.Jobs([category], cities);
    //                     if (jobs.length > 0) {
    //                         const response = await JobService.create(jobs);
    //                         if (!response || !response.status || !response.message) {
    //                             throw new Error(`Invalid response from JobService for ${name}`);
    //                         }
    //                         insertedJobCount += response.count;
    //                         await sendEmail({
    //                             title: `${name}`,
    //                             text: `${name} jobs successfully inserted for category ${category.categoryName}. Inserted job count: ${insertedJobCount}`,
    //                         }, to, name);
    //                     }
    //                 } catch (error) {
    //                     const errorMessage = `Error processing ${name} for category ${category.categoryName}: ${error.message}`;
    //                     errors.push(errorMessage);
    //                     await sendEmail({
    //                         title: `Error from: ${name}`,
    //                         text: errorMessage,
    //                     }, to, "Error");
    //                 }
    //             }
    //         }
    //
    //         res.status(201).json({
    //             errors: errors.length > 0 ? errors : null,
    //             status: 201,
    //             message: `Insertion completed. Number of records inserted: ${insertedJobCount}`,
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "Error scraping jobs",
    //             error: error.message || "Unknown error",
    //         });
    //     }
    // },
    create: async (req, res) => {
        try {
            const to = process.env.CRON_MAIL_USER;
            sendTgMessage(`Cron started at ${formatDate()}`)

            const categories = await CategoryService.getLocalCategories({});
            if (!categories || categories.length === 0) {
                throw new Error("No categories found");
            }

            const cities = await CityService.getAll({site: "BossAz"});
            if (!cities || cities.length === 0) {
                throw new Error("No cities found");
            }

            const sources = [
                {instance: new BossAz(), name: "BossAz"},
                {instance: new HelloJobAz(), name: "HelloJobAz"},
                {instance: new OfferAz(), name: "OfferAz"},
                {instance: new SmartJobAz(), name: "SmartJobAz"},
                {instance: new JobSearchAz(), name: "JobSearchAz"},
            ];

            let insertedJobCount = 0;
            const errors = [];

            for (const category of categories) {
                for (const city of cities) {
                    for (const {instance, name} of sources) {
                        try {
                            const jobs = await instance.Jobs([category], city);
                            if (jobs.length > 0) {
                                const response = await JobService.create(jobs);
                                if (!response || !response.status || !response.message) {
                                    throw new Error(`Invalid response from JobService for ${name}`);
                                }
                                insertedJobCount += response.count;
                                sendTgMessage(`${name} jobs successfully inserted for category ${category.categoryName} and city ${city.name}. Inserted job count: ${insertedJobCount}`)
                            }
                        } catch (error) {
                            const errorMessage = `Error processing ${name} for category ${category.categoryName} and city ${city.name}: ${error.message}`;
                            errors.push(errorMessage);
                            sendTgMessage(`Error from: ${name}, Error message:${errorMessage}`)
                        }
                    }
                }
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

    removeDuplicates: async (req, res) => {
        try {
            const site = await JobService.removeDuplicates();

            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({message: 'Error updating site: ' + error.message});
        }
    },

    requestAllSites: async (req, res) => {
        try {
            await requestAllSites()
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
