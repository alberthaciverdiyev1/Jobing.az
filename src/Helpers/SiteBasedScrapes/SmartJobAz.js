import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';



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


    async Jobs(categories, cities) {

        let $ = await Scrape(`https://${this.url}`);
        const token = $('input[name="_token"]').val();
        try {
            const filteredCategories = categories.filter(c => c.website === enums.SitesWithId.SmartJobAz);
            const bossAzcities = cities.filter(c => c.website === enums.SitesWithId.BossAz);
            // const filteredCities = cities.filter(c => c.website === enums.SitesWithId.SmartJobAz);

            const limit = pLimit(+enums.LimitPerRequest);
            const dataPromises = [];

            for (const category of filteredCategories) {
                for (let education = 0; education <= 12; education++) {
                    for (let page = 0; page <= 2; page++) {
                        const requestPromise = limit(async () => {
                            // const $ = await Scrape(`https://${this.url}/vacancies?action=index&controller=vacancies&only_path=true&page=${page}&search%5Bcategory_id%5D=${category.categoryId}&search%5Bcompany_id%5D=&search%5Beducation_id%5D=${education}&search%5Bexperience_id%5D=${experience}&search%5Bkeyword%5D=&search%5Bregion_id%5D=&search%5Bsalary%5D=&type=vacancies`);
                            const $ = await Scrape(`https://${this.url}/vacancies?_token=${token}&job_category_id%5B20%5D=${category.categoryId}&education_id%5B0%5D=${education}&salary_from=&salary_to=&page=${page}`);
                            // let uri = `https://smartjob.az/vacancies?_token=${token}&job_category_id%5B20%5D=${category}&education_id%5B0%5D=${education}&salary_from=&salary_to=&page=${page}`;
                            // console.log({uri});
                            

                            const jobData = [];
                            $('.brows-job-list').each((i, el) => {
                                const urlAndId = $(el).find('h3 a');
                                const title = urlAndId.text().trim();
                                const companyElement = $(el).find('.company-title a');
                                const companyName = companyElement.text().trim();
                                const companyId = companyElement.attr('href').split('/').pop();
                                const location = $(el).find('.location-pin').text().trim();
                                const salaryText = $(el).find('.salary-val').text().trim();
                                const cleanSalaryText = salaryText.replace('AZN', '').trim();
                                const parts = cleanSalaryText.split(' - ');
                                const jobId = urlAndId.attr('href').split('/').pop();
                                const redirectUrl = urlAndId.attr('href');

                                let [minSalary, maxSalary] = [null, null];
                                if (parts.length === 2) {
                                    minSalary = parseInt(parts[0], 10);
                                    maxSalary = parseInt(parts[1], 10);
                                } else if (parts.length === 1) {
                                    minSalary = maxSalary = parseInt(parts[0], 10);
                                }

                                const locationCity = bossAzcities.find(x => x.name === location);
                                const localCategoryId = filteredCategories.find(x => x.categoryId === category.categoryId)?.localCategoryId;

                                jobData.push({
                                    title,
                                    companyName,
                                    companyId,
                                    minSalary: isNaN(minSalary) ? null : minSalary,
                                    maxSalary: isNaN(maxSalary) ? null : maxSalary,
                                    location,
                                    cityId: locationCity ? +locationCity.cityId : null,
                                    description: null,
                                    jobId,
                                    categoryId: localCategoryId || null,
                                    sourceUrl: this.url,
                                    redirectUrl,
                                    jobType: '0x001',
                                    educationId: ((education === 1 || education === 2 || education === 13) ? enums.Education.Secondary :
                                        (education === 5) ? enums.Education.Higher :
                                            (education === 6 || education === 7 || education === 11 || education === 10) ? enums.Education.IncompleteEducation :
                                                (education === 3) ? enums.Education.Bachelor :
                                                    (education === 2) ? enums.Education.Master :
                                                        (education === 1) ? enums.Education.Doctor : 0),
                                    experienceId: null,
                                    uniqueKey: `${title.replace(/ /g, '-')}-${companyName.replace(/ /g, '-')}-${location.replace(/ /g, '-')}`
                                });
                            });
                            // console.log({jobData});
                            
                            return jobData;
                        });

                        dataPromises.push(requestPromise);
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

}

export default SmartJobAz;
