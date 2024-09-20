import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";



class SmartJobAz {
    constructor(url = enums.Sites.SmartJobAz) {
        this.url = url;
    }

    async  Categories() {
        try {
            const $ = await Scrape('StaticHtmls/SmartJobAz/CategoriesModal.html',true);

            const categories = [];

            $('.cat-root').each((i, el) => {
                const CategoryName = $(el).find('.cat-title').text().trim();
                const CategoryValue = $(el).find('.cat-root-checkbox').val();

                categories.push({
                    name: CategoryName,
                    value: +CategoryValue,
                    parentId: null,
                    website: this.url
                });

                $(el).find('.cat-sub-root .sub-item-cat').each((j, subEl) => {
                    const subCategoryName = $(subEl).find('.cat-sub-title').text().trim();
                    const subCategoryValue = $(subEl).find('.cat-sub-root-checkbox').val();

                    if (subCategoryName && subCategoryValue) {
                        categories.push({
                            name: subCategoryName,
                            value: +subCategoryValue,
                            parentId: CategoryValue,
                            website: this.url
                        });
                    }
                });
            });

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error fetching categories');
        }
    }


    async Jobs(categories) {
        try {
            const data = [];
            // for (let category of categories) {
            //     for (let i = 0; i <= 50; i++) {
            const $ = await Scrape(`https://smartjob.az/vacancies?_token=LM65f6CFB1COGVcQoGEdPQlUiEk1NgVHZKI7E7Er&job_category_id%5B0%5D=9&job_category_id%5B1%5D=9&job_category_id%5B2%5D=54&salary_from=&salary_to=&page=2`);

            $('.item-click').each((i, el) => {
                const title = $(el).find('.brows-job-position h3 a').text().trim();
                const company = $(el).find('.company-title a').text().trim();
                const location = $(el).find('.location-pin').text().trim();
                const salary = $(el).find('.salary-val, .salary-mob').text().trim().split('\n')[0].trim();
                const jobId = $(el).find('.bookmark-link').attr('data-id');
                const redirectUrl = $(el).find('.brows-job-position h3 a').attr('href');
                const jobType = $(el).find('.job-type-block .job-type').text().trim();
                const postedAt = $(el).find('.created-date').text().trim().replace('Yerləşdirilib', '').trim();
                const imageUrl = $(el).find('.brows-job-company-img img').attr('src');
                data.push({
                    title,
                    company,
                    location,
                    minSalary :salary.isNumeric ? salary : null,
                    jobId,
                    jobType,
                    postedAt,
                    categoryId : 1,
                    subCategoryId:2,
                    sourceUrl: this.url,
                    redirectUrl,
                    imageUrl
                });
            });
            console.log(data);
            // }
            // }
            return data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw new Error('Error fetching jobs');
        }
    }

}

export default SmartJobAz;
