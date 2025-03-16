import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import randomUserAgent from "../../Config/UserAgents.js";


class OfferAz {
    constructor(url = enums.Sites.OfferAz) {
        this.url = url;
    }

    async Categories() {
        try {
            const $ = await Scrape(`https://${this.url}/is-elanlari/`);
            const categories = [];

            $('#select_category option').each((i, option) => {
                const value = $(option).val();
                const text = $(option).text().trim();
                if (value) {
                    categories.push({
                        name: text,
                        categoryId: value,
                        parentId: null,
                        website: this.url,
                        websiteId: enums.SitesWithId.OfferAz,
                    });
                }
            });
            return categories.filter(category => category.categoryId !== null);
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error fetching categories');
        }
    }


    async Jobs(categories, bossAzCity, main) {

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
            let splitCategories = categories
                .flatMap(c => c.offer_az.split(','))
                .map(jobId => jobId.trim())
                .filter(jobId => jobId !== '')
                .map(jobId => ({
                    local_category_id: categories.find(c => c.offer_az.includes(jobId)).local_category_id,
                    offer_az_id: jobId,
                }));

            const city = Object.entries(enums.Cities.OfferAz).find(
                ([k, v]) => v === bossAzCity.name
            );
            const cityId = city ? city[0] : null;


            const limit = pLimit(1);
            const dataPromises = [];
            const educationIds = [249, 15, 14, 12, 13, 81, -1, -2];
            const jobData = [];
            console.log("OfferAz", cityId, splitCategories)

            if (cityId && (main ? true : (bossAzCity.name !== "Bakı" ? true : false))) {

                Object.entries(splitCategories).forEach(([no, category]) => {
                    for (const education of educationIds) {
                        for (let page = 0; page <= 2; page++) {
                            const requestPromise = limit(async () => {
                                try {
                                    const randomDelay = Math.floor(Math.random() * 15000) + 1000;
                                    await delay(randomDelay);

                                    const url = `https://${this.url}/wp-admin/admin-ajax.php`;

                                    const data = new URLSearchParams();
                                    data.append('select_category', category.offer_az_id);
                                    data.append('cur_page', page);
                                    data.append('select_erazi', cityId);
                                    data.append('form_mode', 'long');
                                    data.append('select_tehsil', education);
                                    data.append('action', 'search_form_jobs_submit_input');

                                    const headers = {
                                        'Accept': '*/*',
                                        'Accept-Encoding': 'gzip, deflate, br',
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                        'Origin': 'https://www.offer.az',
                                        'Referer': 'https://www.offer.az/is-elanlari-axtar/',
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'User-Agent': randomUserAgent(),
                                        'Connection': 'keep-alive',
                                        'Host': 'www.offer.az',
                                    };

                                    const timeoutPromise = new Promise((_, reject) =>
                                        setTimeout(() => reject(new Error('Request timed out')), 30000)
                                    );

                                    const response = await Promise.race([axios.post(url, data, {headers}), timeoutPromise]);
                                    console.log({response});

                                    const $ = cheerio.load(response.data);

                                    $('.cards-in-loop .job-card').each((i, el) => {
                                        const urlAndId = $(el).find('.job-card__title');
                                        const title = urlAndId.text().trim();
                                        const companyElement = $(el).find('.job-card__meta em');
                                        const company_name = companyElement.text().trim();
                                        const locationText = $(el).find('.job-card__meta').last().text().trim();
                                        const locationParts = locationText.split(' - ');
                                        let location = locationParts.length > 1 ? locationParts[1].trim() : locationParts[0].trim();
                                        const salaryText = $(el).find('.job-card__label').text().trim();
                                        const cleanSalaryText = salaryText.replace(/[₼\s]/g, '').trim();
                                        // const parts = cleanSalaryText.split('—');
                                        const description = $(el).find('.job-card__excerpt').text().trim();
                                        const jobId = urlAndId.attr('href')?.split('-').pop() || null;
                                        const redirectUrl = urlAndId.attr('href') || null;
                                        const parts = cleanSalaryText.includes('—') ? cleanSalaryText.split('—').map(part => part.trim()) : [cleanSalaryText.trim()];


                                        let [minSalary, maxSalary] = [0, 0];
                                        if (parts.length === 2) {
                                            minSalary = !isNaN(Number(parts[0])) ? parseInt(parts[0], 10) : 0;
                                            maxSalary = !isNaN(Number(parts[1])) ? parseInt(parts[1], 10) : 0;
                                        } else if (parts.length === 1) {
                                            minSalary = 0;
                                            maxSalary = !isNaN(Number(parts[0])) ? parseInt(parts[0], 10) : 0;
                                        }

                                        if (title) {
                                            jobData.push({
                                                title,
                                                company_name,
                                                min_salary: !isNaN(Number(minSalary)) ? minSalary : 0,
                                                max_salary: !isNaN(Number(maxSalary)) ? maxSalary : 0,
                                                location,
                                                city_id: bossAzCity?.cityId || null,
                                                description: description || null,
                                                job_id:jobId,
                                                category_id: category.local_category_id || null,
                                                source_url: this.url,
                                                redirect_url: redirectUrl,
                                                job_type: '0x001',
                                                education_id: this.mapEducation(education),
                                                experience_id: null,
                                                unique_key: `${title}-${company_name}-${location}`
                                            });
                                        }

                                    });

                                } catch (error) {
                                    console.error('Error or timeout:', error.message);
                                }
                            });

                            dataPromises.push(requestPromise);
                        }
                    }
                });
            }

            const results = await Promise.all(dataPromises);
            const data = results.flat();

            return jobData;

        } catch (error) {
            console.error('Error fetching jobs:', error.message, error.stack);
            throw new Error('Error fetching jobs');
        }
    }


    mapEducation(education) {
        return (education === -1 || education === -2) ? enums.Education.Secondary :
            (education === 15) ? enums.Education.IncompleteEducation :
                (education === 14) ? enums.Education.Higher :
                    (education === 12) ? enums.Education.Bachelor :
                        (education === 13) ? enums.Education.Master :
                            (education === 81) ? enums.Education.Doctor : 243;
    }

}

export default OfferAz;
