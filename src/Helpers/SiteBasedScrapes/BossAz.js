import pLimit from 'p-limit';
import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import category from "../../Models/Category.js";
import Category from "../../Models/Category.js";
import Enums from "../../Config/Enums.js";

class BossAz {
    constructor(url = enums.Sites.BossAz) {
        this.url = url;
    }

    async Categories() {
        try {
            const $ = await Scrape(this.url);
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


    async Jobs(categories, cities) {
        try {
            // Filter categories and cities
            const filteredCategories = categories.filter(c => c.website === enums.SitesWithId.BossAz);
            const filteredCities = cities.filter(c => c.website === enums.SitesWithId.BossAz);

            const limit = pLimit(+enums.LimitPerRequest);
            const dataPromises = [];

            for (const category of filteredCategories) {
                for (let education = 0; education <= 7; education++) {
                    for (let experience = 0; experience <= 4; experience++) {
                        for (let page = 0; page <= 2; page++) {
                            const requestPromise = limit(async () => {
                                const $ = await Scrape(`https://${this.url}/vacancies?action=index&controller=vacancies&only_path=true&page=${page}&search%5Bcategory_id%5D=${category.categoryId}&search%5Bcompany_id%5D=&search%5Beducation_id%5D=${education}&search%5Bexperience_id%5D=${experience}&search%5Bkeyword%5D=&search%5Bregion_id%5D=&search%5Bsalary%5D=&type=vacancies`);

                                const jobData = [];
                                $('.results-i').each((i, el) => {
                                    const urlAndId = $(el).find('.results-i-link');
                                    const htmlContent = $(el).find('.results-i-secondary').html();
                                    const location = htmlContent.match(/^(.*?)<span/)[1].trim();
                                    const title = $(el).find('.results-i-title').text().trim();
                                    const companyName = $(el).find('.results-i-company').text().trim();
                                    const description = $(el).find('.results-i-summary p').text().trim();
                                    const redirectUrl = urlAndId.attr('href');
                                    const jobId = redirectUrl.split('/').pop();
                                    const salaryText = $(el).find('.results-i-salary').text().trim();
                                    const cleanSalaryText = salaryText.replace('AZN', '').trim();
                                    const parts = cleanSalaryText.split(' - ');
                                    const companyHref = $(el).find('.results-i-company').attr('href');
                                    const companyUrlParams = new URLSearchParams(companyHref.split('?')[1]);
                                    const companyId = companyUrlParams.get('search[company_id]');

                                    let [minSalary, maxSalary] = [null, null];
                                    if (parts.length === 2) {
                                        minSalary = parseInt(parts[0], 10);
                                        maxSalary = parseInt(parts[1], 10);
                                    } else if (parts.length === 1) {
                                        minSalary = maxSalary = parseInt(parts[0], 10);
                                    }

                                    const locationCity = filteredCities.find(x => x.name === location);
                                    const localCategoryId = filteredCategories.find(x => x.categoryId === category.categoryId)?.localCategoryId;

                                    jobData.push({
                                        title,
                                        companyName,
                                        companyId,
                                        minSalary: isNaN(minSalary) ? null : minSalary,
                                        maxSalary: isNaN(maxSalary) ? null : maxSalary,
                                        location,
                                        cityId: locationCity ? +locationCity.cityId : null,
                                        description,
                                        jobId,
                                        categoryId: localCategoryId || null,
                                        sourceUrl: this.url,
                                        redirectUrl: 'https://' + this.url + redirectUrl,
                                        jobType: '0x001',
                                        educationId: +education,
                                        experienceId: experience,
                                        uniqueKey: `${title.replace(/ /g, '-')}-${companyName.replace(/ /g, '-')}-${location.replace(/ /g, '-')}`
                                    });
                                });

                                return jobData;
                            });

                            dataPromises.push(requestPromise);
                        }
                    }
                }
            }

            const results = await Promise.all(dataPromises);
            const data = results.flat();
            return data;

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
                const cityId = $(el).attr('value');
                const name = $(el).text().trim();
                if (cityId && name) {
                    cities.push({
                        cityId,
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

}

export default BossAz;
