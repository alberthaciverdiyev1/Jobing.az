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
        let $ = await Scrape(`https://${this.url}`);
        const token = $('input[name="_token"]').val();

        try {
            const filteredCategories = categories.filter(c => c.website === enums.SitesWithId.SmartJobAz);
            const limit = pLimit(3);
            const dataPromises = [];
            const educationIds = [1, 2, 5, 6, 7, 9, 10, 11, 12, 13, 0];
            const filteredJobs = [];
            const seenUrls = new Set();
            const jobData = [];
            const companyData = [];
            for (const category of filteredCategories) {
                for (const education of educationIds) {
                    for (let page = 0; page <= 2; page++) {
                        const requestPromise = limit(async () => {
                            try {
                                const url = `https://${this.url}/vacancies?_token=${encodeURIComponent(token)}&job_category_id%5B20%5D=${encodeURIComponent(category.categoryId)}&education_id%5B0%5D=${encodeURIComponent(education)}&salary_from=&salary_to=&page=${page}`;
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
                                    const jobId = urlAndId.attr('href')?.split('/').pop() || null;
                                    const redirectUrl = urlAndId.attr('href') || null;
                                    let [minSalary, maxSalary] = [null, null];
                                    if (parts.length === 2) {
                                        minSalary = parseInt(parts[0], 10);
                                        maxSalary = parseInt(parts[1], 10);
                                    } else if (parts.length === 1) {
                                        minSalary = maxSalary = parseInt(parts[0], 10);
                                    }

                                    const locationCity = bossAzcities.find(x => x.name === location);

                                    jobData.push({
                                        title,
                                        companyName,
                                        companyId,
                                        minSalary,
                                        maxSalary,
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
                                    // console.log({companyData});

                                });

                            } catch (error) {
                                console.error(`Error fetching data from ${url}:`, error.message);
                                return [];
                            }
                        });

                        dataPromises.push(requestPromise);
                    }
                }
            }

            const results = await Promise.all(dataPromises);
            results.flat();
            const companyResult = await CompanyService.create(companyData);
            if (companyResult.status === 200 || companyResult.status === 201) {
                return jobData;

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
