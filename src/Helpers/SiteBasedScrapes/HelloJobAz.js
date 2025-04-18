import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import randomUserAgent from "../../Config/UserAgents.js";
import CompanyService from '../../Services/CompanyService.js';
import sendEmail from "../NodeMailer.js";
import {sendTgMessage} from "../TelegramBot.js";


const cities = {
    "1": "Bakı"
};

class HelloJobAz {
    constructor(url = enums.Sites.HelloJobAz) {
        this.url = url;
    }

    async Categories() {
        try {
            const $ = await Scrape(`https://${this.url}`);
            const categories = [];
            let mainCategoryId = null;

            $('[name="category_id"] option').each((i, option) => {
                const value = $(option).val();
                const text = $(option).text().trim();
                if (value) {
                    if (!text.startsWith('-')) {
                        mainCategoryId = value;
                        categories.push({
                            name: text,
                            categoryId: mainCategoryId,
                            parentId: null,
                            website: this.url,
                            websiteId: enums.SitesWithId.HelloJobAz,
                        });
                    } else {
                        if (categories.length > 0) {
                            categories.push({
                                name: text.replace('- ', ''),
                                categoryId: value,
                                parentId: mainCategoryId,
                                website: this.url,
                                websiteId: enums.SitesWithId.HelloJobAz,
                            });
                        }
                    }
                }
            });
            return categories.filter(category => category.categoryId !== null);
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error fetching categories');
        }
    }


    async Jobs(categories, bossAzCity,main) {
        const city = Object.entries(enums.Cities.HelloJobAz).find(
            ([k, v]) => v === bossAzCity.name
        );
        const cityId = city ? city[0] : null;

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const educationIds = [1, 2, 3, 4, 5, 6];
        const jobData = [];
        const companyData = [];
        const limit = pLimit(1);

        try {
            let splitCategories = categories
                .flatMap(c => c.helloJobAz.split(','))
                .map(jobId => jobId.trim())
                .filter(jobId => jobId !== '')
                .map(jobId => ({
                    localCategoryId: categories.find(c => c.helloJobAz.includes(jobId)).localCategoryId,
                    helloJobAzId: jobId,
                }));
            const dataPromises = [];
            if (cityId && (main ? true : (bossAzCity.name !== "Bakı" ? true : false))) {

                for (const [index, category] of splitCategories.entries()) {
                    for (const education of educationIds) {
                        for (let page = 0; page <= 2; page++) {
                            const requestPromise = limit(async () => {
                                try {
                                    // console.log((index + 1), processedCount,cityId, category)
                                    // if ((index + 1) !== processedCount) {
                                    //     // sendEmail(status, process.env.TEST_CRON_MAIL_USER, "HelloJob Crone Info")
                                    //     await sendTgMessage(`Hello Job Category Status:${processedCount}/${totalCategories}`)
                                    // }
                                    // processedCount = index + 1

                                    const randomDelay = Math.floor(Math.random() * 6000) + 1000;
                                    await delay(randomDelay);

                                    let url = `https://www.${this.url}/search?direction=works&category_id=${category.helloJobAzId}&region_id=${cityId}&salary_min=&education_type=${education}&work_exp=0&search_type=filter`;

                                    const requestWithTimeout = new Promise((_, reject) =>
                                        setTimeout(() => reject(new Error('Request Timeout')), 30000)
                                    );

                                    const $ = await Promise.race([Scrape(url), requestWithTimeout]);

                                    $('.vacancies__item').each((i, el) => {
                                        const urlAndId = $(el).attr('href');
                                        const title = $(el).find('.vacancies__title').text().trim();
                                        const companyName = $(el).find('.vacancies__company').text().trim();
                                        const jobId = urlAndId?.split('/').pop() || null;
                                        const redirectUrl = urlAndId || null;

                                        const salaryText = $(el).find('.vacancies__price').text().trim();
                                        const cleanSalaryText = salaryText ? salaryText.replace(/[AZN]/g, '').trim() : null;
                                        const parts = cleanSalaryText
                                            ? (cleanSalaryText.includes('-')
                                                ? cleanSalaryText.split('-').map(part => part.trim())
                                                : [cleanSalaryText.trim()])
                                            : [];

                                        const isPremium = $(el).find('.vacancies__premium').length > 0;
                                        let [minSalary, maxSalary] = [0, 0];
                                        if (parts.length === 2) {
                                            minSalary = parseInt(parts[0], 10) || 0;
                                            maxSalary = parseInt(parts[1], 10) || 0;
                                        } else if (parts.length === 1) {
                                            maxSalary = parseInt(parts[0], 10) || 0;
                                        }

                                        const location = $(el).find('.vacancy_item_time').last().text().trim();
                                        const description = $(el).find('.vacancies__desc').text().trim();
                                        const companyImageUrl = $(el).find('.vacancies__icon img').attr('src') || null;

                                        jobData.push({
                                            title,
                                            companyName,
                                            minSalary,
                                            maxSalary,
                                            isPremium,
                                            categoryId: category.localCategoryId,
                                            location: bossAzCity.name,
                                            description,
                                            jobId,
                                            cityId: bossAzCity?.cityId || null,
                                            sourceUrl: this.url,
                                            redirectUrl: `https://${this.url}` + redirectUrl,
                                            jobType: '0x001',
                                            educationId: this.mapEducation(education),
                                            uniqueKey: `${title}-${companyName}-${location}`
                                        });

                                        companyData.push({
                                            companyName,
                                            imageUrl: companyImageUrl,
                                            website: enums.SitesWithId.HelloJobAz,
                                            uniqueKey: `${companyName}-${companyImageUrl}`
                                        });
                                    });
                                } catch (error) {
                                    console.error(`Error for URL ${category.helloJobAzId} - ${bossAzCity.name}:`, error.message);
                                }
                            });

                            dataPromises.push(requestPromise);
                        }
                    }
                }
            }

            await Promise.all(dataPromises);

            const companyResult = await CompanyService.create(companyData);

            if (companyResult.status === 200 || companyResult.status === 201) {
                return jobData;
            }
        } catch (error) {
            throw new Error(`Error Scraping Jobs From HelloJobAz: ${error.message}`);
        }
    }


    mapEducation(education) {
        return (education === 5 || education === 6) ? enums.Education.Secondary :
            (education === 3 || education === 4) ? enums.Education.IncompleteEducation :
                (education === 2) ? enums.Education.Bachelor :
                    (education === 1) ? enums.Education.Master :
                        (education === 7) ? enums.Education.Doctor : 0;
    }

}

export default HelloJobAz;
