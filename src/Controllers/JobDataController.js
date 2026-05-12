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
                                    const jobs = await instance.Jobs([category], city, data.includes('true'));

                                    if (jobs.length > 0) {
                                        const response = await JobService.create(jobs);
                                        await CompanyService.removeDuplicates();

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
                categoryId: req.query.categoryId,
                cityId: req.query.cityId,
                keyword: req.query.keyword,
                jobType: req.query.jobType,
                minSalary: req.query.minSalary,
                maxSalary: req.query.maxSalary,
                experience: req.query.experience,
                educationId: req.query.educationId,
                allJobs: req.query.allJobs === 'true' ? 1 : 0,
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
        try {
            // Only company, hr, and admin roles can post jobs
            if (req.user && req.user.role === 'user') {
                return res.status(403).json({ error: 'Users cannot post jobs' });
            }
            let description = `${req.body.data.aboutJob + '<h4 class="text-lg font-bold text-gray-800">Tələblər:</h4>' + req.body.data.requirements}`;
            const uniqueKey = req.body.data.position + '-' + req.body.data.companyName + '-' + req.body.data.city + '-' + Date.now();
            const slugBase = req.body.data.position || 'vakansiya';
            let data = {
                title: req.body.data.position,
                slug: slugBase.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) + '-' + Date.now().toString().slice(-6),
                description: description,
                location: (await CityService.findById(req.body.data.city))?.name,
                minSalary: req.body.data.minSalary,
                maxSalary: req.body.data.maxSalary,
                minAge: req.body.data.minAge,
                maxAge: req.body.data.maxAge,
                categoryId: req.body.data.category,
                companyName: req.body.data.companyName,
                cityId: req.body.data.city,
                educationId: req.body.data.education,
                experienceId: req.body.data.experience,
                userName: req.body.data.username,
                isPremium: false,
                sourceUrl: 'jobing.az',
                isActive: false,
                email: req.body.data.email,
                phone: req.body.data.phone,
                applicationMethod: req.body.data.applicationMethod || 'both',
                redirectUrl: '/vakansiyalar/' + encodeURIComponent(data.slug) + '/details',
                uniqueKey,
            }
            // companyImage: null,
            const companyData ={
                companyName: req.body.data.companyName,
                imageUrl: req.body.data.companyImage,
                website: enums.Sites.JobingAz,
                uniqueKey:` ${req.body.data.companyName} + ${enums.Sites.JobingAz}`,
            }

            const jobs = await JobService.addJobRequest(data);
            const response = await CompanyService.addSingleCompany(companyData);

            sendEmail({
                title: "Jobing.az",
                text: "Sizin vakansiyanız yoxlaniş üçün Jobing.az komandasına göndərildi. Qısa zaman içində sizə geri dönüş ediləcək."
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

            data.education = educationData.length > 0 ? educationData[0][0] : null;
            data.experience = experienceData.length > 0 ? experienceData[0][0] : null;

            const plainDescription = data.description
                ? data.description.replace(/<[^>]*>/g, '').trim().slice(0, 300)
                : null;

            const view = {
                title: data.title,
                description: `${data.title} — ${data.companyName}. ${data.location}. Maaş: ${data.minSalary || ''}${data.minSalary && data.maxSalary ? ' - ' : ''}${data.maxSalary || ''} AZN. ${plainDescription || ''}`,
                ogTitle: `${data.title} — ${data.companyName}`,
                ogDescription: `${data.title} vakansiyası. ${data.companyName} şirkəti ${data.location} üçün işçi axtarır. Maaş: ${data.minSalary || ''}${data.minSalary && data.maxSalary ? ' - ' : ''}${data.maxSalary || ''} AZN.`,
                ogImage: data.companyImage || undefined,
                ogType: 'article',
                body: "Jobs/Details.ejs",
                data: data,
                js: 'Details.js',
                currentPage: 'jobs'
            };



            res.render('Main', view);
        } catch (error) {
            res.status(500).json({ message: 'Error job details: ' + error.message });
        }
    },
};

export default jobDataController;
