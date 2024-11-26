import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import randomUserAgent from "../../Config/UserAgents.js";
import CompanyService from '../../Services/CompanyService.js';


const cities = {
    "1": "Bakı", "2": "Gəncə", "3": "Sumqayıt", "5": "Şəki", "6": "Lənkəran", "7": "Yevlax", "8": "Göyçay", "9": "Tovuz", "10": "Qəbələ", "11": "Gədəbəy", "12": "Goranboy", "13": "Oğuz", "14": "Zaqatala", "15": "Mingəçevir",
    "16": "Xızı", "17": "Xırdalan", "20": "Ağstafa", "21": "Ucar", "22": "Göygöl", "24": "Xaçmaz", "26": "Yardımlı", "27": "Daşkəsən", "28": "Kürdəmir", "29": "Hacıqabul", "30": "Qax", "31": "Qazax",
    "32": "Tərtər", "33": "Biləsuvar", "34": "Şəmkir", "36": "Quba", "37": "Qusar", "38": "Babək", "39": "Füzuli", "40": "Cəbrayıl", "41": "Salyan", "43": "Astara",
    "44": "Culfa", "45": "Ağdaş", "47": "Masallı", "49": "Beyləqan", "50": "Ağsu", "51": "Qobustan", "52": "Bərdə", "53": "Ordubad", "54": "Balakən", "55": "İsmayıllı",
    "56": "Şuşa", "57": "Samux", "58": "Ağcabədi", "59": "Ağdam", "60": "Dəvəçi", "61": "İmişli", "62": "Saatlı", "63": "Naxçıvan", "64": "Siyəzən", "65": "Şahbuz", "66": "Cəlilabad",
    "67": "Sabirabad", "68": "Neftçala", "69": "Laçın", "70": "Naftalan", "71": "Zərdab", "72": "Şərur", "73": "Qıvraq", "74": "Şirvan", "75": "Şamaxı"
};

// const cities = {
//     "1": "Bakı"
// };

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
                    }
                    else {
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


    async Jobs(categories, bossAzcities) {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
            const filteredCategories = categories.filter(c => c.website === enums.SitesWithId.HelloJobAz);

            const limit = pLimit(1);
            const dataPromises = [];
            const educationIds = [1, 2, 3, 4, 5, 6];
            const jobData = [];
            const companyData = [];

            Object.entries(cities).forEach(([cityId, cityName]) => {

                for (const category of filteredCategories) {

                    for (const education of educationIds) {

                        for (let page = 0; page <= 2; page++) {

                            const requestPromise = limit(async () => {
                                try {
                                    const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1-20 seconds
                                    // await delay(randomDelay);
                                    let url = `https://www.${this.url}/search?direction=works&category_id=${category.categoryId}&region_id=${cityId}&salary_min=&education_type=${education}&work_exp=0&search_type=filter`
                                    const $ = await Scrape(url);

                                    $('.vacancies__item').each((i, el) => {
                                        const urlAndId = $(el).attr('href');
                                        const title = $(el).find('h3').text().trim();
                                        const companyName = $(el).find('.vacancy_item_company').text().trim();
                                        const companyId = companyName;
                                        const jobId = urlAndId?.split('/').pop() || null;
                                        const redirectUrl = urlAndId || null;
                                        const salaryText = $(el).find('.vacancies__price').text().trim();
                                        // const cleanSalaryText = salaryText ? salaryText.replace('₼', '').trim() : null;
                                        const match = salaryText.match(/[₼$€]/);
                                        const currencySign = match ? match[0] : null;
                                        const cleanSalaryText = salaryText ? salaryText.replace(/[₼$€]/g, '').trim() : null;
                                        const parts = cleanSalaryText ? cleanSalaryText.split('—') : [];
                                        let [minSalary, maxSalary] = [0, 0];

                                        if (parts.length === 2) {
                                            minSalary = parseInt(parts[0], 10);
                                            maxSalary = parseInt(parts[1], 10);
                                        } else if (parts.length === 1) {
                                            minSalary = maxSalary = parseInt(parts[0], 10);
                                        }

                                        const location = $(el).find('.vacancy_item_time').last().text().trim();
                                        const description = $(el).find('.vacancies__desc').text().trim();

                                        const companyImageUrl = $(el).find('.vacancies__icon img').attr('src') || null;
                                        const locationCity = bossAzcities.find(x => x.name === cityName);
                                        const localCategoryId = filteredCategories.find(x => x.categoryId === category.categoryId)?.localCategoryId;

                                        jobData.push({
                                            title,
                                            companyName,
                                            companyId,
                                            minSalary,
                                            maxSalary,
                                            location: cityName,
                                            description,
                                            cityId: locationCity ? +locationCity.cityId : null,
                                            categoryId: localCategoryId,
                                            jobId,
                                            sourceUrl: this.url,
                                            redirectUrl: `https://${this.url}` + redirectUrl,
                                            jobType: '0x001',
                                            educationId: this.mapEducation(education),
                                            experienceId: null,
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
                                    console.error('Error:', error);
                                }
                            });

                            dataPromises.push(requestPromise);
                        }
                    }
                }
            });

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
        return (education === 5 || education === 6) ? enums.Education.Secondary :
            (education === 3 || education === 4) ? enums.Education.IncompleteEducation :
                (education === 2) ? enums.Education.Bachelor :
                    (education === 1) ? enums.Education.Master :
                        (education === 7) ? enums.Education.Doctor : 0;
    }

}

export default HelloJobAz;
