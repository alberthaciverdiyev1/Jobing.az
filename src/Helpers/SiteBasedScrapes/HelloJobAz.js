import Scrape from "../ScrapeHelper.js";
import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import randomUserAgent from "../../Config/UserAgents.js";

const cities = {
    "1": "Bakı", "2": "Gəncə", "3": "Sumqayıt", "5": "Şəki", "6": "Lənkəran", "7": "Yevlax", "8": "Göyçay", "9": "Tovuz", "10": "Qəbələ", "11": "Gədəbəy", "12": "Goranboy", "13": "Oğuz", "14": "Zaqatala", "15": "Mingəçevir",
    "16": "Xızı", "17": "Xırdalan", "20": "Ağstafa", "21": "Ucar", "22": "Göygöl", "24": "Xaçmaz", "26": "Yardımlı","27": "Daşkəsən", "28": "Kürdəmir", "29": "Hacıqabul","30": "Qax", "31": "Qazax",
    "32": "Tərtər", "33": "Biləsuvar", "34": "Şəmkir", "36": "Quba", "37": "Qusar", "38": "Babək", "39": "Füzuli", "40": "Cəbrayıl", "41": "Salyan", "43": "Astara",
    "44": "Culfa", "45": "Ağdaş", "47": "Masallı", "49": "Beyləqan", "50": "Ağsu", "51": "Qobustan", "52": "Bərdə", "53": "Ordubad", "54": "Balakən", "55": "İsmayıllı",
    "56": "Şuşa", "57": "Samux", "58": "Ağcabədi", "59": "Ağdam", "60": "Dəvəçi", "61": "İmişli", "62": "Saatlı","63": "Naxçıvan", "64": "Siyəzən", "65": "Şahbuz", "66": "Cəlilabad",
    "67": "Sabirabad", "68": "Neftçala", "69": "Laçın", "70": "Naftalan", "71": "Zərdab", "72": "Şərur", "73": "Qıvraq", "74": "Şirvan", "75": "Şamaxı"
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
            const filteredCategories = categories.filter(c => c.website === enums.SitesWithId.OfferAz);

            const limit = pLimit(1);
            const dataPromises = [];
            const educationIds = [249, 15, 14, 12, 13, 81, -1, -2];
            const filteredJobs = [];
            const seenUrls = new Set();
            const jobData = [];

            for (const category of filteredCategories) {
                for (let salary = 0; salary < 5000; salary += 100) {
                    for (const education of educationIds) {
                        for (let page = 0; page <= 2; page++) {
                            const requestPromise = limit(async () => {
                                try {
                                    const randomDelay = Math.floor(Math.random() * 20000) + 1000; // 1-20 seconds
                                    await delay(randomDelay);

                                    const url = `https://${this.url}/wp-admin/admin-ajax.php`;

                                    const data = new URLSearchParams();
                                    data.append('select_category', category);
                                    data.append('cur_page', page);
                                    data.append('form_mode', 'long');
                                    data.append('salary', salary);
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

                                    const response = await axios.post(url, data, { headers });

                                    const $ = cheerio.load(response.data);

                                    $('.cards-in-loop .job-card').each((i, el) => {
                                        const urlAndId = $(el).find('.job-card__title');
                                        const title = urlAndId.text().trim();
                                        const companyElement = $(el).find('.job-card__meta em');
                                        const companyName = companyElement.text().trim();
                                        const companyId = companyName;
                                        const locationText = $(el).find('.job-card__meta').last().text().trim();
                                        const locationParts = locationText.split(' - ');
                                        let location = locationParts.length > 1 ? locationParts[1].trim() : locationParts[0].trim();
                                        const salaryText = $(el).find('.job-card__label').text().trim();
                                        const cleanSalaryText = salaryText.replace('₼', '').trim();
                                        const parts = cleanSalaryText.split('—');
                                        const description = $(el).find('.job-card__excerpt').text().trim();

                                        const jobId = urlAndId.attr('href')?.split('-').pop() || null;
                                        const redirectUrl = urlAndId.attr('href') || null;

                                        let [minSalary, maxSalary] = [null, null];
                                        if (parts.length === 2) {
                                            minSalary = parseInt(parts[0], 10);
                                            maxSalary = parseInt(parts[1], 10);
                                        } else if (parts.length === 1) {
                                            minSalary = maxSalary = parseInt(parts[0], 10);
                                        }

                                        const locationCity = bossAzcities.find(x => x.name === location)?.cityId;
                                        const localCategoryId = filteredCategories.find(x => x.categoryId === category.categoryId)?.localCategoryId;

                                        jobData.push({
                                            title,
                                            companyName,
                                            companyId,
                                            minSalary: isNaN(minSalary) ? null : minSalary,
                                            maxSalary: isNaN(maxSalary) ? null : maxSalary,
                                            location,
                                            cityId: locationCity || null,
                                            description: description || null,
                                            jobId,
                                            categoryId: localCategoryId || null,
                                            sourceUrl: this.url,
                                            redirectUrl,
                                            jobType: '0x001',
                                            educationId: this.mapEducation(education),
                                            experienceId: null,
                                            uniqueKey: `${title.replace(/ /g, '-')}-${companyName.replace(/ /g, '-')}-${location.replace(/ /g, '-')}`
                                        });
                                        console.log({ jobData });

                                    });

                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            });

                            dataPromises.push(requestPromise);
                        }
                    }
                }
            }

            const results = await Promise.all(dataPromises);
            const data = results.flat();

            data.forEach(job => {
                if (!seenUrls.has(job.redirectUrl)) {
                    seenUrls.add(job.redirectUrl);
                    filteredJobs.push(job);
                }
            });
            return filteredJobs;

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

export default HelloJobAz;
