import JobService from '../Services/JobDataService.js';
import CategoryService from '../Services/CategoryService.js';
import pLimit from 'p-limit';

import JobSearchAz from "../Helpers/SiteBasedScrapes/JobSearchAz.js";
import CityService from '../Services/CityService.js';

import { formatDate } from "../Helpers/FormatDate.js";
import { requestAllSites } from '../Helpers/Automation.js';
import { sendNewJobRequest, sendTgMessage } from "../Helpers/TelegramBot.js";
import fs from "fs";
import CompanyService from "../Services/CompanyService.js";
import BossAz from "../Helpers/SiteBasedScrapes/BossAz.js";
import HelloJobAz from "../Helpers/SiteBasedScrapes/HelloJobAz.js";
import OfferAz from "../Helpers/SiteBasedScrapes/OfferAz.js";
import SmartJobAz from "../Helpers/SiteBasedScrapes/SmartJobAz.js";
import sendEmail from "../Helpers/NodeMailer.js";
import { log } from 'console';
import Enums from "../Config/Enums.js";
import enums from "../Config/Enums.js";

const jobDataController = {

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
            console.log(categories)
            if (!categories || categories.length === 0) {
                throw new Error("No categories found");
            }

            const sources = [
                // { instance: new BossAz(), name: "BossAz" },
                // { instance: new HelloJobAz(), name: "HelloJobAz" },
                { instance: new OfferAz(), name: "OfferAz" },
                // { instance: new SmartJobAz(), name: "SmartJobAz" },
                // { instance: new JobSearchAz(), name: "JobSearchAz" },
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
                                    const jobs = await instance.Jobs([category], city, data.includes('true'));

                                    if (jobs.length > 0) {
                                        const response = await JobService.create(jobs);
                                        await CompanyService.removeDuplicates();

                                        if (!response || !response.status || !response.message) {
                                            throw new Error(`Invalid response from JobService for ${name}`);
                                        }

                                        totalInsertedJobCount += response.count;

                                        await sendTgMessage(
                                            `${name} jobs successfully inserted for category ${category.category_name} and city ${city.name}. Inserted count: ${response.count}. Total count: ${totalInsertedJobCount}`
                                        );
                                    }
                                } catch (error) {
                                    const errorMessage = `Error processing ${name} for category ${category.category_name} and city ${city.name}: ${error.message}`;
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
            // if (res.status === 201) {
            await JobService.removeDuplicates();
            await CompanyService.downloadCompanyLogos();
            // }
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
                category_id: req.query.category_id,
                city_id: req.query.city_id,
                keyword: req.query.keyword,
                job_type: req.query.job_type,
                min_salary: req.query.min_salary,
                max_salary: req.query.max_salary,
                experience: req.query.experience,
                education_id: req.query.education_id,
                all_jobs: req.query.all_jobs === 'true' ? 1 : 0,
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
            const site = await JobService.updateJob(req.params.id, req.body);
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
    },

    addJobRequest: async (req, res) => {
        console.log({"aaaaaaa": req});
        try {
            let description = `${req.body.data.aboutJob + '<h4 class="text-lg font-bold text-gray-800">Tələblər:</h4>' + req.body.data.requirements}`;
            let data = {
                title: req.body.data.position,
                description: description,
                location: (await CityService.findById(req.body.data.city))?.name,
                min_salary: req.body.data.minSalary,
                max_salary: req.body.data.maxSalary,
                min_age: req.body.data.minAge,
                max_age: req.body.data.maxAge,
                category_id: req.body.data.category,
                company_name: req.body.data.company_name,
                city_id: req.body.data.city,
                education_id: req.body.data.education,
                experience_id: req.body.data.experience,
                user_name: req.body.data.username,
                is_premium: false,
                source_url: 'jobing.az',
                is_active: false,
                email: req.body.data.email,
                phone: req.body.data.phone,
                redirect_url: "#",
                uniqueKey: req.body.data.position + req.body.data.company_name + req.body.data.city,
            }
            // companyImage: null,
            const companyData ={
                company_name: req.body.data.company_name,
                image_url: req.body.data.companyImage,
                website: enums.Sites.JobingAz,
                unique_key:` ${req.body.data.company_name} + ${enums.Sites.JobingAz}`,
            }
console.log({data,companyData});
            const jobs = await JobService.addJobRequest(data);
            const response = await CompanyService.addSingleCompany(companyData);

            sendEmail({
                title: "Jobing.az",
                text: "Sizin vakansiyanız yoxlanis ucun Jobing.az komandasina gonderildi. Qisa zaman icinde cavab verilecekdir."
            }, req.body.data.email, "support - Jobing.az")
            data.id = jobs.id
            await sendNewJobRequest(data)
            res.status(200).json(jobs);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving jobs: ' + error.message });
        }
    },
    details: async (req, res) => {
        try {
            let data = await JobService.details(req.params.id);
            const educationData = Object.entries(Enums.Education)
                .filter(([key, value]) => Number(value) === data.educationId);
            const experienceData = Object.entries(Enums.Experience)
                .filter(([key, value]) => Number(value) === data.experienceId);

            data.education = educationData[0][0];
            data.experience = experienceData[0][0];
            const view = {
                title: 'Iş haqqında',
                body: "Jobs/Details.ejs",
                data: data,
                js: 'Details.js'
            };



            res.render('Main', view);
        } catch (error) {
            res.status(500).json({ message: 'Error job details: ' + error.message });
        }
    },
};

export default jobDataController;
