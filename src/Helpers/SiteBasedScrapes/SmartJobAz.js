import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';
import CompanyService from '../../Services/CompanyService.js';




class SmartJobAz {
    constructor(url = enums.Sites.SmartJobAz) {
        this.url = url;
    }
    async Categories() {
        try {
            const $ = await Scrape('StaticHtmls/SmartJobAz/CategoriesModal.html', true);

            const categories = [];
            let mainCategoryId = null;

            $('.cat-root').each((i, el) => {
                const CategoryName = $(el).find('.cat-title').text().trim();
                const CategoryValue = $(el).find('.cat-root-checkbox').val();

                if (CategoryValue) {
                    mainCategoryId = CategoryValue;

                    categories.push({
                        name: CategoryName,
                        categoryId: +CategoryValue,
                        parentId: null,
                        website: this.url,
                        websiteId: enums.SitesWithId.SmartJobAz
                    });

                    $(el).find('.cat-sub-root .sub-item-cat').each((j, subEl) => {
                        const subCategoryName = $(subEl).find('.cat-sub-title').text().trim();
                        const subCategoryValue = $(subEl).find('.cat-sub-root-checkbox').val();

                        if (subCategoryName && subCategoryValue) {
                            categories.push({
                                name: subCategoryName,
                                categoryId: +subCategoryValue,
                                parentId: mainCategoryId,
                                website: this.url,
                                websiteId: enums.SitesWithId.SmartJobAz
                            });
                        }
                    });
                }
            });

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error fetching categories');
        }
    }

    async Jobs(categories, bossAzcities) {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        try {

            let splitCategories = categories
            .flatMap(c => c.smartJobAz.split(','))
            .map(jobId => jobId.trim())
            .filter(jobId => jobId !== '')
            .map(jobId => ({
                localCategoryId: categories.find(c => c.smartJobAz.includes(jobId)).localCategoryId,
                smartJobAzId: jobId,
            }));

            let $ = await Scrape(`https://${this.url}`);
            const token = $('input[name="_token"]').val();

            const limit = pLimit(3);
            const dataPromises = [];
            const educationIds = [1, 2, 5, 6, 7, 9, 10, 11, 12, 13, 0];
            const jobData = [];
            const companyData = [];

            Object.entries(splitCategories).forEach(([no, category]) => {
                for (const education of educationIds) {
                    for (let page = 0; page <= 2; page++) {
                        const requestPromise = limit(async () => {
                            try {
                                const url = `https://${this.url}/vacancies?_token=${encodeURIComponent(token)}&job_category_id%5B20%5D=${encodeURIComponent(category.smartJobAzId)}&education_id%5B0%5D=${encodeURIComponent(education)}&salary_from=&salary_to=&page=${page}`;

                                const timeout = new Promise((_, reject) => {
                                    setTimeout(() => reject(new Error('Request timed out')), 30000);
                                });

                                const fetchPromise = (async () => {
                                    const $ = await Scrape(url);
                                    $('.brows-job-list').each((i, el) => {
                                        const urlAndId = $(el).find('h3 a');
                                        const title = urlAndId.text().trim();
                                        const companyElement = $(el).find('.company-title a');
                                        const companyName = companyElement.text().trim();
                                        const companyId = companyElement.attr('href')?.split('/').pop() || null;
                                        const location = $(el).find('.location-pin').text().trim();
                                        const salaryText = $(el).find('.salary-val').text().trim();
                                        const companyImageUrl = $(el).find('.brows-job-company-img img').attr('src');
                                        const cleanSalaryText = salaryText.replace('AZN', '').trim();
                                        const parts = cleanSalaryText.split(' - ');
                                        const isPremium = $(el).find('.tg-featuretag').length > 0;
                                        const jobId = urlAndId.attr('href')?.split('/').pop() || null;
                                        const redirectUrl = urlAndId.attr('href') || null;
                                        let [minSalary, maxSalary] = [0, 0];
                                        if (parts.length === 2) {
                                            minSalary = !isNaN(Number(parts[0])) ? parseInt(parts[0], 10) : 0;
                                            maxSalary = !isNaN(Number(parts[1])) ? parseInt(parts[1], 10) : 0;
                                        } else if (parts.length === 1) {
                                            minSalary = 0;
                                            maxSalary = !isNaN(Number(parts[0])) ? parseInt(parts[0], 10) : 0;
                                        }

                                        const locationCity = bossAzcities.find(x => x.name === location);

                                        jobData.push({
                                            title,
                                            companyName,
                                            isPremium,
                                            companyId,
                                            minSalary: minSalary ?? 0,
                                            maxSalary: maxSalary ?? 0,
                                            location,
                                            cityId: locationCity ? +locationCity.cityId : null,
                                            description: null,
                                            jobId,
                                            categoryId: category.localCategoryId || null,
                                            sourceUrl: this.url,
                                            redirectUrl,
                                            jobType: '0x001',
                                            educationId: this.mapEducation(education),
                                            experienceId: null,
                                            uniqueKey: `${title}-${companyName}-${location}`
                                        });

                                        companyData.push({
                                            companyName,
                                            imageUrl: companyImageUrl,
                                            website: enums.SitesWithId.SmartJobAz,
                                            uniqueKey: `${companyName}-${companyImageUrl}`
                                        });
                                        console.log({"SmartJob": jobData})

                                    });
                                })();

                                await Promise.race([fetchPromise, timeout]);

                            } catch (error) {
                                console.error(`Error fetching data from ${url}:`, error.message);
                                return [];
                            }
                        });

                        dataPromises.push(requestPromise);
                    }
                }
            });

            const results = await Promise.all(dataPromises);
            results.flat();

            const companyResult = await CompanyService.create(companyData);
            if (companyResult.status === 200 || companyResult.status === 201) {
                return jobData;
            } else {
                console.error('Failed to save company data:', companyResult);
                throw new Error('Failed to save company data');
            }

        } catch (error) {
            console.error('Error fetching jobs:', error.message, error.stack);
            throw new Error('Error fetching jobs');
        }
    }

    mapEducation(education) {
        return (education === 10 || education === 2 || education === 13 || education === 6) ? enums.Education.Secondary :
            (education === 0 || education === 7) ? enums.Education.IncompleteEducation :
                (education === 5) ? enums.Education.Higher :
                    (education === 11) ? enums.Education.Bachelor :
                        (education === 9) ? enums.Education.Master :
                            (education === 12) ? enums.Education.Doctor : 0;
    }

}

export default SmartJobAz;
