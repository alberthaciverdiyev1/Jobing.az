import JobService from '../Services/JobDataService.js';
import CategoryService from '../Services/CategoryService.js';
import pLimit from 'p-limit';

import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";
import Category from "../Models/Category.js";
import SmartJobAz from "../Helpers/SiteBasedScrapes/SmartJobAz.js";
import JobSearchAz from "../Helpers/SiteBasedScrapes/JobSearchAz.js";
import CityService from '../Services/CityService.js';
import Enums from '../Config/Enums.js';
import OfferAz from '../Helpers/SiteBasedScrapes/OfferAz.js';
import HelloJobAz from '../Helpers/SiteBasedScrapes/HelloJobAz.js';
import sendEmail from "../Helpers/NodeMailer.js";
import { formatDate } from "../Helpers/FormatDate.js";
import { requestAllSites } from '../Helpers/Automation.js';
import { sendTgMessage } from "../Helpers/TelegramBot.js";
import fs from "fs";

const jobDataController = {



    // create: async (req, res) => {
    //     try {
    //         const data = await fs.promises.readFile('./src/Config/OnlyMainContent.json', 'utf8');
    //         let cities = [];

    //         if (data.includes('false')) {
    //             cities = await CityService.getAll({ site: "BossAz" });

    //             if (!cities || cities.length === 0) {
    //                 throw new Error("No cities found");
    //             }
    //         } else {
    //             cities = [{
    //                 name: 'Bakı',
    //                 cityId: 1,
    //             }];
    //         }

    //         await sendTgMessage(`Cron started at ${formatDate()}`);

    //         const categories = await CategoryService.getLocalCategories({});
    //         if (!categories || categories.length === 0) {
    //             throw new Error("No categories found");
    //         }

    //         const sources = [
    //             { instance: new BossAz(), name: "BossAz" },
    //             // { instance: new HelloJobAz(), name: "HelloJobAz" },
    //             // { instance: new OfferAz(), name: "OfferAz" },
    //             // { instance: new SmartJobAz(), name: "SmartJobAz" },
    //             // { instance: new JobSearchAz(), name: "JobSearchAz" },
    //         ];

    //         let totalInsertedJobCount = 0;
    //         let insertedJobCount = 0;
    //         const errors = [];

    //         const limit = pLimit(9);

    //         for (const city of cities) {
    //             for (const category of categories) {
    //                 const categoryPromises = [];

    //                 const cityPromises = sources.map(({ instance, name }) => {
    //                     return limit(async () => {
    //                         try {
    //                             const jobs = await instance.Jobs([category], city);
    //                             if (jobs.length > 0) {
    //                                 const response = await JobService.create(jobs);
    //                                 if (!response || !response.status || !response.message) {
    //                                     throw new Error(`Invalid response from JobService for ${name}`);
    //                                 }
    //                                 insertedJobCount  += response.count;
    //                                 totalInsertedJobCount += insertedJobCount;
    //                                 sendTgMessage(`${name} jobs successfully inserted for category ${category.categoryName} and city ${city.name}. Inserted job count: ${insertedJobCount}. Total inserted Job Count :${totalInsertedJobCount}`);
    //                                 insertedJobCount = 0;
    //                             }
    //                         } catch (error) {
    //                             const errorMessage = `Error processing ${name} for category ${category.categoryName} and city ${city.name}: ${error.message}`;
    //                             errors.push(errorMessage);
    //                             sendTgMessage(`Error from: ${name}, Error message: ${errorMessage}`);
    //                         }
    //                     });
    //                 });

    //                 categoryPromises.push(Promise.all(cityPromises));
    //             }

    //             await Promise.all(categoryPromises);
    //             console.log("endedeeee")
    //         }

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

    // create: async (req, res) => {
    //     try {
    //         const data = await fs.promises.readFile('./src/Config/OnlyMainContent.json', 'utf8');

    //         let cities = data.includes('false')
    //             ? await CityService.getAll({ site: "BossAz" })
    //             : [{ name: 'Bakı', cityId: 1 }];

    //         if (!cities || cities.length === 0) {
    //             throw new Error("No cities found");
    //         }

    //         await sendTgMessage(`Cron started at ${formatDate()}`);

    //         const categories = await CategoryService.getLocalCategories({});
    //         if (!categories || categories.length === 0) {
    //             throw new Error("No categories found");
    //         }

    //         const sources = [
    //             { instance: new BossAz(), name: "BossAz" },
    //             // { instance: new HelloJobAz(), name: "HelloJobAz" },
    //             // { instance: new OfferAz(), name: "OfferAz" },
    //             // { instance: new SmartJobAz(), name: "SmartJobAz" },
    //             // { instance: new JobSearchAz(), name: "JobSearchAz" },
    //         ];

    //         let totalInsertedJobCount = 0;
    //         const errors = [];

    //         const limit = pLimit(9);
    //         const cityCategoryTasks = [];
    //         for (const city of cities) {
    //             for (const category of categories) {
    //                 cityCategoryTasks.push(
    //                     Promise.all(
    //                         sources.map(({ instance, name }) =>
    //                             limit(async () => {
    //                                 try {
    //                                     const jobs = await instance.Jobs([category], city);

    //                                     if (jobs.length > 0) {
    //                                         const response = await JobService.create(jobs);

    //                                         if (!response || !response.status || !response.message) {
    //                                             throw new Error(`Invalid response from JobService for ${name}`);
    //                                         }
    //                                         totalInsertedJobCount += response.count;

    //                                         await sendTgMessage(
    //                                             `${name} jobs successfully inserted for category ${category.categoryName} and city ${city.name}. Inserted count: ${response.count}. Total count: ${totalInsertedJobCount}`
    //                                         );
    //                                     }
    //                                 } catch (error) {
    //                                     const errorMessage = `Error processing ${name} for category ${category.categoryName} and city ${city.name}: ${error.message}`;
    //                                     errors.push(errorMessage);
    //                                     await sendTgMessage(`Error from: ${name}, Error: ${errorMessage}`);
    //                                 }
    //                             })
    //                         )
    //                     )
    //                 );
    //             }
    //         }

    //         await Promise.all(cityCategoryTasks);

    //         res.status(201).json({
    //             errors: errors.length > 0 ? errors : null,
    //             status: 201,
    //             message: `Insertion completed. Total records inserted: ${totalInsertedJobCount}`,
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
            const data = await fs.promises.readFile('./src/Config/OnlyMainContent.json', 'utf8');

            const cities = data.includes('false')
                ? await CityService.getAll({ site: "BossAz" })
                : [{ name: 'Bakı', cityId: 1 }];

            if (!cities || cities.length === 0) {
                throw new Error("No cities found");
            }

            await sendTgMessage(`Cron started at ${formatDate()}`);

            const categories = await CategoryService.getLocalCategories({});
            if (!categories || categories.length === 0) {
                throw new Error("No categories found");
            }

            const sources = [
                { instance: new BossAz(), name: "BossAz" },
                { instance: new HelloJobAz(), name: "HelloJobAz" },
                { instance: new OfferAz(), name: "OfferAz" },
                { instance: new SmartJobAz(), name: "SmartJobAz" },
                { instance: new JobSearchAz(), name: "JobSearchAz" },
            ];

            let totalInsertedJobCount = 0;
            const errors = [];
            const limit = pLimit(10);

            const cityCategoryTasks = [];

            for (const city of cities) {
                for (const category of categories) {
                    cityCategoryTasks.push(
                        ...sources.map(({ instance, name }) =>
                            limit(async () => {
                                try {
                                    const jobs = await instance.Jobs([category], city,data.includes('true'));

                                    if (jobs.length > 0) {
                                        const response = await JobService.create(jobs);

                                        if (!response || !response.status || !response.message) {
                                            throw new Error(`Invalid response from JobService for ${name}`);
                                        }

                                        totalInsertedJobCount += response.count;

                                        await sendTgMessage(
                                            `${name} jobs successfully inserted for category ${category.categoryName} and city ${city.name}. Inserted count: ${response.count}. Total count: ${totalInsertedJobCount}`
                                        );
                                    }
                                } catch (error) {
                                    const errorMessage = `Error processing ${name} for category ${category.categoryName} and city ${city.name}: ${error.message}`;
                                    errors.push(errorMessage);
                                    await sendTgMessage(`Error from: ${name}, Error: ${errorMessage}`);
                                }
                            })
                        )
                    );
                }
            }

            await Promise.all(cityCategoryTasks);

            if (errors.length > 0) {
                await sendTgMessage(`Cron completed with errors: ${errors.length}`);
            }

            res.status(201).json({
                errors: errors.length > 0 ? errors : null,
                status: 201,
                message: `Insertion completed. Total records inserted: ${totalInsertedJobCount}`,
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

    requestAllSites: async (req, res) => {
        try {
            await requestAllSites(true)
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
