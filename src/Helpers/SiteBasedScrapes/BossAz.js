import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import category from "../../Models/Category.js";
import Category from "../../Models/Category.js";
import Enums from "../../Config/Enums.js";

class BossAz {
    constructor(url = enums.Sites.BossAz) {
        this.url = "https://" + url;
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

    async Jobs(categories) {
        try {
            console.log(categories);return;
            
            const data = [];
            // for (let category of categories) {
            // for (let i = 0; i <= 50; i++) { 
            const $ = await Scrape(`https://${this.url}/vacancies?action=index&controller=vacancies&only_path=true&page=${1}&search%5Bcategory_id%5D=${38}&search%5Bcompany_id%5D=&search%5Beducation_id%5D=&search%5Bexperience_id%5D=&search%5Bkeyword%5D=&search%5Bregion_id%5D=&search%5Bsalary%5D=&type=vacancies`);

            $('.results-i').each((i, el) => {
                const urlAndId = $(el).find('.results-i-link');
                const htmlContent = $(el).find('.results-i-secondary').html();
                const location = htmlContent.match(/^(.*?)<span/)[1].trim();
                const title = $(el).find('.results-i-title').text().trim();
                const company = $(el).find('.results-i-company').text().trim();
                const description = $(el).find('.results-i-summary p').text().trim();
                const redirectUrl = urlAndId.attr('href');
                const jobId = redirectUrl.split('/').pop();
                const categoryLinks = $(el).find('.results-i-secondary a');

                const salaryText = $(el).find('.results-i-salary').text().trim();
                const cleanSalaryText = salaryText.replace('AZN', '').trim();
                const parts = cleanSalaryText.split(' - ');

                let minSalary = null;
                let maxSalary = null;
                let categoryId = null;
                let subCategoryId = null;

                if (parts.length === 2) {
                    minSalary = parseInt(parts[0], 10);
                    maxSalary = parseInt(parts[1], 10);
                } else if (parts.length === 1) {
                    minSalary = parseInt(parts[0], 10);
                    maxSalary = minSalary;
                }
                if (isNaN(minSalary)) {
                    minSalary = null;
                }
                if (isNaN(maxSalary)) {
                    maxSalary = null;
                }

                categoryLinks.each((index, link) => {
                    const href = $(link).attr('href');
                    const match = href.match(/search%5Bcategory_id%5D=(\d+)/);
                    if (match) {
                        if (index === 0) {
                            categoryId = match[1];
                        } else if (index === 1) {
                            subCategoryId = match[1];
                        }
                    }
                });

                data.push({
                    title,
                    company,
                    minSalary,
                    maxSalary,
                    description,
                    location,
                    jobId,
                    categoryId,
                    subCategoryId,
                    sourceUrl: this.url,
                    redirectUrl: 'https://' + this.url + redirectUrl,
                    jobType: '0x001',
                });
                // console.log({ data });

            });
            // }
            // }
            return data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw new Error('Error fetching jobs');
        }
    }

    async Cities() {
        try {
            const $ = await Scrape(this.url);
            const cities = [];

            $('#search_region_id option').each((i, el) => {
                const value = $(el).attr('value');
                const name = $(el).text().trim();
                if (value && name) {
                    cities.push({
                        value,
                        name,
                        website: this.url
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
