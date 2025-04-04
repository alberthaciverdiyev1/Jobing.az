import pLimit from 'p-limit';
import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import Enums from "../../Config/Enums.js";

class BossAz {
    constructor(url = enums.Sites.BossAz) {
        this.url = url;
    }

    async Categories() {
        try {
            const $ = await Scrape('https://'+this.url);
            const categories = [];

            let mainCategoryId = null;
            $('#search_category_id option').each((i, option) => {
                const value = $(option).val();
                const text = $(option).text().trim();
                if (value) {
                    if (!text.startsWith('—')) {
                        mainCategoryId = value;
                        categories.push({
                            name: text,
                            categoryId: mainCategoryId,
                            parentId: null,
                            website: this.url,
                            websiteId: Enums.SitesWithId.BossAz,
                        });
                    }
                    else {
                        if (categories.length > 0) {
                            categories.push({
                                name: text.replace('— ', ''),
                                categoryId: value,
                                parentId: mainCategoryId,
                                website: this.url,
                                websiteId: Enums.SitesWithId.BossAz,
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


    async Jobs(categories, bossAzCity,main = false) {
        try {
            let splitCategories = categories
                .flatMap(c => c.boss_az.split(','))
                .map(jobId => jobId.trim())
                .filter(jobId => jobId !== '')
                .map(jobId => ({
                    local_category_id: categories.find(c => c.boss_az.includes(jobId)).local_category_id,
                    boss_az_id: jobId,
                }))

            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const limit = pLimit(+enums.LimitPerRequest);
            const dataPromises = [];
            let testCatId = 0;
            const city = Object.entries(enums.Cities.BossAz).find(
                ([k, v]) => v === bossAzCity.name
            );

            const city_id = city ? city[0] : null;
            if (city_id && (main ? true : (bossAzCity.name !== "Bakı" ? true : false))) {
                Object.entries(splitCategories).forEach(([no, category]) => {
                    for (let education = 0; education <= 7; education++) {
                        for (let experience = 0; experience <= 4; experience++) {
                            for (let page = 0; page <= 2; page++) {
                                const requestPromise = limit(async () => {
                                    const randomDelay = Math.floor(Math.random() * 15000) + 1000;
                                    // await delay(randomDelay);

                                    const timeout = new Promise((_, reject) => {
                                        setTimeout(() => reject(new Error('Request timed out after 30 seconds')), 30000);
                                    });
                                    try {
                                        const $ = await Promise.race([
                                            Scrape(`https://${this.url}/vacancies?action=index&controller=vacancies&only_path=true&page=${page}&search%5Bcategory_id%5D=${category.boss_az_id}&search%5Bcompany_id%5D=&search%5Beducation_id%5D=${education}&search%5Bexperience_id%5D=${experience}&search%5Bkeyword%5D=&search%5Bregion_id%5D=${city_id}&search%5Bsalary%5D=&type=vacancies`),
                                            timeout
                                        ]);

                                        const jobData = [];
                                        $('.results-i').each((i, el) => {
                                            const urlAndId = $(el).find('.results-i-link');
                                            const htmlContent = $(el).find('.results-i-secondary').html();
                                            const location = htmlContent.match(/^(.*?)<span/)[1].trim();
                                            const title = $(el).find('.results-i-title').text().trim();
                                            const company_name = $(el).find('.results-i-company').text().trim();
                                            const description = $(el).find('.results-i-summary p').text().trim();
                                            const redirect_url = urlAndId.attr('href');
                                            const job_id = redirect_url.split('/').pop();
                                            const salaryText = $(el).find('.results-i-salary').text().trim();
                                            const cleanSalaryText = salaryText.replace('AZN', '').trim();
                                            const parts = cleanSalaryText.split(' - ');
                                            const companyHref = $(el).find('.results-i-company').attr('href');
                                            const companyUrlParams = new URLSearchParams(companyHref.split('?')[1]);
                                            const company_id = companyUrlParams.get('search[company_id]');

                                            let [min_salary, max_salary] = [0, 0];
                                            if (parts.length === 2) {
                                                min_salary = !isNaN(Number(parts[0])) ? parseInt(parts[0], 10) : 0;
                                                max_salary = !isNaN(Number(parts[1])) ? parseInt(parts[1], 10) : 0;
                                            } else if (parts.length === 1) {
                                                min_salary = 0;
                                                max_salary = !isNaN(Number(parts[0])) ? parseInt(parts[0], 10) : 0;
                                            }

                                            jobData.push({
                                                title,
                                                company_name,
                                                company_id,
                                                min_salary,
                                                max_salary,
                                                location,
                                                city_id: city_id || null,
                                                description,
                                                job_id,
                                                category_id: category.local_category_id || null,
                                                source_url: this.url,
                                                redirect_url: 'https://' + this.url + redirect_url,
                                                job_type: '0x001',
                                                education_id: +education,
                                                experience_id: experience,
                                                unique_key: `${title}-${company_name}-${location}`
                                            });

                                        });

                                        return jobData;
                                    } catch (error) {
                                        console.error(`Error fetching data from page ${page} for category ${category.category_id}:`, error.message);
                                        return [];
                                    }
                                });

                                dataPromises.push(requestPromise);
                            }
                        }
                    }
                });
            }
            const results = await Promise.all(dataPromises);
            return results.flat();

        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw new Error('Error fetching jobs');
        }
    };




    async Cities() {
        try {
            const $ = await Scrape('https://' + this.url);
            const cities = [];

            $('#search_region_id option').each((i, el) => {
                const city_id = $(el).attr('value');
                const name = $(el).text().trim();
                if (city_id && name) {
                    cities.push({
                        city_id,
                        name,
                        website: enums.SitesWithId.BossAz
                    });
                }
            });

            return cities;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw new Error('Error fetching cities');
        }
    }

    async Companies() {
        try {
            const $ = await Scrape('https://' + this.url);
            const companies = [];

            $('.tab-list-i-link').each((i, el) => {
                const href = $(el).attr('href');
                const company_id_match = href.match(/company_id%5D=(\d+)/);
                const company_id = company_id_match ? company_id_match[1] : null;
                const name = $(el).text().trim();

                if (company_id && name) {
                    companies.push({
                        company_id,
                        company_name: name,
                        unique_key: `${company_id}` + `${enums.SitesWithId.BossAz}`,
                        website: enums.SitesWithId.BossAz
                    });
                }
            });
            return companies;
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw new Error('Error fetching companies');
        }
    }



}

export default BossAz;
