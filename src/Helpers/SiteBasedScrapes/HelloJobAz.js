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
        console.log(categories)
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
                .flatMap(c => c.hello_job_az.split(','))
                .map(jobId => jobId.trim())
                .filter(jobId => jobId !== '')
                .map(jobId => ({
                    local_category_id: categories.find(c => c.hello_job_az.includes(jobId)).local_category_id,
                    hello_job_az_id: jobId,
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

                                    let url = `https://www.${this.url}/search?direction=works&category_id=${category.hello_job_az_id}&region_id=${cityId}&salary_min=&education_type=${education}&work_exp=0&search_type=filter`;
                                    const requestWithTimeout = new Promise((_, reject) =>
                                        setTimeout(() => reject(new Error('Request Timeout')), 30000)
                                    );

                                    const $ = await Promise.race([Scrape(url), requestWithTimeout]);
                                    $('.vacancies__item').each((i, el) => {
                                    console.log(i);
                                        const urlAndId = $(el).find('.vacancies__body').attr('href');
                                        const title = $(el).find('h2').text().trim();
                                        const company_name = $(el).find('.vacancies__company').text().trim();
                                        const job_id = urlAndId?.split('/').pop() || null;
                                        const redirect_url = urlAndId || null;

                                        const salaryText = $(el).find('.vacancies__price').text().trim();
                                        const cleanSalaryText = salaryText ? salaryText.replace(/[AZN]/g, '').trim() : null;
                                        const parts = cleanSalaryText
                                            ? (cleanSalaryText.includes('-')
                                                ? cleanSalaryText.split('-').map(part => part.trim())
                                                : [cleanSalaryText.trim()])
                                            : [];

                                        const is_premium = $(el).find('.vacancies__label').length > 0;
                                        let [min_salary, max_salary] = [0, 0];

                                        if (parts.length === 2) {
                                            min_salary = parseInt(parts[0], 10) || 0;
                                            max_salary = parseInt(parts[1], 10) || 0;
                                        } else if (parts.length === 1) {
                                            max_salary = parseInt(parts[0], 10) || 0;
                                        }

                                        const location = $(el).find('.vacancy_item_time').last().text().trim();
                                        const description = $(el).find('.vacancies__desc').text().trim();
                                        const companyImageUrl = $(el).find('.vacancies__logo img').attr('src') || null;

                                        jobData.push({
                                            title,
                                            company_name,
                                            min_salary,
                                            max_salary,
                                            is_premium,
                                            category_id: category.local_category_id,
                                            location: bossAzCity.name,
                                            description,
                                            job_id,
                                            city_id: bossAzCity?.cityId || null,
                                            source_url: this.url,
                                            redirect_url: redirect_url,
                                            job_type: '0x001',
                                            education_id: this.mapEducation(education),
                                            unique_key: `${title}-${company_name}-${bossAzCity.name}`
                                        });
                                        companyData.push({
                                            company_name,
                                            image_url: companyImageUrl,
                                            website: enums.SitesWithId.HelloJobAz,
                                            unique_key: `${company_name}-${companyImageUrl}`
                                        });
                                        // console.log({bossAzCity,jobData, companyData});
                                    });
                                } catch (error) {
                                    console.error(`Error for URL ${category.hello_job_az_id} - ${bossAzCity.name}:`, error.message);
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
